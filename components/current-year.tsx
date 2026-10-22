"use client";

import * as React from "react";

const subscribe = () => () => {};

const readYear = () => String(new Date().getFullYear());

export function CurrentYear({ fallback }: { fallback: number }) {
  const year = React.useSyncExternalStore(subscribe, readYear, () => String(fallback));

  return <>{year}</>;
}