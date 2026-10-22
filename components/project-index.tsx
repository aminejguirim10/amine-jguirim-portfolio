"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRightIcon, FolderIcon, MonitorPlayIcon } from "lucide-react";

import { SpotlightSurface } from "@/components/motion-primitives";
import { GithubMark } from "@/components/ui/brand-icons";
import { LinkPreview } from "@/components/ui/link-preview";
import { alsoBuilt, repoUrl } from "@/lib/projects";
import type { Project } from "@/lib/types";


const DESKTOP = "(min-width: 64rem)";

export function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <>
      <ol className="border-t border-foreground">
        {projects.map((project) => (
          <li key={project.slug}>
            <SpotlightSurface>
              <article className="group grid grid-cols-[2.75rem_1fr] items-start gap-x-5 border-b border-border py-7 transition-colors md:grid-cols-[4rem_1fr_5rem_12rem] md:items-center md:gap-x-8 md:py-8">
                <FolderIcon
                  aria-hidden="true"
                  className="ml-2 mt-1 size-4 text-primary md:mt-0"
                />

                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">
                    <Link
                      data-ask-ai-link=""
                      href={`/projets/${project.slug}`}
                      className="transition-colors group-hover:text-primary"
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-[52ch] leading-relaxed text-muted-foreground">
                    {project.kicker}
                  </p>
                </div>

                <span className="nums col-start-2 mt-4 font-display text-sm text-muted-foreground md:col-start-auto md:mt-0 md:text-right">
                  {project.year}
                </span>

                <div className="col-start-2 mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:col-start-auto md:mt-0 md:flex-col md:items-start md:gap-1.5">
                  <div className="flex items-center gap-4">
                    {project.live ? (
                      <LinkPreview url={project.live} title={project.name}>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer noopener"
                          onClick={(event) => {
                            if (!window.matchMedia(DESKTOP).matches) {
                              event.preventDefault();
                            }
                          }}
                          className="flex items-center gap-1.5 transition-colors hover:text-primary"
                        >
                          <MonitorPlayIcon
                            aria-hidden="true"
                            className="size-3.5 shrink-0"
                          />
                          Démo
                          <ArrowUpRightIcon className="size-3.5" />
                        </a>
                      </LinkPreview>
                    ) : null}
                    <a
                      href={repoUrl(project.repo)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-1.5 transition-colors hover:text-primary"
                    >
                      <GithubMark className="size-3.5 shrink-0" />
                      Source
                      <ArrowUpRightIcon className="size-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            </SpotlightSurface>
          </li>
        ))}
      </ol>

      <div className="mt-16 sm:mt-20">
        <h3 className="mb-6 text-sm text-muted-foreground">
          Également dans le compte
        </h3>

        <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {alsoBuilt.map((item) => (
            <li
              key={item.repo}
              className="flex flex-col border-t border-border pt-4"
            >
              <a
                href={repoUrl(item.repo)}
                target="_blank"
                rel="noreferrer noopener"
                className="font-display font-semibold tracking-tight transition-colors hover:text-primary"
              >
                {item.name}
              </a>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
