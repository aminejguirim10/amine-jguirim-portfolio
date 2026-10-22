"use client";

import * as React from "react";


const KEY = "ask-ai:position";

export type Point = { x: number; y: number };

let cached: Point | null | undefined;
const listeners = new Set<() => void>();

function read(): Point | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as Point).x === "number" &&
      typeof (parsed as Point).y === "number"
    ) {
      return { x: (parsed as Point).x, y: (parsed as Point).y };
    }
  } catch {
  }
  return null;
}

function get(): Point | null {
  if (cached === undefined) cached = read();
  return cached;
}

function getServer(): Point | null {
  return null;
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== KEY) return;

  cached = read();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function write(point: Point | null) {
  cached = point;

  try {
    if (point) window.localStorage.setItem(KEY, JSON.stringify(point));
    else window.localStorage.removeItem(KEY);
  } catch {
  }

  for (const listener of listeners) listener();
}

const MARGIN = 12;

function clamp(x: number, y: number, width: number, height: number): Point {
  return {
    x: Math.min(Math.max(MARGIN, x), window.innerWidth - width - MARGIN),
    y: Math.min(Math.max(MARGIN, y), window.innerHeight - height - MARGIN),
  };
}

export function useDraggable<T extends HTMLElement>(enabled: boolean) {
  const nodeRef = React.useRef<T>(null);
  const point = React.useSyncExternalStore(subscribe, get, getServer);
  const grab = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    function onMove(event: PointerEvent) {
      const start = grab.current;
      const node = nodeRef.current;
      if (!start || !node) return;

      event.preventDefault();

      const rect = node.getBoundingClientRect();
      write(clamp(event.clientX - start.x, event.clientY - start.y, rect.width, rect.height));
    }

    function onUp() {
      grab.current = null;
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [enabled]);

  React.useEffect(() => {
    if (!point) return;

    const { x, y } = point;

    function onResize() {
      const node = nodeRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const next = clamp(x, y, rect.width, rect.height);

      if (next.x !== x || next.y !== y) write(next);
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [point]);

  const onPointerDown = React.useCallback((event: React.PointerEvent) => {
    if (!enabled || event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    const node = nodeRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    grab.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }, [enabled]);

  const reset = React.useCallback(() => write(null), []);

  return { nodeRef, point, onPointerDown, reset };
}