"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import {
  lastAssistantMessageIsCompleteWithToolCalls,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import {
  CheckIcon,
  ChevronsDownIcon,
  ChevronsRightIcon,
  CopyIcon,
  GripVerticalIcon,
  MessagesSquareIcon,
  PanelBottomIcon,
  Trash2Icon,
} from "lucide-react";

import { Composer } from "@/components/ask-ai/composer";
import { useDraggable } from "@/components/ask-ai/drag";
import { EmailDialog, type EmailDraft } from "@/components/ask-ai/email-dialog";
import {
  Thread,
  toolStateOf,
  type ToolOutcome,
  type ToolView,
} from "@/components/ask-ai/thread";
import { expandBar, toggleMode, type Mode } from "@/components/ask-ai/store";
import type { Chat } from "@/components/ask-ai/types";
import type { MessageView } from "@/components/ask-ai/thread";
import { chatTools } from "@/lib/assistant";
import { getCredential } from "@/lib/certifications";
import { getProject, repoUrl } from "@/lib/projects";
import { cv, identity } from "@/lib/site";
import { cn } from "@/lib/utils";


type ChatMessage = UIMessage<unknown, UIDataTypes, InferUITools<typeof chatTools>>;

type ProjectListItem = NonNullable<ToolView["projects"]>[number];
type CredentialListItem = NonNullable<ToolView["credentials"]>[number];

function parseProjectList(value: string | undefined): ProjectListItem[] | undefined {
  if (!value) return undefined;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;

    return parsed.filter(
      (item): item is ProjectListItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.name === "string" &&
        typeof item.kicker === "string" &&
        typeof item.url === "string" &&
        typeof item.year === "string" &&
        Array.isArray(item.stack) &&
        item.stack.every((stackItem: unknown) => typeof stackItem === "string"),
    );
  } catch {
    return undefined;
  }
}

function parseCredentialList(value: string | undefined): CredentialListItem[] | undefined {
  if (!value) return undefined;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;

    return parsed.filter(
      (item): item is CredentialListItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.title === "string" &&
        typeof item.summary === "string" &&
        typeof item.url === "string" &&
        typeof item.kind === "string" &&
        typeof item.issuer === "string" &&
        (item.icon === "award" || item.icon === "medal"),
    );
  } catch {
    return undefined;
  }
}

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");


