"use client";

import * as React from "react";


const QUERY = "(prefers-reduced-motion: reduce)";

const listeners = new Set<() => void>();

let query: MediaQueryList | null = null;

function media(): MediaQueryList {
  if (!query) query = window.matchMedia(QUERY);
  return query;
}

function subscribe(listener: () => void) {
  const list = media();
  listeners.add(listener);
  list.addEventListener("change", listener);

  return () => {
    listeners.delete(listener);
    list.removeEventListener("change", listener);
  };
}

function getSnapshot(): boolean {
  return media().matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}