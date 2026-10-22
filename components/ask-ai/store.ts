"use client";

import * as React from "react";


export type Mode = "panel" | "dock";

const KEY = "ask-ai:mode";

type State = {
  live: boolean;
  open: boolean;
  mode: Mode;
  pending: string | null;
};

let snapshot: State = { live: false, open: false, mode: "panel", pending: null };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function update(patch: Partial<State>) {
  snapshot = { ...snapshot, ...patch };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function read(): State {
  return snapshot;
}

export function useAskAi(): State {
  return React.useSyncExternalStore(subscribe, read, read);
}

export function openAskAi() {
  update({ live: true, open: true, mode: "panel" });
}

export function expandBar() {
  update({ live: true, open: true });
}

export function askAiAbout(question: string) {
  update({ live: true, open: true, pending: question });
}

export function closeAskAi() {
  update({ open: false });
}

export function toggleMode() {
  const mode: Mode = snapshot.mode === "panel" ? "dock" : "panel";
  update({ mode });

  try {
    window.localStorage.setItem(KEY, mode);
  } catch {
  }
}

let restored = false;

export function restoreMode() {
  if (restored) return;
  restored = true;

  try {
    if (window.localStorage.getItem(KEY) === "dock") update({ mode: "dock" });
  } catch {
  }
}