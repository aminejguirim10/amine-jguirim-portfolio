import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  FolderIcon,
  MonitorPlayIcon,
} from "lucide-react";

import { Footer } from "@/components/contact";
import { Masthead } from "@/components/masthead";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubMark } from "@/components/ui/brand-icons";
import { getProject, projects, repoUrl } from "@/lib/projects";
import { getGitHubStats } from "@/lib/github";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const instant = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Projet introuvable" };

  return {
    title: project.name,
    description: project.kicker,
    openGraph: {
      title: project.name,
      description: project.kicker,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[index + 1];

  const stats = await getGitHubStats();
  const year = Number(stats.fetchedAt.slice(0, 4));

  return (
    <>
      <ScrollToTop />
      <Masthead />

      <main className="mx-auto max-w-[88rem] px-5 pt-14 sm:px-8 sm:pt-20">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 text-[0.9375rem] text-muted-foreground transition-colors duration-300 hover:text-primary"
        >
          <ArrowLeftIcon
            aria-hidden="true"
            className="size-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1"
          />
          Retour
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8" data-ask-ai-cursor="">
            <FolderIcon aria-hidden="true" className="size-5 text-primary" />

            <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] wdth-72">
              {project.name}
            </h1>

            <p className="mt-6 max-w-[54ch] text-xl leading-[1.5] text-muted-foreground">
              {project.kicker}
            </p>
          </div>

          <dl className="lg:col-span-3 lg:col-start-10">
            {[
              { key: "Année", value: project.year },
              { key: "Rôle", value: project.role },
            ].map((field) => (
              <div key={field.key} className="border-t border-border py-4">
                <dt className="text-sm text-muted-foreground">{field.key}</dt>
                <dd className="mt-1 font-display font-semibold tracking-tight">
                  {field.value}
                </dd>
              </div>
            ))}

            <div className="flex flex-col gap-2 pt-4">
              {project.live ? (
                <Button asChild variant="cobalt">
                  <a
                    className="group"
                    href={project.live}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <MonitorPlayIcon data-icon="inline-start" />
                    Ouvrir la démo
                    <ArrowUpRightIcon
                      data-icon="inline-end"
                      className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
                    />
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <a
                  className="group"
                  href={repoUrl(project.repo)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <GithubMark data-icon="inline-start" />
                  Code source
                  <ArrowUpRightIcon
                    data-icon="inline-end"
                    className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
                  />
                </a>
              </Button>
            </div>
          </dl>
        </div>

        <div className="mt-16 grid gap-12 border-t border-foreground pt-12 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-12 lg:col-span-7" data-ask-ai-cursor="">
            {project.lede ? (
              <p className="font-display text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                {project.lede}
              </p>
            ) : null}

            {project.useCase ? (
              <div className="border-t border-border pt-8">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Cas d’usage et problème résolu
                </h2>
                <p className="mt-4 text-[1.0625rem] leading-[1.75] text-muted-foreground">
                  {project.useCase}
                </p>
              </div>
            ) : null}

            <div className="border-t border-border pt-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Architecture et choix d’ingénierie
              </h2>
              <div className="mt-4 space-y-5">
                {project.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="text-[1.0625rem] leading-[1.75] text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {project.highlights?.length ? (
              <div className="border-t border-border pt-8">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Points clés du système
                </h2>
                <ul className="mt-5 space-y-3.5">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="grid grid-cols-[1rem_1fr] items-baseline gap-3 text-[1rem] leading-relaxed text-foreground/85"
                    >
                      <span className="font-display text-xs text-primary" aria-hidden="true">
                        —
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.repoExtra?.length ? (
              <div className="border-t border-border pt-6">
                <p className="text-[0.9375rem] text-muted-foreground">
                  Dépôts liés :{" "}
                  {project.repoExtra.map((repo, i) => (
                    <span key={repo}>
                      {i > 0 ? ", " : ""}
                      <a
                        href={repoUrl(repo)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-primary hover:text-primary"
                      >
                        {repo}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-28 space-y-8">
              <div className="border-t border-border pt-5">
                <h2 className="text-sm text-muted-foreground">Stack</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <li key={item}>
                      <Badge>{item}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {next ? (
          <nav className="mt-24 border-t border-foreground pt-8">
            <p className="text-sm text-muted-foreground">Projet suivant</p>
            <Link
              href={`/projets/${next.slug}`}
              className="mt-3 block font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight tracking-[-0.02em] transition-colors hover:text-primary wdth-88"
            >
              {next.name}
            </Link>
          </nav>
        ) : null}
      </main>

      <div className="mt-28">
        <Footer year={year} />
      </div>
    </>
  );
}
