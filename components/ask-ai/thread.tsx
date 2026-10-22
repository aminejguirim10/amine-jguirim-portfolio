"use client";

import * as React from "react";
import {
  AwardIcon,
  CheckIcon,
  CircleStopIcon,
  DownloadIcon,
  FileTextIcon,
  MailIcon,
  MedalIcon,
  PencilIcon,
  RotateCcwIcon,
  UserIcon,
} from "lucide-react";

import type { ProjectSummary } from "@/lib/types";

import { Inline } from "@/components/ask-ai/inline";
import { GithubMark } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { cv, identity } from "@/lib/site";
import { cn } from "@/lib/utils";


export type ToolState = "running" | "asking" | "done" | "failed";

export type ToolOutcome = "downloaded" | "skipped" | "sent" | "cancelled";

export type ToolView = {
  id: string;
  name:
    | "downloadCv"
    | "sendEmail"
    | "showProject"
    | "showProjects"
    | "showCertification"
    | "showCertifications";
  state: ToolState;
  subject?: string;
  body?: string;
  error?: string;
  outcome?: ToolOutcome;
  project?: {
    name: string;
    url: string;
    year: string;
  };
  credential?: {
    title: string;
    url: string;
    kind: string;
    issuer: string;
    icon: "award" | "medal";
  };
  projects?: ProjectSummary[];
  credentials?: Array<{
    title: string;
    summary: string;
    url: string;
    kind: string;
    issuer: string;
    icon: "award" | "medal";
  }>;
};

export type MessageView = {
  id: string;
  from: "user" | "assistant";
  text: string;
  tools: ToolView[];
};

export function toolStateOf(state: string | undefined): ToolState {
  if (state === "output-available") return "done";
  if (state === "output-error" || state === "output-denied") return "failed";
  if (state === "input-available" || state === "approval-requested") return "asking";
  return "running";
}

const TOOL_COPY = {
  downloadCv: {
    icon: DownloadIcon,
    running: "Préparation du CV",
    asking: "CV prêt",
    done: "CV téléchargé",
    skipped: "Téléchargement ignoré",
  },
  sendEmail: {
    icon: MailIcon,
    running: "Rédaction du message",
    asking: "Message à vérifier",
    done: "Ouvert dans ta messagerie",
    cancelled: "Message fermé sans envoi",
  },
  showProject: {
    running: "Ouverture du projet",
    done: "Projet ouvert",
  },
  showCertification: {
    running: "Ouverture de la certification",
    done: "Certification ouverte",
  },
} as const;

export function Thread({
  busy,
  messages,
  stoppedUserMessageIds,
  errorMessage,
  onAsk,
  onRetry,
  onCvDownload,
  onCvSkip,
  onEmailEdit,
  onEmailSkip,
}: {
  busy: boolean;
  messages: MessageView[];
  stoppedUserMessageIds: string[];
  errorMessage: string | null;
  onAsk: (question: string) => void;
  onRetry: () => void;
  onCvDownload: (tool: ToolView) => void;
  onCvSkip: (tool: ToolView) => void;
  onEmailEdit: (tool: ToolView) => void;
  onEmailSkip: (tool: ToolView) => void;
}) {
  return (
    <MessageScroller>
      <MessageScrollerViewport>
        <MessageScrollerContent>
          {!messages.length ? (
            <Empty onAsk={onAsk} />
          ) : (
            <ol
              className="grid grid-cols-[minmax(0,1fr)] gap-8"
            >
              {messages.map((message, index) => {
                const stoppedUser = stoppedUserMessageIds.includes(message.id);
                const previousMessage = messages[index - 1];
                const stoppedAssistant =
                  message.from === "assistant" &&
                  previousMessage?.from === "user" &&
                  stoppedUserMessageIds.includes(previousMessage.id);
                const hasAssistantResponse = messages[index + 1]?.from === "assistant";

                return (
                  <MessageScrollerItem key={message.id}>
                    {message.from === "user" ? (
                      <>
                        <UserMessage message={message} />
                        {stoppedUser && !hasAssistantResponse ? <StoppedMessage /> : null}
                      </>
                    ) : stoppedAssistant && !message.text && !message.tools.length ? (
                      <StoppedMessage />
                    ) : (
                      <>
                        <AssistantMessage
                          message={message}
                          onCvDownload={onCvDownload}
                          onCvSkip={onCvSkip}
                          onEmailEdit={onEmailEdit}
                          onEmailSkip={onEmailSkip}
                        />
                        {stoppedAssistant ? <StoppedMessage /> : null}
                      </>
                    )}
                  </MessageScrollerItem>
                );
              })}
              {busy && messages[messages.length - 1]?.from === "user" ? (
                <MessageScrollerItem>
                  <PendingMessage />
                </MessageScrollerItem>
              ) : null}
            </ol>
          )}

          {errorMessage ? (
            <div className="grid gap-3 border-t border-border pt-4">
              <p className="text-[0.9375rem] leading-relaxed">{errorMessage}</p>
              <Button
                className="justify-self-start"
                onClick={onRetry}
                size="sm"
                type="button"
                variant="outline"
              >
                <RotateCcwIcon className="size-3.5" />
                Réessayer
              </Button>
            </div>
          ) : null}
        </MessageScrollerContent>
      </MessageScrollerViewport>

      <MessageScrollerButton />
    </MessageScroller>
  );
}

