"use client";

import { usePathname } from "next/navigation";

export function useSectionHref() {
  const pathname = usePathname();

  return (hash: string) => (pathname === "/" ? hash : `/${hash}`);
}