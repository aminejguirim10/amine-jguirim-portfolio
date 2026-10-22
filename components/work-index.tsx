import { ProjectIndex } from "@/components/project-index";
import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/lib/projects";

import { identity } from "@/lib/site";

export function WorkIndex({ reposCount = 31 }: { reposCount?: number }) {
  return (
    <section
      data-ask-ai-cursor=""
      id="work"
      className="mx-auto max-w-[88rem] scroll-mt-24 px-5 pt-28 sm:px-8 sm:pt-36"
    >
      <SectionHeading
        id="work-label"
        label="work"
        title="Onze projets qui montrent le mieux ce que je fais."
        aside={
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            Survolez « Démo » pour voir le site tourner. Le reste est dans{" "}
            <a
              href={identity.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              les {reposCount} dépôts du compte
            </a>
            .
          </p>
        }
      />

      <Reveal>
        <ProjectIndex projects={projects} />
      </Reveal>
    </section>
  );
}