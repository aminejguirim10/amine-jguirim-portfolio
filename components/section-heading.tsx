"use client";

import { Reveal } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  label,
  title,
  aside,
  className,
}: {
  id: string;
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 sm:mb-16", className)}>
      <Reveal>
        <div className="flex items-center gap-3">
          <span id={id} className="text-sm text-muted-foreground">
            {label}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-5 grid gap-6 lg:grid-cols-12">
          <h2 className="min-w-0 font-display text-[clamp(2rem,5.6vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.035em] wdth-72 lg:col-span-7">
            {title}
          </h2>
          {aside ? (
            <div className="min-w-0 self-end lg:col-span-4 lg:col-start-9">
              {aside}
            </div>
          ) : null}
        </div>
      </Reveal>
    </div>
  );
}