export function AskAiSurface({
  mode,
  onClose,
  open,
  pending,
}: {
  mode: Mode;
  onClose: () => void;
  open: boolean;
  pending: string | null;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const shellRef = React.useRef<HTMLDivElement>(null);
  const openerRef = React.useRef<HTMLElement | null>(null);

  const [input, setInput] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [stoppedUserMessageIds, setStoppedUserMessageIds] = React.useState<string[]>([]);

  const [applied, setApplied] = React.useState<string | null>(null);

  if (pending !== null && pending !== applied) {
    setApplied(pending);
    setInput(pending);
  }

  const [draft, setDraft] = React.useState<EmailDraft | null>(null);
  const [outcomes, setOutcomes] = React.useState<Record<string, ToolOutcome>>({});

  const {
    messages,
    sendMessage,
    regenerate,
    status,
    error,
    stop,
    setMessages,
    addToolOutput,
  } = useChat<ChatMessage>({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;

      if (toolCall.toolName === "sendEmail") {
        setDraft({
          toolCallId: toolCall.toolCallId,
          subject: toolCall.input.subject,
          body: toolCall.input.body,
        });
      }
    },
  });

  const busy = status === "submitted" || status === "streaming";

  const views = React.useMemo<MessageView[]>(
    () =>
      messages.map((message) => {
        const tools: ToolView[] = [];
        let text = "";

        for (const part of message.parts) {
          if (part.type === "text") {
            text += part.text;
          } else if (part.type === "tool-downloadCv") {
            tools.push({
              id: part.toolCallId,
              name: "downloadCv",
              state: toolStateOf(part.state),
              outcome: outcomes[part.toolCallId],
              error: part.state === "output-error" ? part.errorText : undefined,
            });
          } else if (part.type === "tool-sendEmail") {
            tools.push({
              id: part.toolCallId,
              name: "sendEmail",
              state: toolStateOf(part.state),
              outcome: outcomes[part.toolCallId],
              subject: part.input?.subject,
              body: part.input?.body,
              error: part.state === "output-error" ? part.errorText : undefined,
            });
          } else if (part.type === "tool-showProject") {
            const project = part.input?.slug ? getProject(part.input.slug) : undefined;

            tools.push({
              id: part.toolCallId,
              name: "showProject",
              state: toolStateOf(part.state),
              project: project
                ? {
                    name: project.name,
                    url: repoUrl(project.repo),
                    year: project.year,
                  }
                : undefined,
              error: part.state === "output-error" ? part.errorText : undefined,
            });
          } else if (part.type === "tool-showProjects") {
            const projects =
              part.state === "output-available"
                ? parseProjectList(part.output)
                : undefined;

            tools.push({
              id: part.toolCallId,
              name: "showProjects",
              state: toolStateOf(part.state),
              projects,
              error: part.state === "output-error" ? part.errorText : undefined,
            });
          } else if (part.type === "tool-showCertification") {
            const credential = part.input?.id ? getCredential(part.input.id) : undefined;

            tools.push({
              id: part.toolCallId,
              name: "showCertification",
              state: toolStateOf(part.state),
              credential: credential
                ? {
                    title: credential.title,
                    url: credential.url ?? "",
                    kind: credential.kind,
                    issuer: credential.issuer,
                    icon: credential.icon,
                  }
                : undefined,
              error: part.state === "output-error" ? part.errorText : undefined,
            });
          } else if (part.type === "tool-showCertifications") {
            const credentials =
              part.state === "output-available"
                ? parseCredentialList(part.output)
                : undefined;

            tools.push({
              id: part.toolCallId,
              name: "showCertifications",
              state: toolStateOf(part.state),
              credentials,
              error: part.state === "output-error" ? part.errorText : undefined,
            });
          }
        }

        return {
          id: message.id,
          from: message.role === "user" ? "user" : "assistant",
          text,
          tools,
        };
      }),
    [messages, outcomes],
  );

  const lastAnswer = React.useMemo(() => {
    for (let index = views.length - 1; index >= 0; index -= 1) {
      const view = views[index];
      if (view.from === "assistant" && view.text) return view.text;
    }
    return "";
  }, [views]);


  const awaiting = views.some((view) =>
    view.tools.some((tool) => tool.state === "asking"),
  );

  const ask = React.useCallback(
    (question: string) => {
      const value = question.trim();
      if (!value || busy || awaiting) return;

      void sendMessage({ text: value });
      setInput("");
    },
    [awaiting, busy, sendMessage],
  );

  const downloadCv = React.useCallback(
    (tool: ToolView) => {
      const link = document.createElement("a");
      link.href = cv.href;
      link.download = cv.filename;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (tool.state !== "asking") return;

      setOutcomes((previous) => ({ ...previous, [tool.id]: "downloaded" }));
      addToolOutput({
        output: `${cv.filename} a été téléchargé.`,
        tool: "downloadCv",
        toolCallId: tool.id,
      });
    },
    [addToolOutput],
  );

  const skipCv = React.useCallback(
    (tool: ToolView) => {
      if (tool.state !== "asking") return;

      setOutcomes((previous) => ({ ...previous, [tool.id]: "skipped" }));
      addToolOutput({
        output:
          "Le visiteur a choisi « plus tard » : le CV n'a pas été téléchargé. Continue la conversation sans le proposer de nouveau.",
        tool: "downloadCv",
        toolCallId: tool.id,
      });
    },
    [addToolOutput],
  );

  const editEmail = React.useCallback((tool: ToolView) => {
    if (!tool.subject || !tool.body) return;

    setDraft({ toolCallId: tool.id, subject: tool.subject, body: tool.body });
  }, []);

  const sendEmail = React.useCallback(
    (mail: { subject: string; body: string }) => {
      const toolCallId = draft?.toolCallId;
      setDraft(null);
      if (!toolCallId) return;

      const link = document.createElement("a");
      link.href = `mailto:${identity.email}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setOutcomes((previous) => ({ ...previous, [toolCallId]: "sent" }));
      addToolOutput({
        output: `« ${mail.subject} » est ouvert dans le logiciel de messagerie de la personne. Elle ne l'a pas encore envoyé.`,
        tool: "sendEmail",
        toolCallId,
      });
    },
    [addToolOutput, draft],
  );

  const closeEmail = React.useCallback(() => setDraft(null), []);

  const skipEmail = React.useCallback(
    (tool: ToolView) => {
      if (tool.state !== "asking") return;

      setDraft((current) => (current?.toolCallId === tool.id ? null : current));
      setOutcomes((previous) => ({ ...previous, [tool.id]: "cancelled" }));
      addToolOutput({
        output:
          "La personne ne veut pas envoyer ce message. N'insiste pas et ne le propose pas de nouveau.",
        tool: "sendEmail",
        toolCallId: tool.id,
      });
    },
    [addToolOutput],
  );

  const close = React.useCallback(() => {
    setDraft(null);
    onClose();
  }, [onClose]);

  const clear = React.useCallback(() => {
    stop();
    setMessages([]);
    setInput("");
    setDraft(null);
    setOutcomes({});
    setStoppedUserMessageIds([]);
  }, [setMessages, stop]);

  const stopResponse = React.useCallback(() => {
    if (!busy) return;
    const currentMessage = [...messages].reverse().find(
      (message) => message.role === "user",
    );
    stop();
    if (currentMessage) {
      setStoppedUserMessageIds((previous) =>
        previous.includes(currentMessage.id)
          ? previous
          : [...previous, currentMessage.id],
      );
    }
  }, [busy, messages, stop]);

  const retry = React.useCallback(() => {
    const currentMessage = [...messages].reverse().find(
      (message) => message.role === "user",
    );
    if (currentMessage) {
      setStoppedUserMessageIds((previous) =>
        previous.filter((id) => id !== currentMessage.id),
      );
    }
    void regenerate();
  }, [messages, regenerate]);

  const copy = React.useCallback(() => {
    if (!lastAnswer) return;

    void navigator.clipboard.writeText(lastAnswer);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }, [lastAnswer]);

  React.useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement as HTMLElement | null;

    const field = shellRef.current?.querySelector<HTMLTextAreaElement>(
      "[data-ask-ai-focus]",
    );

    field?.focus();

    if (field) {
      const end = field.value.length;
      field.setSelectionRange(end, end);
    }

    return () => {
      openerRef.current?.focus?.();
    };
  }, [open]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!open) return;

      if (event.key === "Escape") {
        event.preventDefault();

        if (draft) {
          closeEmail();
          return;
        }

        close();
        return;
      }

      if (event.key !== "Tab") return;

      const shell = shellRef.current;
      if (!shell) return;

      const stops = Array.from(
        shell.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null);

      if (!stops.length) return;

      const first = stops[0];
      const last = stops[stops.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, closeEmail, draft, open]);

  React.useEffect(() => {
    const shell = shellRef.current;
    if (!draft || !shell) return;

    shell.inert = true;
    return () => {
      shell.inert = false;
    };
  }, [draft]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (mode !== "panel" || !open || !root) return;

    const behind = Array.from(document.body.children).filter(
      (element) => element !== root,
    );

    for (const element of behind) {
      (element as HTMLElement).inert = true;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      for (const element of behind) {
        (element as HTMLElement).inert = false;
      }
      document.body.style.overflow = previous;
    };
  }, [mode, open]);

  const chat: Chat = {
    ask,
    busy,
    clear,
    close,
    copied,
    copy,
    errorMessage: error?.message ?? null,
    expand: expandBar,
    hasMessages: messages.length > 0,
    input,
    onInput: setInput,
    onRetry: retry,
    onStop: stopResponse,
    stoppedUserMessageIds,
    lastAnswer,
    onMode: toggleMode,
    mode,
    awaiting,
    onEmailEdit: editEmail,
    onEmailSkip: skipEmail,
    onCvDownload: downloadCv,
    onCvSkip: skipCv,
    open,
    views,
  };

  return (
    <div data-ask-ai-root="" ref={rootRef}>
      {mode === "panel" ? (
        open ? <Panel chat={chat} shellRef={shellRef} /> : null
      ) : (
        <Dock chat={chat} shellRef={shellRef} />
      )}

      {draft ? (
        <EmailDialog
          draft={draft}
          key={draft.toolCallId}
          onCancel={closeEmail}
          onSend={sendEmail}
        />
      ) : null}
    </div>
  );
}

