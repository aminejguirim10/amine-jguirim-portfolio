import {
  APICallError,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";

import { streamWithFallback } from "@/lib/ai/route";
import { buildSystemPrompt, chatTools } from "@/lib/assistant";

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const routed = await streamWithFallback({
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    tools: chatTools,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: routed.stream, onError: explain }),
  });
}

function explain(error: unknown): string {
  if (error instanceof APICallError) {
    if (error.statusCode === 429 || error.statusCode === 503) {
      return "Tous les modèles sont saturés à l'instant. Réessaie dans un instant.";
    }
  }

  return "Le chatbot est momentanément indisponible. Réessaie dans un instant.";
}