"use client";

import * as React from "react";
import { ArrowDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";


const BOTTOM = 24;

type ScrollerValue = {
  isAtBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  measure: () => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  setContent: (node: HTMLDivElement | null) => void;
};

const ScrollerContext = React.createContext<ScrollerValue | null>(null);

export function useMessageScroller() {
  const value = React.useContext(ScrollerContext);

  if (!value) {
    throw new Error("useMessageScroller exige un <MessageScroller> plus haut.");
  }

  return value;
}

function MessageScroller({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const pinned = React.useRef(true);

  const measure = React.useCallback(() => {
    const node = viewportRef.current;
    if (!node) return;

    const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
    const atBottom = distance <= BOTTOM;

    pinned.current = atBottom;
    setIsAtBottom(atBottom);
  }, []);

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const node = viewportRef.current;
      if (!node) return;

      pinned.current = true;
      node.scrollTo({ top: node.scrollHeight, behavior });
      setIsAtBottom(true);
    },
    [],
  );

  React.useEffect(() => {
    if (!content || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      const node = viewportRef.current;
      if (node && pinned.current) node.scrollTop = node.scrollHeight;
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [content]);

  const value = React.useMemo<ScrollerValue>(
    () => ({ isAtBottom, measure, scrollToBottom, viewportRef, setContent }),
    [isAtBottom, measure, scrollToBottom],
  );

  return (
    <div
      className={cn("relative flex min-h-0 flex-1 flex-col", className)}
      data-slot="message-scroller"
      {...props}
    >
      <ScrollerContext.Provider value={value}>
        {children}
      </ScrollerContext.Provider>
    </div>
  );
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { measure, scrollToBottom, viewportRef } = useMessageScroller();

  React.useEffect(() => {
    scrollToBottom("instant");
  }, [scrollToBottom]);

  return (
    <div
      aria-live="polite"
      className={cn(
        "min-h-0 flex-1 overflow-x-clip overflow-y-auto overscroll-contain",
        className,
      )}
      data-slot="message-scroller-viewport"
      ref={viewportRef}
      role="log"
      onScroll={measure}
      {...props}
    />
  );
}

function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { setContent } = useMessageScroller();

  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)] gap-7 px-6 py-6",
        className,
      )}
      data-slot="message-scroller-content"
      ref={setContent}
      {...props}
    />
  );
}

function MessageScrollerItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "grid min-w-0 grid-cols-[minmax(0,1fr)]",
        className,
      )}
      data-slot="message-scroller-item"
      {...props}
    />
  );
}

function MessageScrollerButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { isAtBottom, scrollToBottom } = useMessageScroller();

  if (isAtBottom) return null;

  return (
    <button
      aria-label="Aller au dernier message"
      className={cn(
        "absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 border border-foreground/25 bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-foreground hover:text-background",
        className,
      )}
      data-slot="message-scroller-button"
      onClick={() => scrollToBottom()}
      type="button"
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon className="size-3.5" />
          Dernier message
        </>
      )}
    </button>
  );
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
};