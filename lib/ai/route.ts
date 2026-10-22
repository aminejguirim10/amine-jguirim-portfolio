import {
  hasToolCall,
  isStepCount,
  streamText,
  type LanguageModel,
  type ModelMessage,
  type TextStreamPart,
  type ToolSet,
} from "ai";

import { chatChain } from "./models";

const FIRST_TOKEN_TIMEOUT_MS = Number(process.env.CHAT_FIRST_TOKEN_TIMEOUT_MS ?? 20_000);

const SILENT_PARTS = new Set([
  "start",
  "start-step",
  "finish-step",
  "finish",
  "abort",
  "text-start",
  "text-end",
  "reasoning-start",
  "reasoning-end",
  "tool-input-end",
  "raw",
]);

export type RouteOptions<TOOLS extends ToolSet> = {
  system: string;
  messages: ModelMessage[];
  tools?: TOOLS;
};

export type RoutedStream<TOOLS extends ToolSet> = {
  stream: ReadableStream<TextStreamPart<TOOLS>>;
  servedBy: string | null;
  skipped: string[];
};

export async function streamWithFallback<TOOLS extends ToolSet>(
  options: RouteOptions<TOOLS>,
): Promise<RoutedStream<TOOLS>> {
  const chain = chatChain({ requiresTools: Boolean(options.tools) });
  const skipped: string[] = [];
  const failures: unknown[] = [];

  for (const candidate of chain) {
    try {
      const attempt = await runAttempt(candidate, options);
      if (attempt.stream) {
        return { stream: attempt.stream as ReadableStream<TextStreamPart<TOOLS>>, servedBy: candidate.label, skipped };
      }
      if (attempt.aborted) {
        return { stream: silentStream<TOOLS>(), servedBy: candidate.label, skipped };
      }
      skipped.push(candidate.label);
      failures.push(attempt.error);
    } catch (error) {
      skipped.push(candidate.label);
      failures.push(error);
    }
  }

  return {
    stream: errorStream<TOOLS>(failures[0] ?? new Error("chaîne de modèles vide")),
    servedBy: null,
    skipped,
  };
}

async function runAttempt<TOOLS extends ToolSet>(
  candidate: { label: string; model: LanguageModel },
  options: RouteOptions<TOOLS>,
): Promise<{ stream?: ReadableStream<TextStreamPart<TOOLS>>; error?: unknown; aborted?: boolean }> {
  const abort = new AbortController();
  const result = streamText({
    model: candidate.model,
    system: options.system,
    messages: options.messages,
    tools: options.tools,
    abortSignal: abort.signal,
    maxRetries: 0,
    stopWhen: [isStepCount(2), hasToolCall("downloadCv"), hasToolCall("sendEmail")],
  });

  const reader = result.stream.getReader();
  const pending: TextStreamPart<TOOLS>[] = [];

  try {
    for (;;) {
      const next = await withTimeout(reader.read(), FIRST_TOKEN_TIMEOUT_MS, abort);

      if (next.timedOut) {
        await cancel(reader);
        return { error: new Error(`${candidate.label}: aucun token en ${FIRST_TOKEN_TIMEOUT_MS} ms`) };
      }

      const part = next.part;

      if (!part) {
        await cancel(reader);
        return { error: new Error(`${candidate.label}: flux terminé sans contenu`) };
      }

      if (part.type === "error") {
        await cancel(reader);
        return { error: part.error };
      }

      if (part.type === "abort") {
        await cancel(reader);
        return { aborted: true };
      }

      pending.push(part);

      if (!SILENT_PARTS.has(part.type)) {
        return { stream: forward(pending, reader) };
      }
    }
  } catch (error) {
    await cancel(reader);
    return { error };
  }
}

function forward<TOOLS extends ToolSet>(
  pending: TextStreamPart<TOOLS>[],
  reader: ReadableStreamDefaultReader<TextStreamPart<TOOLS>>,
): ReadableStream<TextStreamPart<TOOLS>> {
  let cursor = 0;

  return new ReadableStream<TextStreamPart<TOOLS>>({
    async pull(controller) {
      if (cursor < pending.length) {
        controller.enqueue(pending[cursor++]);
        return;
      }
      const { done, value } = await reader.read();
      if (done) controller.close();
      else if (value) controller.enqueue(value);
    },
    cancel(reason) {
      void reader.cancel(reason).catch(() => {});
    },
  });
}

function silentStream<TOOLS extends ToolSet>(): ReadableStream<TextStreamPart<TOOLS>> {
  return new ReadableStream<TextStreamPart<TOOLS>>({
    start(controller) {
      controller.close();
    },
  });
}

function errorStream<TOOLS extends ToolSet>(error: unknown): ReadableStream<TextStreamPart<TOOLS>> {
  return new ReadableStream<TextStreamPart<TOOLS>>({
    start(controller) {
      controller.enqueue({ type: "error", error } as TextStreamPart<TOOLS>);
      controller.close();
    },
  });
}

type Timeout<T> = { part?: T; timedOut: true } | { part: T; timedOut: false };

async function withTimeout<T>(read: Promise<ReadableStreamReadResult<T>>, ms: number, abort: AbortController): Promise<Timeout<T>> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const expiry = new Promise<{ timedOut: true }>((resolve) => {
    timer = setTimeout(() => {
      abort.abort();
      resolve({ timedOut: true });
    }, ms);
  });

  try {
    const result = await Promise.race([
      read.then((value) => ({ part: value.value as T, timedOut: false as const })),
      expiry,
    ]);
    return result as Timeout<T>;
  } finally {
    clearTimeout(timer);
  }
}

async function cancel(reader: ReadableStreamDefaultReader<unknown>) {
  try {
    await reader.cancel();
  } catch {
  }
}