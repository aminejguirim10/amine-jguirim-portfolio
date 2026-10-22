import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { Separator } from "@/components/ui/separator";

export function Scope() {
  return (
    <section
      data-ask-ai-cursor=""
      id="scope"
      className="mx-auto max-w-[88rem] scroll-mt-24 px-5 pt-28 sm:px-8 sm:pt-36"
    >
      <SectionHeading
        id="scope-label"
        label="scope"
        title="Je travaille surtout sur des produits où l'IA fait une partie du travail."
        aside={
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            Du développement d'agents intelligents à la création d'applications
            full-stack, jusqu'au déploiement et à l'automatisation de
            l'infrastructure, j'aime construire des solutions complètes, pensées
            pour fonctionner dans le monde réel.
          </p>
        }
      />

      <Separator />

      <div className="grid gap-10 pt-10 md:grid-cols-3 md:gap-14">
        {[
          {
            title: "L'IA au cœur du produit",
            body: "J'explore l'IA agentique, les LLM et les workflows intelligents pour transformer des modèles en fonctionnalités concrètes : automatiser des tâches, analyser des données et assister les utilisateurs dans leurs décisions.",
          },
          {
            title: "Du frontend au backend",
            body: "Je développe des applications full-stack, de la conception des interfaces aux API, aux bases de données et à l'intégration des services d'IA. Mon objectif : construire des applications cohérentes, robustes et utiles, où chaque composant a son rôle.",
          },
          {
            title: "Du code à la production",
            body: "Je m'intéresse aussi à ce qui rend une application réellement exploitable : conteneurisation, CI/CD, orchestration, monitoring et infrastructure cloud. Parce qu'un produit ne s'arrête pas au code : il doit pouvoir être déployé, observé et évoluer.",
          },
        ].map((item, index) => (
          <Reveal key={item.title} delay={index * 0.09}>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
