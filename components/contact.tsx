import { DownloadIcon, MailIcon, MapPinIcon } from "lucide-react";

import { CopyEmail } from "@/components/copy-email";
import { CurrentYear } from "@/components/current-year";
import { Magnetic, Reveal } from "@/components/motion-primitives";
import { GithubMark, LinkedinMark } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { cv, identity } from "@/lib/site";

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-[88rem] scroll-mt-24 px-5 pt-28 pb-28 sm:px-8 sm:pt-36 sm:pb-36"
    >
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">contact</span>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="mt-5 max-w-[34ch] font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.02em] wdth-72">
          Une seule adresse, et elle fonctionne.
        </p>
      </Reveal>

      <Reveal delay={0.14}>
        <a
          href={`mailto:${identity.email}`}
          className="mt-8 block font-display text-[clamp(1rem,5vw,1.75rem)] font-extrabold leading-[1.02] tracking-[-0.01em] transition-colors hover:text-primary wdth-65 break-all sm:text-[clamp(2.5rem,7vw,5.25rem)]"
        >
          {identity.email}
        </a>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Button asChild size="lg" variant="cobalt">
              <a href={`mailto:${identity.email}`}>
                <MailIcon data-icon="inline-start" />
                Écrire
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <CopyEmail size="lg" value={identity.email} />
          </Magnetic>
          <Magnetic>
            <Button asChild size="lg" variant="outline">
              <a href={cv.href} download={cv.filename}>
                <DownloadIcon data-icon="inline-start" />
                {cv.label}
              </a>
            </Button>
          </Magnetic>
          <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />
          <Magnetic>
            <Button asChild size="lg" variant="outline">
              <a href={identity.linkedin} target="_blank" rel="noreferrer noopener">
                <LinkedinMark data-icon="inline-start" />
                LinkedIn
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild size="lg" variant="outline">
              <a href={identity.github} target="_blank" rel="noreferrer noopener">
                <GithubMark data-icon="inline-start" />
                Voir le code
              </a>
            </Button>
          </Magnetic>
        </div>
      </Reveal>

      <Reveal delay={0.26}>
        <p className="mt-10 flex items-center gap-2.5 text-[0.9375rem] text-muted-foreground">
          <MapPinIcon className="size-4 shrink-0" />
          {identity.baseNote}, {identity.base}
        </p>
      </Reveal>
    </section>
  );
}

export function Footer({ year }: { year: number }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-sm font-semibold tracking-tight">
          {identity.fullName}
        </p>

        <p className="nums text-sm text-muted-foreground">
          © <CurrentYear fallback={year} /> · {identity.base}
        </p>
      </div>
    </footer>
  );
}