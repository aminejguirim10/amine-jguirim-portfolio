import {
  Building2Icon,
  GraduationCapIcon,
  MapPinIcon,
  UsersRoundIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { associative, parcoursGroups } from "@/lib/parcours";
import type { Entry, Group } from "@/lib/parcours";


function numberEntries() {
  let running = 0;
  return parcoursGroups.map((group) => ({
    ...group,
    entries: group.entries.map((entry) => ({ entry, index: (running += 1) })),
  }));
}

export function Parcours() {
  const groups = numberEntries();

  return (
    <section data-ask-ai-cursor="" id="parcours" className="scroll-mt-24">
      <div className="mx-auto max-w-[88rem] px-5 pt-28 sm:px-8 sm:pt-36">
        <SectionHeading
          id="parcours-label"
          label="parcours"
          title="Cinq ans d'école, six mois d'entreprise."
          aside={
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              Un parcours entre formation d’ingénieur et expérience terrain, où
              je transforme mes connaissances en solutions concrètes autour de
              l’IA, du développement full-stack et du DevOps.
            </p>
          }
        />

        <div>
          {groups.map((group) => (
            <div key={group.title} className="mb-16 last:mb-0">
              <div className="flex items-baseline justify-between gap-6 border-b border-foreground pb-4">
                <h3 className="text-sm text-muted-foreground">{group.title}</h3>
                <span className="nums font-display text-[2.5rem] font-bold leading-none tracking-tight wdth-88 text-primary">
                  {group.total}
                </span>
              </div>

              <ol>
                {group.entries.map(({ entry, index }) => (
                  <Reveal
                    as="li"
                    key={entry.id}
                    delay={(index - 1) * 0.06}
                    className="border-b border-border"
                  >
                    <EntryRow entry={entry} icon={group.icon} />
                  </Reveal>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20">
          <h3 className="mb-6 text-sm text-muted-foreground">
            Vie associative
          </h3>

          <ul className="border-t border-foreground">
            {associative.map((entry) => (
              <li
                key={entry.id}
                className="grid grid-cols-[2.75rem_1fr] items-start gap-x-5 border-b border-border py-7 md:grid-cols-[4rem_minmax(0,75%)_1fr] md:gap-x-8 md:py-8"
              >
                <UsersRoundIcon
                  aria-hidden="true"
                  className="ml-2 mt-1 size-4 text-primary md:mt-0"
                />

                <div className="min-w-0 md:w-full">
                  <p className="font-display text-xl font-bold tracking-tight md:text-2xl">
                    {entry.org}
                  </p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {entry.role}
                  </p>

                  {entry.detail ? (
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {entry.detail}
                    </p>
                  ) : null}

                  {entry.place ? (
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground/80">
                      <MapPinIcon
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-muted-foreground"
                      />
                      {entry.place}
                    </p>
                  ) : null}
                </div>

                <div className="col-start-2 mt-5 md:col-start-auto md:mt-0 md:text-right">
                  <p className="nums text-sm text-muted-foreground">
                    {entry.period}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function EntryRow({ entry, icon }: { entry: Entry; icon: Group["icon"] }) {
  return (
    <article className="group grid grid-cols-[2.75rem_1fr] items-start gap-x-5 py-7 md:grid-cols-[4rem_1fr_9.5rem] md:gap-x-8 md:py-8">
      {icon === "company" ? (
        <Building2Icon
          aria-hidden="true"
          className="ml-2 mt-1 size-4 text-primary md:mt-0"
        />
      ) : (
        <GraduationCapIcon
          aria-hidden="true"
          className="ml-2 mt-1 size-4 text-primary md:mt-0"
        />
      )}

      <div className="min-w-0">
        <h4 className="font-display text-xl font-bold tracking-tight md:text-2xl">
          {entry.org}
          {entry.ongoing ? (
            <span className="ml-3 inline-flex translate-y-[-0.1em] items-center gap-2 align-middle text-xs font-normal tracking-normal text-muted-foreground">
              <span
                aria-hidden="true"
                className="ongoing-mark size-1.5 shrink-0 bg-primary"
              />
              en cours
            </span>
          ) : null}
        </h4>

        <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          {entry.role}
          {entry.detail ? (
            <span className="block text-sm text-muted-foreground/80">
              {entry.detail}
            </span>
          ) : null}
          {entry.place ? (
            <span className="block text-sm text-muted-foreground/80">
              {entry.place}
            </span>
          ) : null}
        </p>

        {entry.points?.length ? (
          <ul className="mt-5 w-full space-y-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground md:max-w-[75%]">
            {entry.points.map((point) => (
              <li
                key={point}
                className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:size-1 before:bg-primary"
              >
                {point}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="col-start-2 mt-5 flex flex-wrap items-baseline gap-x-4 md:col-start-auto md:mt-0 md:block md:text-right">
        {entry.duration ? (
          <span className="nums font-display text-lg font-bold tracking-tight wdth-88">
            {entry.duration}
          </span>
        ) : null}
        <span className="nums mt-1 block text-sm text-muted-foreground">
          {entry.period}
        </span>
      </div>
    </article>
  );
}
