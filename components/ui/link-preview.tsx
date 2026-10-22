"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const RENDER_WIDTH = 1440;
const RENDER_HEIGHT = 810;
const FRAME_ASPECT = RENDER_WIDTH / RENDER_HEIGHT;

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  title: string;
  className?: string;
  contentClassName?: string;
};

export const LinkPreview = ({
  children,
  url,
  title,
  className,
  contentClassName,
}: LinkPreviewProps) => {
  const reduce = useReducedMotion();
  const [isOpen, setOpen] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const [alignOffset, setAlignOffset] = React.useState(0);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLAnchorElement>(null);

  const recentre = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    setAlignOffset(window.innerWidth / 2 - (rect.left + rect.width / 2));
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    recentre();
    window.addEventListener("resize", recentre);
    return () => window.removeEventListener("resize", recentre);
  }, [isOpen, recentre]);

  React.useEffect(() => {
    if (!isOpen) return;
    const element = frameRef.current;
    if (!element) return;

    const measure = () => setWidth(element.getBoundingClientRect().width);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [isOpen]);

  const enter = reduce
    ? { opacity: 0 }
    : { opacity: 0, y: 12, scale: 0.96 };
  const appear = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 30 };

  return (
    <HoverCardPrimitive.Root
      openDelay={80}
      closeDelay={120}
      onOpenChange={setOpen}
    >
      <HoverCardPrimitive.Trigger asChild className={className} ref={triggerRef}>
        {children}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        alignOffset={alignOffset}
        side="bottom"
        align="center"
        sideOffset={10}
        collisionPadding={20}
        className={cn(
          "z-50 w-80 sm:w-[26rem] lg:w-[30rem] xl:w-[34rem] max-w-[calc(100vw-2.5rem)]",
          contentClassName,
        )}
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={enter}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={enter}
              transition={appear}
            >
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="block border border-foreground/20 bg-card shadow-[0_18px_44px_-18px_rgb(0_0_0/0.4)]"
              >
                <div
                  ref={frameRef}
                  className="relative overflow-hidden bg-surface-sunken"
                  style={{ height: width ? width / FRAME_ASPECT : 0 }}
                >
                  {width ? (
                    <iframe
                      src={url}
                      title={`Aperçu de ${title}`}
                      loading="lazy"
                      tabIndex={-1}
                      scrolling="no"
                      className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
                      style={{
                        width: RENDER_WIDTH,
                        height: RENDER_HEIGHT,
                        transform: `scale(${width / RENDER_WIDTH})`,
                      }}
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  ) : null}
                </div>

                <div className="flex h-9 items-center justify-between gap-3 border-t border-border px-3">
                  <span className="truncate font-display text-sm font-semibold tracking-tight">
                    {title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    Ouvrir la démo ↗
                  </span>
                </div>
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};