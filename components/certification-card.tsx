import { AwardIcon, MedalIcon } from "lucide-react";

import { Credential } from "@/lib/certifications";

const ICONS = {
  award: AwardIcon,
  medal: MedalIcon,
} as const;

const KIND_LABEL = {
  certification: "certification",
  badge: "badge",
} as const;

export function CertificationCard({ cert }: { cert: Credential }) {
  const Icon = ICONS[cert.icon];

  return (
    <div className="folded-card h-full">
      <article className="fold-body relative flex h-full min-h-[20rem] flex-col bg-card p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center border border-border bg-background text-primary">
            <Icon className="size-4" />
          </span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {KIND_LABEL[cert.kind]}
          </span>
        </div>

        <h3 className="mt-6 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-display text-lg font-bold tracking-tight wdth-88">
          {cert.url ? (
            <a
              data-ask-ai-link=""
              href={cert.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${cert.title} — s'ouvre dans un nouvel onglet`}
              className="transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-primary"
            >
              {cert.title}
            </a>
          ) : (
            cert.title
          )}
        </h3>

        <p className="mt-3 min-h-[6.1rem] line-clamp-4 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          {cert.summary}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5 text-[0.875rem] text-muted-foreground">
          <span>{cert.issuer}</span>
          {cert.code ? (
            <>
              <span aria-hidden="true" className="size-1 shrink-0 bg-border" />
              <span className="nums font-mono text-[0.8125rem]">{cert.code}</span>
            </>
          ) : null}
        </div>
      </article>
    </div>
  );
}