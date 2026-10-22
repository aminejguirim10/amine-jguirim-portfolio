"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { identity } from "@/lib/site";
import { cn } from "@/lib/utils";


export type EmailDraft = {
  toolCallId: string;
  subject: string;
  body: string;
};

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function EmailDialog({
  draft,
  onCancel,
  onSend,
}: {
  draft: EmailDraft;
  onCancel: () => void;
  onSend: (mail: { subject: string; body: string }) => void;
}) {
  const [subject, setSubject] = React.useState(draft.subject);
  const [body, setBody] = React.useState(draft.body);
  const [copied, setCopied] = React.useState(false);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const subjectRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    subjectRef.current?.focus();
    subjectRef.current?.select();
  }, []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const stops = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
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
  }, []);

  const ready = subject.trim().length > 0 && body.trim().length > 0;

  const copy = () => {
    void navigator.clipboard.writeText(
      `À : ${identity.email}\nObjet : ${subject.trim()}\n\n${body.trim()}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        aria-label="Fermer sans envoyer"
        className="absolute inset-0 bg-overlay"
        onClick={onCancel}
        tabIndex={-1}
        type="button"
      />

      <div
        aria-describedby="email-dialog-note"
        aria-labelledby="email-dialog-title"
        aria-modal="true"
        className="relative grid w-full max-w-[34rem] gap-5 border border-foreground/25 bg-background p-5 sm:p-6"
        ref={panelRef}
        role="dialog"
      >
        <header className="grid gap-1.5">
          <span className="flex items-center gap-2">
            <MailIcon className="size-4 shrink-0 text-primary" />
            <h2
              className="text-base font-bold tracking-tight"
              id="email-dialog-title"
            >
              Message à {identity.firstName}
            </h2>
          </span>

          <p
            className="text-[0.8125rem] leading-relaxed text-muted-foreground"
            id="email-dialog-note"
          >
            Relis et ajuste avant d&apos;ouvrir ta messagerie : rien n&apos;est
            envoyé depuis cette page.
          </p>
        </header>

        <div className="grid gap-3">
          <Field label="À">
            <input
              className="min-h-11 w-full border border-foreground/25 bg-muted/40 px-3 py-2.5 text-[0.9375rem] text-muted-foreground outline-none"
              readOnly
              tabIndex={-1}
              type="email"
              value={identity.email}
            />
          </Field>

          <Field label="Objet">
            <input
              className="min-h-11 w-full border border-foreground/25 bg-transparent px-3 py-2.5 text-[0.9375rem] outline-none focus:border-primary"
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Objet du message"
              ref={subjectRef}
              type="text"
              value={subject}
            />
          </Field>

          <Field label="Message">
            <textarea
              className="min-h-36 w-full resize-y border border-foreground/25 bg-transparent px-3 py-2.5 text-[0.9375rem] leading-relaxed outline-none focus:border-primary"
              onChange={(event) => setBody(event.target.value)}
              placeholder="Ce que tu veux écrire"
              rows={6}
              value={body}
            />
          </Field>
        </div>

        {!ready ? (
          <p className="-mt-1 text-xs text-muted-foreground">
            Un objet et un message sont nécessaires pour l&apos;ouvrir.
          </p>
        ) : null}

        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
          <Button onClick={onCancel} size="sm" type="button" variant="ghost">
            Annuler
          </Button>

          <Button onClick={copy} size="sm" type="button" variant="outline">
            {copied ? (
              <CheckIcon className="size-3.5 text-primary" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
            {copied ? "Copié" : "Copier"}
          </Button>

          <Button
            disabled={!ready}
            onClick={() => onSend({ subject: subject.trim(), body: body.trim() })}
            size="sm"
            type="button"
            variant="cobalt"
          >
            <MailIcon className="size-3.5" />
            Ouvrir ma messagerie
          </Button>
        </footer>
      </div>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
        )}
      >
        {label}
      </span>
      {children}
    </label>
  );
}