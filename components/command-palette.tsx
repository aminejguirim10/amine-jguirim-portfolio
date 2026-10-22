"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  FolderIcon,
  MailIcon,
  MoonIcon,
  SparklesIcon,
} from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

import { openAskAi } from "@/components/ask-ai/store";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { GithubMark, LinkedinMark } from "@/components/ui/brand-icons";
import { cv, identity, nav } from "@/lib/site";
import { projects } from "@/lib/projects";
import { toggleTheme } from "@/lib/theme";
import { useSectionHref } from "@/lib/use-section-href";


let open = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function setPalette(next: boolean) {
  if (open === next) return;
  open = next;
  emit();
}

export function openPalette() {
  setPalette(true);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return open;
}

function getServerSnapshot() {
  return false;
}

export function usePalette() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function CommandTrigger({ children }: { children: React.ReactNode }) {
  const isOpen = usePalette();

  return (
    <Slot
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      onClick={openPalette}
    >
      {children}
    </Slot>
  );
}

export function CommandPaletteLayer() {
  const router = useRouter();
  const isOpen = usePalette();
  const sectionHref = useSectionHref();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!event.metaKey && !event.ctrlKey) return;
      event.preventDefault();
      setPalette(!open);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openChat = () => {
    setPalette(false);
    requestAnimationFrame(openAskAi);
  };

  return (
    <CommandDialog
      onOpenChange={setPalette}
      open={isOpen}
      title="Palette de commandes"
      description="Chercher un projet, une section ou une action."
      className="max-h-[85svh] sm:max-w-xl"
    >
      <Command label="Rechercher dans le site">
        <CommandInput placeholder="Rechercher un projet, une section…" />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>

        <CommandGroup heading="Projets">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              value={project.name}
              keywords={[project.slug, project.year, ...project.stack]}
              onSelect={() => router.push(`/projets/${project.slug}`)}
            >
              <FolderIcon className="text-muted-foreground" />
              <span className="truncate">{project.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Sections">
          {nav.map((item) => (
            <CommandItem
              key={item.href}
              value={item.label}
              keywords={[item.href]}
              onSelect={() => router.push(sectionHref(item.href))}
            >
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem
            value="Télécharger le CV"
            keywords={["cv", "pdf", "curriculum"]}
            onSelect={() => router.push(cv.href)}
          >
            <DownloadIcon className="text-muted-foreground" />
            <span>Télécharger le CV</span>
          </CommandItem>

          <CommandItem
            value="Voir le code"
            keywords={["git", "github", "code", "dépôts", "repositories"]}
            onSelect={() => window.open(identity.github, "_blank", "noopener,noreferrer")}
          >
            <GithubMark className="text-muted-foreground" />
            <span>Voir le code</span>
          </CommandItem>

          <CommandItem
            value="LinkedIn"
            keywords={["in", "linkedin", "réseau"]}
            onSelect={() => window.open(identity.linkedin, "_blank", "noopener,noreferrer")}
          >
            <LinkedinMark className="text-muted-foreground" />
            <span>LinkedIn</span>
          </CommandItem>

          <CommandItem
            value="Écrire"
            keywords={["@", "mail", "email", "contact", "écrire"]}
            onSelect={() => {
              window.location.href = `mailto:${identity.email}`;
            }}
          >
            <MailIcon className="text-muted-foreground" />
            <span>Écrire</span>
          </CommandItem>

          <CommandItem
            value="Demander à l'IA"
            keywords={["ia", "chat", "assistant", "question"]}
            onSelect={openChat}
          >
            <SparklesIcon className="text-muted-foreground" />
            <span>Demander à l&apos;IA</span>
          </CommandItem>

          <CommandItem
            value="Changer de thème"
            keywords={["th", "sombre", "clair", "dark", "light", "contraste"]}
            onSelect={toggleTheme}
          >
            <MoonIcon className="text-muted-foreground" />
            <span>Changer de thème</span>
          </CommandItem>
        </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}