function PendingMessage() {
  return (
    <Message from="assistant">
      <MessageAvatar aria-hidden="true">
        {`${identity.firstName[0]}${identity.lastName[0]}`.toUpperCase()}
      </MessageAvatar>
      <div className="grid min-w-0 flex-1 gap-2">
        <MessageHeader>{identity.firstName}</MessageHeader>
        <Pending />
      </div>
    </Message>
  );
}

function StoppedMessage() {
  return (
    <Message from="assistant">
      <MessageAvatar aria-hidden="true">
        {`${identity.firstName[0]}${identity.lastName[0]}`.toUpperCase()}
      </MessageAvatar>
      <div className="grid min-w-0 flex-1 gap-2">
        <MessageHeader>{identity.firstName}</MessageHeader>
        <MessageContent className="flex items-start gap-3 border-primary/40 bg-muted/40">
          <span className="flex size-7 shrink-0 items-center justify-center border border-primary/30 text-primary">
            <CircleStopIcon aria-hidden="true" className="size-4" />
          </span>
          <div className="grid gap-1">
            <p className="font-medium">Réponse interrompue</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              La génération a été arrêtée. Tu peux relancer la demande quand tu veux.
            </p>
          </div>
        </MessageContent>
      </div>
    </Message>
  );
}

function UserMessage({ message }: { message: MessageView }) {
  return (
    <Message from="user" variant="contained">
      <MessageAvatar aria-hidden="true">
        <UserIcon className="size-4" />
      </MessageAvatar>

      <div className="flex min-w-0 flex-1 flex-col items-end gap-1">
        <MessageHeader>Vous</MessageHeader>
        <MessageContent className="w-fit max-w-[85%]">{message.text}</MessageContent>
      </div>
    </Message>
  );
}

function AssistantMessage({
  message,
  onCvDownload,
  onCvSkip,
  onEmailEdit,
  onEmailSkip,
}: {
  message: MessageView;
  onCvDownload: (tool: ToolView) => void;
  onCvSkip: (tool: ToolView) => void;
  onEmailEdit: (tool: ToolView) => void;
  onEmailSkip: (tool: ToolView) => void;
}) {
  const pending = !message.text && !message.tools.length;

  return (
    <Message from="assistant">
      <MessageAvatar aria-hidden="true">
        {`${identity.firstName[0]}${identity.lastName[0]}`.toUpperCase()}
      </MessageAvatar>

      <div className="grid min-w-0 flex-1 gap-2">
        <MessageHeader>{identity.firstName}</MessageHeader>

        {pending ? (
          <Pending />
        ) : (
          <MessageContent
            className="grid gap-3"
            data-ask-ai-cursor=""
            data-ask-ai-response=""
          >
            {message.text ? (
              <p className="whitespace-pre-wrap">
                <Inline text={message.text} />
              </p>
            ) : null}

            {message.tools.map((tool) =>
              tool.name === "showProject" ? (
                <ProjectCard key={tool.id} tool={tool} />
              ) : tool.name === "showProjects" ? (
                <ProjectsCard key={tool.id} tool={tool} />
              ) : tool.name === "showCertification" ? (
                <CertificationCard key={tool.id} tool={tool} />
              ) : tool.name === "showCertifications" ? (
                <CertificationsCard key={tool.id} tool={tool} />
              ) : tool.name === "downloadCv" ? (
                <CvCard key={tool.id} onDownload={onCvDownload} onSkip={onCvSkip} tool={tool} />
              ) : (
                <EmailCard
                  key={tool.id}
                  onEdit={onEmailEdit}
                  onSkip={onEmailSkip}
                  tool={tool}
                />
              ),
            )}
          </MessageContent>
        )}
      </div>
    </Message>
  );
}

