import type { LucideIcon } from "lucide-react";
import {
  BracesIcon,
  BrainCircuitIcon,
  ContainerIcon,
  DatabaseIcon,
  MonitorIcon,
  ServerIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { stackGroups } from "@/lib/projects";
import type { StackIcon } from "@/lib/types";

const GROUP_ICONS: Record<StackIcon, LucideIcon> = {
  braces: BracesIcon,
  monitor: MonitorIcon,
  server: ServerIcon,
  brain: BrainCircuitIcon,
  database: DatabaseIcon,
  container: ContainerIcon,
};

export function StackCards() {
  return (
    <section id="stack" className="scroll-mt-24">
      <div className="mx-auto max-w-[88rem] px-5 pt-28 sm:px-8 sm:pt-36">
        <SectionHeading
          id="stack-label"
          label="stack"
          title="Ce que j’utilise, rangé par rôle."
        />

        <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
          {stackGroups.map((group, index) => {
            const Icon = GROUP_ICONS[group.icon];

            return (
              <Reveal
                key={group.category}
                delay={index * 0.05}
                className="bg-background p-7 transition-colors duration-300 hover:bg-card sm:p-8"
              >
                <Icon aria-hidden="true" className="size-4 text-primary" />

                <h3 className="mt-4 font-display text-xl font-bold tracking-tight wdth-88">
                  {group.category}
                </h3>

                <ul className="mt-6 flex flex-wrap">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border border-border px-3.5 py-2.5 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="whitespace-nowrap text-[0.875rem] leading-none">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
