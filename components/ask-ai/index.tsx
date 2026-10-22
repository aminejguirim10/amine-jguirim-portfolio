"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import {
  closeAskAi,
  openAskAi,
  restoreMode,
  useAskAi,
} from "@/components/ask-ai/store";


const AskAiSurface = React.lazy(() =>
  import("@/components/ask-ai/surface").then((module) => ({
    default: module.AskAiSurface,
  })),
);

export function AskAi({ children }: { children: React.ReactNode }) {
  const { open } = useAskAi();

  React.useEffect(() => {
    restoreMode();
  }, []);

  return (
    <Slot
      aria-expanded={open}
      aria-haspopup="dialog"
      data-ask-ai-trigger=""
      onClick={openAskAi}
    >
      {children}
    </Slot>
  );
}

export function AskAiLayer() {
  const { live, open, mode, pending } = useAskAi();

  if (!live) return null;

  return (
    <React.Suspense fallback={null}>
      <AskAiSurface mode={mode} onClose={closeAskAi} open={open} pending={pending} />
    </React.Suspense>
  );
}