function Pending() {
  return (
    <MessageContent className="grid gap-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        <span
          aria-hidden="true"
          className="ongoing-mark inline-block h-3.5 w-1.5 shrink-0 bg-primary"
        />
        Réponse en cours
      </span>

      <span aria-hidden="true" className="grid gap-2">
        <span className="pending-line w-full" />
        <span className="pending-line w-[86%]" />
        <span className="pending-line w-[58%]" />
      </span>
    </MessageContent>
  );
}

function Empty({ onAsk }: { onAsk: (question: string) => void }) {
  return (
    <div className="flex flex-col justify-between gap-8">
      <div>
        <p className="max-w-[34ch] font-display text-xl font-bold leading-[1.2] tracking-tight wdth-88">
          Une question sur le parcours, les projets ou la stack.
        </p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Le modèle ne répond qu&apos;à partir de ce que le site contient.
          S&apos;il ne sait pas, il le dit.
        </p>
      </div>

      <div className="grid gap-px border-t border-l border-border">
        <Suggestion onAsk={onAsk} question="Quels projets as-tu livrés, et avec quoi ?" />
        <Suggestion onAsk={onAsk} question="C'est quoi ton parcours depuis 2021 ?" />
        <Suggestion onAsk={onAsk} question="Tu utilises quoi au quotidien ?" />
        <Suggestion onAsk={onAsk} question="Je peux avoir ton CV ?" />
      </div>
    </div>
  );
}

function Suggestion({
  question,
  onAsk,
}: {
  question: string;
  onAsk: (question: string) => void;
}) {
  return (
    <button
      className="w-full border-b border-r border-border px-4 py-3 text-left text-[0.9375rem] transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={() => onAsk(question)}
      type="button"
    >
      {question}
    </button>
  );
}

