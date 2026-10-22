import type { Metadata } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";

import { AskAiLayer } from "@/components/ask-ai";
import { QuestionCursor } from "@/components/ask-ai/question-cursor";
import { CommandPaletteLayer } from "@/components/command-palette";
import { identity, siteUrl } from "@/lib/site";
import { themeScript } from "@/lib/theme";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${identity.fullName} — ${identity.role}`,
    template: `%s — ${identity.fullName}`,
  },
  description: identity.roleTagline,
  authors: [{ name: identity.fullName, url: identity.github }],
  creator: identity.fullName,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: identity.fullName,
    title: `${identity.fullName} — ${identity.role}`,
    description: identity.roleTagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.fullName} — ${identity.role}`,
    description: identity.roleTagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${instrumentSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body className="min-h-dvh antialiased">
        {children}

        <CommandPaletteLayer />

        <AskAiLayer />

        <QuestionCursor />
      </body>
    </html>
  );
}