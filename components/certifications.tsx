import { CertificationCard } from "@/components/certification-card";
import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { credentials } from "@/lib/certifications";

export function Certifications() {
  return (
    <section
      data-ask-ai-cursor=""
      id="certifications"
      className="mx-auto max-w-[88rem] scroll-mt-24 px-5 pt-28 sm:px-8 sm:pt-36"
    >
      <SectionHeading
        id="certifications-label"
        label="certifications"
        title="Le réseau d'un côté, le cloud de l'autre."
        aside={
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            Une certification est un diplôme, un badge une pastille de compétence.
            Chaque carte a son coin plié.
          </p>
        }
      />

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {credentials.map((cert, index) => (
          <Reveal key={cert.id} delay={index * 0.06}>
            <CertificationCard cert={cert} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}