function ToolFrame({
  children,
  hint,
  state,
  tone,
}: {
  children: React.ReactNode;
  hint?: React.ReactNode;
  state: ToolState;
  tone: "default" | "muted" | "signal";
}) {
  return (
    <div
      className={cn(
        "grid gap-3 border px-3 py-2.5 text-[0.8125rem]",
        tone === "default"
          ? "border-border bg-background"
          : tone === "muted"
            ? "border-border bg-transparent"
            : "border-foreground/40 bg-transparent",
      )}
      data-state={state}
    >
      {children}

      {hint ? (
        <p className="border-t border-border pt-2.5 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Pulse() {
  return (
    <span
      aria-label="en cours"
      className="ongoing-mark inline-block h-3 w-1.5 shrink-0 bg-primary"
    />
  );
}

function ProjectCard({ tool }: { tool: ToolView }) {
  const project = tool.project;
  const failed = tool.state === "failed";

  if (!project) {
    return (
      <ToolFrame state={tool.state} tone={failed ? "signal" : "default"}>
        <p className="text-muted-foreground">
          {failed
            ? (tool.error ?? "Le projet n'a pas pu être ouvert.")
            : "Projet introuvable."}
        </p>
      </ToolFrame>
    );
  }

  return (
    <ToolFrame
      hint="Le dépôt s'ouvre dans un nouvel onglet."
      state={tool.state}
      tone={failed ? "signal" : "default"}
    >
      <div className="flex items-start gap-2.5">
        <GithubMark className="mt-[0.1875rem] size-3.5 shrink-0 text-primary" />

        <div className="min-w-0 flex-1">
          <a
            className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            href={project.url}
            rel="noreferrer noopener"
            target="_blank"
          >
            {project.name}
          </a>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {project.url.replace("https://", "")}
          </p>

          <p className="nums mt-0.5 text-xs text-muted-foreground">
            {project.year}
          </p>
        </div>

        {tool.state === "running" ? <Pulse /> : null}
      </div>
    </ToolFrame>
  );
}

function ProjectsCard({ tool }: { tool: ToolView }) {
  const projects = tool.projects ?? [];

  return (
    <ToolFrame
      hint="Les dépôts s'ouvrent dans un nouvel onglet."
      state={tool.state}
      tone={tool.state === "failed" ? "signal" : "default"}
    >
      <div className="grid gap-3">
        {projects.map((project) => (
          <article
            key={project.url}
            className="border border-border bg-card p-4 transition-colors hover:border-primary/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <a
                  className="font-display font-semibold tracking-tight underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                  href={project.url}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {project.name}
                </a>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.year}
                </p>
              </div>
              <GithubMark className="size-3.5 shrink-0 text-primary" />
            </div>
            <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
              {project.kicker}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="border border-border px-2 py-1 text-[0.6875rem] text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
            {project.live ? (
              <a
                className="mt-4 inline-block text-xs font-medium text-primary underline underline-offset-4"
                href={project.live}
                rel="noreferrer noopener"
                target="_blank"
              >
                Démo en ligne
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </ToolFrame>
  );
}

function CertificationCard({ tool }: { tool: ToolView }) {
  const credential = tool.credential;
  const failed = tool.state === "failed";
  const Icon = credential?.icon === "medal" ? MedalIcon : AwardIcon;

  if (!credential) {
    return (
      <ToolFrame state={tool.state} tone={failed ? "signal" : "default"}>
        <p className="text-muted-foreground">
          {failed
            ? (tool.error ?? "La certification n'a pas pu être ouverte.")
            : "Certification introuvable."}
        </p>
      </ToolFrame>
    );
  }

  let host = credential.url;
  try {
    host = new URL(credential.url).hostname.replace(/^www\./, "");
  } catch {
  }

  return (
    <ToolFrame
      hint="La page de vérification s'ouvre dans un nouvel onglet."
      state={tool.state}
      tone={failed ? "signal" : "default"}
    >
      <div className="flex items-start gap-2.5">
        <Icon className="mt-[0.1875rem] size-3.5 shrink-0 text-primary" />

        <div className="min-w-0 flex-1">
          <a
            className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            href={credential.url}
            rel="noreferrer noopener"
            target="_blank"
          >
            {credential.title}
          </a>

          <p className="mt-1 truncate text-xs text-muted-foreground">{host}</p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {credential.kind} · {credential.issuer}
          </p>
        </div>

        {tool.state === "running" ? <Pulse /> : null}
      </div>
    </ToolFrame>
  );
}

function CertificationsCard({ tool }: { tool: ToolView }) {
  const credentials = tool.credentials ?? [];

  return (
    <ToolFrame
      hint="Les pages de vérification s'ouvrent dans un nouvel onglet."
      state={tool.state}
      tone={tool.state === "failed" ? "signal" : "default"}
    >
      <div className="grid gap-3">
        {credentials.map((credential) => {
          const Icon = credential.icon === "medal" ? MedalIcon : AwardIcon;

          return (
            <article
              key={credential.url || credential.title}
              className="border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex items-start gap-2.5">
                <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <a
                    className="font-display font-semibold tracking-tight underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                    href={credential.url}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {credential.title}
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {credential.kind} · {credential.issuer}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                {credential.summary}
              </p>
            </article>
          );
        })}
      </div>
    </ToolFrame>
  );
}

function CvCard({
  onDownload,
  onSkip,
  tool,
}: {
  onDownload: (tool: ToolView) => void;
  onSkip: (tool: ToolView) => void;
  tool: ToolView;
}) {
  const copy = TOOL_COPY.downloadCv;
  const Icon = copy.icon;
  const skipped = tool.outcome === "skipped";
  const done = tool.state === "done" && !skipped;
  const failed = tool.state === "failed";

  const label = failed
    ? (tool.error ?? "Le téléchargement a échoué")
    : tool.state === "asking"
      ? copy.asking
      : tool.state === "done"
        ? skipped
          ? copy.skipped
          : copy.done
        : copy.running;

  return (
    <ToolFrame
      hint={
        tool.state === "asking"
          ? "Le fichier ne part qu'après ton choix."
          : failed
            ? null
            : "Cliquer sur le nom du fichier pour le récupérer."
      }
      state={tool.state}
      tone={failed ? "signal" : skipped || done ? "muted" : "default"}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="size-3.5 shrink-0 text-primary" />
        <span className="flex-1">{label}</span>
        {tool.state === "running" ? <Pulse /> : null}
        {done ? <CheckIcon className="size-3.5 shrink-0 text-primary" /> : null}
      </div>

      <button
        className="flex w-full items-center gap-2 text-left transition-colors hover:text-primary disabled:opacity-60"
        disabled={tool.state === "running"}
        onClick={() => onDownload(tool)}
        type="button"
      >
        <FileTextIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate">{cv.filename}</span>
        <span className="shrink-0 border border-border px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground">
          PDF
        </span>
      </button>

      {tool.state === "asking" ? (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onDownload(tool)}
            size="sm"
            type="button"
            variant="cobalt"
          >
            <DownloadIcon className="size-3.5" />
            Télécharger
          </Button>
          <Button onClick={() => onSkip(tool)} size="sm" type="button" variant="outline">
            Plus tard
          </Button>
        </div>
      ) : null}
    </ToolFrame>
  );
}

function EmailCard({
  onEdit,
  onSkip,
  tool,
}: {
  onEdit: (tool: ToolView) => void;
  onSkip: (tool: ToolView) => void;
  tool: ToolView;
}) {
  const copy = TOOL_COPY.sendEmail;
  const Icon = copy.icon;
  const cancelled = tool.outcome === "cancelled";
  const done = tool.state === "done" && !cancelled;
  const failed = tool.state === "failed";

  const label = failed
    ? (tool.error ?? "Le message n'a pas pu être préparé")
    : tool.state === "asking"
      ? copy.asking
      : tool.state === "done"
        ? cancelled
          ? copy.cancelled
          : copy.done
        : copy.running;

  return (
    <ToolFrame
      hint={
        tool.state === "asking"
          ? "Rien n'est envoyé : tu relis, tu ajustes, tu ouvres."
          : failed
            ? null
            : "Rouvrir le dialogue pour le corriger avant de l'envoyer."
      }
      state={tool.state}
      tone={failed ? "signal" : tool.state === "done" ? "muted" : "default"}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="size-3.5 shrink-0 text-primary" />
        <span className="flex-1">{label}</span>
        {tool.state === "running" ? <Pulse /> : null}
        {done ? <CheckIcon className="size-3.5 shrink-0 text-primary" /> : null}
      </div>

      {tool.subject ? (
        <div className="grid gap-1 border-t border-border pt-2.5 text-muted-foreground">
          <span className="text-xs">
            Objet : <span className="text-foreground">{tool.subject}</span>
          </span>
          {tool.body ? (
            <span className="line-clamp-3 text-xs leading-relaxed">{tool.body}</span>
          ) : null}
        </div>
      ) : null}

      {tool.state === "asking" || done ? (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onEdit(tool)}
            size="sm"
            type="button"
            variant={tool.state === "asking" ? "cobalt" : "outline"}
          >
            <PencilIcon className="size-3.5" />
            {tool.state === "asking" ? "Relire et envoyer" : "Rouvrir"}
          </Button>

          {tool.state === "asking" ? (
            <Button onClick={() => onSkip(tool)} size="sm" type="button" variant="outline">
              Ne pas envoyer
            </Button>
          ) : null}
        </div>
      ) : null}
    </ToolFrame>
  );
}