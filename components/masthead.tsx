"use client";

import * as React from "react";
import Link from "next/link";
import { DownloadIcon, MailIcon, MenuIcon, SearchIcon, SparklesIcon } from "lucide-react";

import { AskAi } from "@/components/ask-ai";
import { CommandTrigger } from "@/components/command-palette";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cv, identity, nav } from "@/lib/site";
import { useModKey } from "@/lib/platform";
import { useSectionHref } from "@/lib/use-section-href";


const SECTION_IDS = nav.map((item) => item.href.slice(1));

const PROBE = 96;

function useActiveSection() {
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current: string | null = null;
      let lastHere: string | null = null;

      for (const id of SECTION_IDS) {
        const node = document.getElementById(id);
        if (!node) continue;
        lastHere = id;
        if (node.getBoundingClientRect().top <= PROBE) current = id;
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom && lastHere) current = lastHere;

      setActive(current);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return active;
}

export function Masthead() {
  const active = useActiveSection();
  const sectionHref = useSectionHref();
  const mod = useModKey();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[88rem] items-center gap-6 px-5 sm:px-8">
        <Link
          href={sectionHref("#top")}
          className="font-display text-[0.9375rem] font-bold tracking-tight"
        >
          {identity.firstName} {identity.lastName}
        </Link>

        <nav className="ml-auto hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const current = active === item.href.slice(1);
            return (
              <Link
                key={item.href}
                href={sectionHref(item.href)}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "relative py-2 text-[0.9375rem] transition-colors",
                  current
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-primary transition-opacity duration-200",
                    current ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <AskAi>
            <Button size="default" variant="outline" className="hidden sm:inline-flex">
              <SparklesIcon data-icon="inline-start" />
              Ask AI
            </Button>
          </AskAi>

          <Button
            asChild
            size="default"
            variant="outline"
            className="hidden sm:inline-flex"
          >
            <a href={cv.href} download={cv.filename}>
              <DownloadIcon data-icon="inline-start" />
              {cv.shortLabel}
            </a>
          </Button>

          <Button asChild className="hidden sm:inline-flex" size="icon" variant="outline">
            <a aria-label={`Écrire à ${identity.fullName}`} href={`mailto:${identity.email}`}>
              <MailIcon />
            </a>
          </Button>

          <CommandTrigger>
            <Button
              size="default"
              variant="outline"
              className="hidden xl:inline-flex"
            >
              <SearchIcon data-icon="inline-start" />
              Rechercher
              <kbd className="ml-2 border-l border-border pl-2.5 text-xs tracking-widest text-muted-foreground">
                {mod}K
              </kbd>
            </Button>
          </CommandTrigger>

          <ThemeToggle className="hidden xl:inline-flex" />

          <MobileNav>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </MobileNav>
        </div>
      </div>
    </header>
  );
}