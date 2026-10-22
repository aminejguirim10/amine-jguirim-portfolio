"use client";

import * as React from "react";
import Link from "next/link";
import { DownloadIcon, MailIcon, MoonIcon, SearchIcon, SparklesIcon, SunIcon } from "lucide-react";

import { AskAi } from "@/components/ask-ai";
import { openPalette } from "@/components/command-palette";
import { Button } from "@/components/ui/button";
import { GithubMark } from "@/components/ui/brand-icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cv, identity, nav } from "@/lib/site";
import { toggleTheme } from "@/lib/theme";
import { useSectionHref } from "@/lib/use-section-href";

export function MobileNav({ children }: { children: React.ReactNode }) {
  const sectionHref = useSectionHref();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="gap-4 p-6 sm:gap-6 sm:p-8">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            {identity.role} · {identity.base}
          </SheetDescription>
        </SheetHeader>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {nav.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={sectionHref(item.href)}
                className="border-b border-border py-3 font-display text-xl font-semibold tracking-tight transition-colors hover:text-primary sm:py-4 sm:text-2xl"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="flex shrink-0 flex-col gap-3 border-t border-border pt-5">
          <AskAi>
            <Button className="h-11 w-full justify-start" size="sm" variant="outline">
              <SparklesIcon data-icon="inline-start" />
              Poser une question à l&apos;IA
            </Button>
          </AskAi>

          <SheetClose asChild>
            <Button
              asChild
              className="h-11 w-full justify-start"
              size="sm"
              variant="outline"
            >
              <a href={cv.href} download={cv.filename}>
                <DownloadIcon data-icon="inline-start" />
                {cv.label}
              </a>
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <a
              href={`mailto:${identity.email}`}
              className="flex items-center gap-2.5 text-[0.9375rem] text-muted-foreground"
            >
              <MailIcon className="size-4 shrink-0" />
              {identity.email}
            </a>
          </SheetClose>
          <SheetClose asChild>
            <a
              href={identity.github}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2.5 text-[0.9375rem] text-muted-foreground"
            >
              <GithubMark className="size-4 shrink-0" />
              github.com/{identity.handle}
            </a>
          </SheetClose>

          <button
            type="button"
            onClick={openPalette}
            className="flex items-center gap-2.5 text-[0.9375rem] text-muted-foreground"
          >
            <SearchIcon className="size-4 shrink-0" />
            Rechercher
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2.5 text-[0.9375rem] text-muted-foreground"
          >
            <MoonIcon className="size-4 shrink-0 dark:hidden" />
            <SunIcon className="hidden size-4 shrink-0 dark:block" />
            Changer de thème
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}