function Panel({
  chat,
  shellRef,
}: {
  chat: Chat;
  shellRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Fermer le chat"
        className="absolute inset-0 bg-overlay"
        onClick={chat.close}
        tabIndex={-1}
        type="button"
      />

      <div
        aria-label="Ask AI"
        aria-modal="true"
        className="relative flex h-full w-[min(26rem,92vw)] flex-col border-l border-foreground/20 bg-background"
        ref={shellRef}
        role="dialog"
      >
        <Shell chat={chat} />
      </div>
    </div>
  );
}

function Dock({
  chat,
  shellRef,
}: {
  chat: Chat;
  shellRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { nodeRef, point, onPointerDown } = useDraggable<HTMLDivElement>(
    !chat.open,
  );
  const folded = !chat.open;

  return (
    <>
      {chat.open ? (
        <button
          aria-label="Replier le chat"
          className="fixed inset-0 z-40 bg-background/55 backdrop-blur-lg"
          onClick={chat.close}
          tabIndex={-1}
          type="button"
        />
      ) : null}

      <div
        className={cn(
          "z-50 flex flex-col border border-foreground/25 bg-background",
          folded
            ? cn(
                "fixed w-[calc(100vw-2rem)] sm:w-[min(32rem,calc(100vw-3rem))] lg:w-[min(38rem,calc(100vw-4rem))]",
                point ? undefined : "bottom-6 right-6",
              )
            : "fixed bottom-6 left-1/2 max-h-[min(34rem,72vh)] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2",
        )}
        ref={folded ? nodeRef : shellRef}
        style={folded && point ? { left: point.x, top: point.y } : undefined}
      >
        {folded ? (
          <div className="flex items-stretch">
            <Grip onPointerDown={onPointerDown} />
            <Composer chat={chat} folded />
          </div>
        ) : (
          <div
            aria-label="Ask AI"
            className="flex min-h-0 flex-1 flex-col"
            ref={shellRef}
            role="dialog"
          >
            <Shell chat={chat} />
          </div>
        )}
      </div>
    </>
  );
}

function Grip({ onPointerDown }: { onPointerDown: (event: React.PointerEvent) => void }) {
  return (
    <span
      aria-hidden="true"
      className="flex w-10 shrink-0 cursor-grab select-none items-center justify-center border-r border-border text-muted-foreground active:cursor-grabbing sm:w-12"
      onPointerDown={onPointerDown}
    >
      <GripVerticalIcon className="size-4" />
    </span>
  );
}

function Shell({ chat }: { chat: Chat }) {
  return (
    <>
      <header className="shrink-0 border-b border-border px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="size-2 shrink-0 bg-primary" />
            <h2 className="truncate text-base font-bold tracking-tight">
              Ask AI
            </h2>
          </div>

          <div className="flex shrink-0 items-center">
            <Action
              disabled={!chat.lastAnswer}
              label="Copier la réponse"
              onClick={chat.copy}
            >
              {chat.copied ? (
                <CheckIcon className="size-4 text-primary" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </Action>

            <Action
              label={
                chat.mode === "panel"
                  ? "Passer en barre flottante"
                  : "Passer en panneau latéral"
              }
              onClick={chat.onMode}
            >
              {chat.mode === "panel" ? (
                <PanelBottomIcon className="size-4" />
              ) : (
                <MessagesSquareIcon className="size-4" />
              )}
            </Action>

            <Action
              disabled={!chat.hasMessages}
              label="Effacer la conversation"
              onClick={chat.clear}
            >
              <Trash2Icon className="size-4" />
            </Action>

            <Action
              label={chat.mode === "panel" ? "Fermer le chat" : "Replier le chat"}
              onClick={chat.close}
            >
              {chat.mode === "panel" ? (
                <ChevronsRightIcon className="size-4" />
              ) : (
                <ChevronsDownIcon className="size-4" />
              )}
            </Action>
          </div>
        </div>
      </header>

      <Thread
        busy={chat.busy}
        stoppedUserMessageIds={chat.stoppedUserMessageIds}
        errorMessage={chat.errorMessage}
        messages={chat.views}
        onAsk={chat.ask}
        onCvDownload={chat.onCvDownload}
        onCvSkip={chat.onCvSkip}
        onEmailEdit={chat.onEmailEdit}
        onEmailSkip={chat.onEmailSkip}
        onRetry={chat.onRetry}
      />

      <Composer chat={chat} />
    </>
  );
}

function Action({
  children,
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="group relative flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}

      <span className="pointer-events-none absolute right-0 top-full z-10 mt-1 hidden w-max bg-foreground px-2 py-1 text-xs text-background group-hover:block group-focus-visible:block">
        {label}
      </span>
    </button>
  );
}
