import * as React from "react";

import { cn } from "@/lib/utils";


export type MessageFrom = "user" | "assistant" | "system";

type MessageProps = React.ComponentProps<"div"> & {
  from?: MessageFrom;
  variant?: "flat" | "contained";
};

function Message({
  className,
  from = "assistant",
  variant = "flat",
  ...props
}: MessageProps) {
  return (
    <div
      className={cn(
        "group/message flex w-full min-w-0 items-start gap-3",
        "data-[from=user]:flex-row-reverse",
        className,
      )}
      data-from={from}
      data-slot="message"
      data-variant={variant}
      {...props}
    />
  );
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center text-[0.6875rem] font-bold leading-none tracking-[0.02em]",
        "group-data-[from=assistant]/message:bg-primary group-data-[from=assistant]/message:text-primary-foreground",
        "group-data-[from=user]/message:bg-foreground group-data-[from=user]/message:text-background",
        "group-data-[from=system]/message:bg-muted group-data-[from=system]/message:text-muted-foreground",
        className,
      )}
      data-slot="message-avatar"
      {...props}
    />
  );
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "pt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
        "group-data-[from=user]/message:text-right",
        className,
      )}
      data-slot="message-header"
      {...props}
    />
  );
}

function MessageContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative min-w-0 wrap-anywhere text-[0.9375rem] leading-relaxed",
        "group-data-[from=assistant]/message:max-w-[min(100%,40rem)] group-data-[from=assistant]/message:border group-data-[from=assistant]/message:border-l-2 group-data-[from=assistant]/message:border-l-primary group-data-[from=assistant]/message:border-border group-data-[from=assistant]/message:bg-card group-data-[from=assistant]/message:py-3 group-data-[from=assistant]/message:pl-4 group-data-[from=assistant]/message:pr-4",
        "group-data-[from=user]/message:max-w-[85%] group-data-[from=user]/message:bg-foreground group-data-[from=user]/message:px-4 group-data-[from=user]/message:py-2.5 group-data-[from=user]/message:text-background",
        className,
      )}
      data-slot="message-content"
      {...props}
    >
      {children}
    </div>
  );
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-1 text-xs text-muted-foreground", className)}
      data-slot="message-footer"
      {...props}
    />
  );
}

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
};