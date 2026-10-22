"use client";

import * as React from "react";


const isApple = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

const subscribe = () => () => {};

export function useModKey() {
  return React.useSyncExternalStore(
    subscribe,
    () => (isApple() ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );
}