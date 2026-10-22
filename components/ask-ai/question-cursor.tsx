"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircleQuestionMarkIcon, SparklesIcon } from "lucide-react";

import { askAiAbout } from "@/components/ask-ai/store";
import { useReducedMotion } from "@/lib/use-reduced-motion";


const MARK = "data-ask-ai-cursor";

const RESPONSE_MARK = "data-ask-ai-response";

const LINK_MARK = "data-ask-ai-link";

const MAX = 180;

const HINT_DELAY = 260;

type Hit = { left: number; question: string; top: number };

export function QuestionCursor() {
  const [hit, setHit] = React.useState<Hit | null>(null);
  const [hint, setHint] = React.useState(false);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    let frame = 0;
    let hintTimer = 0;
    let hoverOff: (() => void) | null = null;
    let hoverLeave: (() => void) | null = null;

    function dismiss() {
      setHit(null);
    }

    if (window.matchMedia("(hover: hover)").matches) {
      function showHint() {
        if (hintTimer) {
          window.clearTimeout(hintTimer);
          hintTimer = 0;
        }
        setHint(true);
      }

      function hideHintLater() {
        if (hintTimer) return;
        hintTimer = window.setTimeout(() => {
          hintTimer = 0;
          setHint(false);
        }, HINT_DELAY);
      }

      function onOver(event: PointerEvent) {
        const target = event.target as Element | null;
        if (target?.closest?.(`[${MARK}]`)) showHint();
        else hideHintLater();
      }

      function onOut(event: PointerEvent) {
        if (!event.relatedTarget) hideHintLater();
      }

      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);

      hoverOff = () => document.removeEventListener("pointerover", onOver);
      hoverLeave = () => document.removeEventListener("pointerout", onOut);
    }

    function read() {
      frame = 0;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        dismiss();
        return;
      }

      const range = selection.getRangeAt(0);
      if (!closest(range.startContainer)?.closest(`[${MARK}]`)) {
        dismiss();
        return;
      }

      const startsInResponse = Boolean(
        closest(range.startContainer)?.closest(`[${RESPONSE_MARK}]`),
      );

      if (!startsInResponse && touchesLink(range) && !insideAskableLink(range)) {
        dismiss();
        return;
      }

      const text = selection.toString().replace(/\s+/g, " ").trim();
      if (text.length < 2) {
        dismiss();
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        dismiss();
        return;
      }

      const half = 96;
      const middle = rect.left + rect.width / 2;

      setHit({
        left: Math.min(Math.max(half, middle), window.innerWidth - half),
        question: quote(text),
        top: rect.top,
      });

      setHint(false);
    }

    function schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    document.addEventListener("selectionchange", schedule);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", dismiss, { capture: true, passive: true });
    window.addEventListener("resize", dismiss);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (hintTimer) window.clearTimeout(hintTimer);
      hoverOff?.();
      hoverLeave?.();
      document.removeEventListener("selectionchange", schedule);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", dismiss, { capture: true });
      window.removeEventListener("resize", dismiss);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {hint && !hit ? (
          <motion.p
            aria-hidden="true"
            className="pointer-events-none fixed bottom-5 left-5 z-[65] hidden cursor-pointer items-center gap-2 border border-foreground/25 bg-background/95 px-3 py-2 text-[0.8125rem] text-foreground shadow-none backdrop-blur-sm md:flex"
            exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <SparklesIcon className="size-3.5 shrink-0 text-primary" />
            Sélectionne un passage pour demander à l&apos;IA
          </motion.p>
        ) : null}
      </AnimatePresence>

      {hit ? (
        <button
          aria-label="Demander à l’IA à propos de la sélection"
          className="fixed z-[70] flex cursor-pointer -translate-x-1/2 -translate-y-full items-center gap-2 border border-foreground bg-foreground px-3 py-2 text-[0.8125rem] font-medium text-background transition-colors hover:border-primary hover:bg-primary"
          onClick={() => {
            askAiAbout(hit.question);
            setHit(null);
            window.getSelection()?.removeAllRanges();
          }}
          onMouseDown={(event) => event.preventDefault()}
          style={{ left: hit.left, top: hit.top - 10 }}
          type="button"
        >
          <MessageCircleQuestionMarkIcon className="size-3.5 shrink-0" />
          Demander à l&apos;IA
        </button>
      ) : null}
    </>
  );
}

function closest(node: Node): Element | null {
  return node.nodeType === Node.ELEMENT_NODE
    ? (node as Element)
    : node.parentElement;
}

function touchesLink(range: Range): boolean {
  if (closest(range.startContainer)?.closest("a[href]")) return true;
  if (closest(range.endContainer)?.closest("a[href]")) return true;

  const root = range.commonAncestorContainer;
  const scope = root.nodeType === Node.ELEMENT_NODE ? (root as Element) : root.parentElement;
  if (!scope) return false;

  for (const anchor of scope.querySelectorAll("a[href]")) {
    if (range.intersectsNode(anchor)) return true;
  }

  return false;
}

function insideAskableLink(range: Range): boolean {
  const start = closest(range.startContainer)?.closest(`[${LINK_MARK}]`);
  const end = closest(range.endContainer)?.closest(`[${LINK_MARK}]`);

  return Boolean(start && start === end);
}

function quote(text: string): string {
  const clipped =
    text.length > MAX ? `${text.slice(0, MAX - 1).trimEnd()}…` : text;

  return `« ${clipped} » — peux-tu m'en dire plus ?`;
}