"use client";

import {
  ArrowUpIcon,
  MessagesSquareIcon,
  SquareIcon,
} from "lucide-react";

import type { Chat } from "@/components/ask-ai/types";
import { cn } from "@/lib/utils";


export function Composer({
  chat,
  folded = false,
}: {
  chat: Chat;
  folded?: boolean;
}) {
  const { awaiting, busy, input, onInput } = chat;

  const locked = busy || awaiting;

  const send = () => {
    if (folded) chat.expand();
    chat.ask(input);
  };

  const openBar = () => chat.expand();

  return (
    <form
      className={folded ? "flex-1" : "shrink-0 border-t border-border p-4"}
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
    >
      <div
        className={cn(
          "flex items-end gap-2 border border-foreground/25 transition-colors focus-within:border-primary",
          folded ? "p-2" : "p-2.5",
        )}
      >
        <label className="sr-only" htmlFor="ask-ai-input">
          Poser une question
        </label>

        <div className="min-w-0 flex-1">
          <textarea
            className={cn(
              "field-sizing-content w-full min-w-0 max-w-full wrap-anywhere resize-none bg-transparent px-2 text-[0.9375rem] leading-relaxed outline-none placeholder:text-muted-foreground/60 disabled:opacity-50",
              folded
                ? "max-h-32 min-h-11 py-2 sm:min-h-12"
                : "max-h-40 min-h-20 py-2.5",
            )}
            data-ask-ai-focus=""
            disabled={locked}
            id="ask-ai-input"
            onChange={(event) => onInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder={
              awaiting ? "Tranche d’abord l’action ci-dessus." : "Pose ta question…"
            }
            rows={1}
            value={input}
          />
        </div>

        {busy ? (
          <button
            aria-label="Arrêter la réponse"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center bg-muted transition-colors hover:bg-foreground hover:text-background sm:size-10"
            onClick={chat.onStop}
            type="button"
          >
            <SquareIcon className="size-3.5" />
          </button>
        ) : (
          <>
            {folded ? (
              <button
                aria-label="Ouvrir la barre de conversation"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center border border-foreground/25 transition-colors hover:bg-foreground hover:text-background sm:size-10"
                onClick={openBar}
                type="button"
              >
                <MessagesSquareIcon className="size-4" />
              </button>
            ) : null}

            <button
              aria-label={folded ? "Envoyer et lire la réponse" : "Envoyer"}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center bg-primary text-primary-foreground transition-opacity disabled:opacity-30 sm:size-10"
              disabled={!input.trim()}
              type="submit"
            >
              <ArrowUpIcon className="size-4" />
            </button>
          </>
        )}
      </div>
    </form>
  );
}