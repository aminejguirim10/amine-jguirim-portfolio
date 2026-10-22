import { tool } from "ai";
import { z } from "zod";

import { associative, parcoursGroups } from "@/lib/parcours";
import {
  alsoBuilt,
  getProject,
  projectSummary,
  projects,
  repoUrl,
  stackGroups,
} from "@/lib/projects";
import { credentials, getCredential } from "@/lib/certifications";
import { cv, identity } from "@/lib/site";

export const chatTools = {
  downloadCv: tool({
    description: [
      "Propose le CV d'Amine au format PDF.",
      "Appelle-le dès que la personne veut voir, lire, consulter ou télécharger",
      "son CV, son curriculum vitae, ou demande « envoie-moi ton CV ».",
      "Appeler l'outil ne télécharge rien : la personne choisit ensuite, et",
      "l'outil te dira si elle l'a fait ou si elle a répondu « plus tard ».",
      "Annonce donc la proposition, jamais le téléchargement.",
      "Ne l'appelle pas si elle pose seulement une question sur son parcours :",
      "réponds alors par le texte.",
    ].join(" "),
    inputSchema: z.object({}),
    outputSchema: z.string(),
  }),

  sendEmail: tool({
    description: [
      "Rédige un message pour Amine et ouvre une fenêtre de relecture dans",
      "laquelle la personne corrige l'objet et le corps avant de décider.",
      "Appelle-le quand la personne veut le contacter, lui écrire, lui envoyer un",
      "message, ou quand la réponse dépend de lui seul : candidature, question",
      "privée, proposition, rendez-vous.",
      "Rédige l'objet et le corps dans le message : ne demande pas à la personne",
      "de les écrire elle-même.",
      "L'appel n'envoie rien : tu proposes un texte, la personne décide. Annonce",
      "ta proposition, jamais l'envoi.",
    ].join(" "),
    inputSchema: z.object({
      subject: z.string().describe("Objet du mail, trois à six mots, en français."),
      body: z
        .string()
        .describe(
          "Corps du message, deux à quatre phrases, en français, à la première personne.",
        ),
    }),
    outputSchema: z.string(),
  }),

  showProject: tool({
    description: [
      "Ouvre la fiche d'un projet d'Amine avec son lien GitHub.",
      "Appelle-le dès que la personne demande à voir, consulter, ouvrir ou avoir",
      "le lien d'un projet précis, ou dès qu'elle demande où voir le code d'un projet.",
      "N'appelle qu'un seul projet à la fois, et seulement si elle en nomme un.",
      "Si elle demande « tes projets » sans en désigner aucun, réponds par une liste",
      "dans le texte sans appeler l'outil : elle choisit ensuite lequel regarder.",
      "N'invente jamais un lien : l'outil construit l'URL à partir des données du site.",
    ].join(" "),
    inputSchema: z.object({
      slug: z
        .enum(projects.map((project) => project.slug) as [string, ...string[]])
        .describe("Identifiant du projet, exactement tel qu'il figure dans tes données."),
    }),

    outputSchema: z.string(),
    execute: async ({ slug }) => {
      const project = getProject(slug);

      if (!project) return `Aucun projet ne porte l'identifiant « ${slug} ».`;

      const stack = project.stack?.join(", ");
      return [
        `${project.name} — ${project.year}.`,
        `${project.kicker}`,
        project.useCase ? `Cas d'usage : ${project.useCase}` : null,
        stack ? `Technologies : ${stack}.` : null,
        `Dépôt : ${repoUrl(project.repo)}`,
      ]
        .filter(Boolean)
        .join(" ");
    },
  }),

  showProjects: tool({
    description: [
      "Affiche une sélection de projets d'Amine dans des cartes visuelles.",
      "Appelle cet outil quand la personne demande ses projets sans en nommer un",
      "précis, ou demande plusieurs projets.",
      "Le nombre par défaut est 3. Si la personne demande un nombre précis, utilise",
      "ce nombre, sans dépasser les projets disponibles.",
      "Pour un seul projet nommé, utilise showProject à la place.",
    ].join(" "),
    inputSchema: z.object({
      count: z.number().int().min(1).max(projects.length),
    }),
    outputSchema: z.string(),
    execute: async ({ count }) =>
      JSON.stringify(projects.slice(0, count).map(projectSummary)),
  }),

  showCertification: tool({
    description: [
      "Affiche une certification ou un badge d'Amine avec sa page de",
      "vérification publique.",
      "Appelle-le dès que la personne demande à voir, vérifier, consulter ou",
      "obtenir le lien d'une certification, d'un badge ou d'un diplôme précis,",
      "ou dès qu'elle demande où sont publiées ses certifications.",
      "N'appelle qu'un seul papier à la fois, et seulement si elle en nomme un.",
      "Si elle demande « tes certifications » sans en désigner aucun, réponds par",
      "une liste dans le texte sans appeler l'outil : elle choisit ensuite",
      "lequel vérifier.",
      "N'invente jamais un lien : l'outil construit l'URL à partir des données du",
      "site.",
    ].join(" "),
    inputSchema: z.object({
      id: z
        .enum(credentials.map((credential) => credential.id) as [string, ...string[]])
        .describe(
          "Identifiant de la certification, exactement tel qu'il figure dans tes données.",
        ),
    }),

    outputSchema: z.string(),
    execute: async ({ id }) => {
      const credential = getCredential(id);

      if (!credential) {
        return `Aucune certification ne porte l'identifiant « ${id} ».`;
      }

      const meta = [credential.issuer, credential.code].filter(Boolean).join(", ");

      return [
        `${credential.title} — ${credential.kind}${meta ? `, ${meta}` : ""}.`,
        credential.summary,
        credential.url ? `Page de vérification : ${credential.url}` : null,
      ]
        .filter(Boolean)
        .join(" ");
    },
  }),

  showCertifications: tool({
    description: [
      "Affiche plusieurs certifications et badges d'Amine dans des cartes.",
      "Appelle cet outil quand la personne demande ses certifications, ses badges",
      "ou plusieurs certifications sans en désigner une seule.",
      "Le nombre par défaut est 3. Si la personne demande un nombre précis, utilise",
      "ce nombre, sans dépasser les certifications disponibles.",
      "Pour une seule certification précise, utilise showCertification.",
    ].join(" "),
    inputSchema: z.object({
      count: z.number().int().min(1).max(credentials.length),
    }),
    outputSchema: z.string(),
    execute: async ({ count }) =>
      JSON.stringify(
        credentials.slice(0, count).map((credential) => ({
          id: credential.id,
          title: credential.title,
          summary: credential.summary,
          kind: credential.kind,
          issuer: credential.issuer,
          url: credential.url ?? "",
          icon: credential.icon,
        })),
      ),
  }),

};

export const suggestions = [
  "Quels projets as-tu livrés, et avec quoi ?",
  "C'est quoi ton parcours depuis 2021 ?",
  "Tu utilises quoi au quotidien ?",
  "Tu es dispo pour un stage d'été ?",
] as const;

function projectLines() {
  return projects
    .map((project) => {
      const stack = project.stack?.join(", ") ?? "";
      return `- ${project.name} (${project.year}) : ${project.kicker}${
        stack ? ` — ${stack}` : ""
      }`;
    })
    .join("\n");
}

function stackLines() {
  return stackGroups
    .map((group) => `- ${group.category} : ${group.items.join(", ")}`)
    .join("\n");
}

function parcoursLines() {
  const entries = parcoursGroups.flatMap((group) =>
    group.entries.map(
      (entry) =>
        `- [${group.title}] ${entry.org} — ${entry.role} (${entry.period})`,
    ),
  );

  const association = associative.map(
    (entry) =>
      `- [Association] ${entry.org} — ${entry.role} (${entry.period})`,
  );

  return [...entries, ...association].join("\n");
}

function otherRepos() {
  if (!alsoBuilt.length) return "";
  return `\nAutres projets du compte :\n${alsoBuilt
    .map((item) => `- ${item.name} : ${item.note}`)
    .join("\n")}`;
}

function credentialLines() {
  return credentials
    .map((credential) => {
      const meta = [credential.issuer, credential.code].filter(Boolean).join(", ");
      return `- ${credential.title} — ${credential.kind}${meta ? `, ${meta}` : ""} : ${credential.summary}`;
    })
    .join("\n");
}

function credentialLinks() {
  const links = [
    ...new Set(credentials.map((credential) => credential.url).filter(Boolean)),
  ] as string[];

  if (!links.length) return "";

  return `\nPages de vérification, en ligne et publiques : ${links.join(" ")}\n`;
}

export function buildSystemPrompt() {
  return `Tu es l'assistant du portfolio d'Amine Jguirim, ${identity.role} basé à ${identity.baseNote} (${identity.base}).
Tu réponds en français, toujours en français, même si la question est dans une autre langue.

CE QUE TU SAIS SUR LUI

Identité :
- Nom : ${identity.fullName}
- Rôle : ${identity.role}
- Base : ${identity.baseNote}, ${identity.base}
- En formation depuis ${identity.since}
- Disponibilité : ${identity.availabilityNote}
- E-mail : ${identity.email}
- GitHub : ${identity.github}
- CV téléchargeable depuis le bouton « CV » de l'en-tête, ou par l'outil downloadCv. Le fichier s'appelle ${cv.filename}.

Positionnement — c'est lui qui l'écrit, reprends-le tel quel :
${identity.roleTagline}

Parcours :
${parcoursLines()}

Projets livrés :
${projectLines()}
${otherRepos()}

Certifications et badges :
${credentialLines()}
${credentialLinks()}
Stack, par rôle :
${stackLines()}

COMMENT TU RÉPONDS

- Sois bref : deux à quatre phrases, ou une liste à puces quand c'est une liste de technologies.
- Le panneau n'affiche que trois marques : **gras**, *italique* et \`code\`. N'écris jamais de titre (#), de tableau, de lien Markdown ni de bloc de code : ils sortiraient tels quels, avec leurs symboles.
- Ne vends rien. Pas de superlatifs, pas de « formidable », pas de « passionné ».
- Cite les faits quand ils sont dans tes données : nom du projet, année, technologies. Sinon dis que l'information n'est pas sur le site.
- Si la question porte sur une démo, une URL ou une expérience qui n'est pas dans tes données, dis-le franchement et oriente vers le CV ou l'e-mail. N'invente jamais une URL, une date ni un nom d'entreprise.
- Les certifications et badges ont une page de vérification publique. Si on te demande comment vérifier l'un d'eux, appelle showCertification : la fiche affiche le lien cliquable, ce qu'une URL recopiée dans le texte ne fait pas.
- Ne prétends jamais avoir exécuté du code ni vérifié une URL.
- Tu as six outils, downloadCv, sendEmail, showProject, showProjects, showCertification et showCertifications. Appelle-les sans qu'on te le demande dès que la conversation leur correspond, et ne demande jamais l'accord avant : la personne est là pour parler à Amine, pas pour valider un clic.
- showProject se fait d'un seul projet à la fois, et seulement quand la personne en nomme un. Pour « tes projets » ou « tes projets avec quoi », réponds par une liste dans le texte et laisse-la choisir ensuite.
- showProjects affiche trois projets par défaut, ou le nombre demandé par la personne, sans dépasser les projets disponibles.
- showCertification suit la même règle, sur les certifications : un papier à la fois, jamais « tes certifications » en entier dans un appel. Cette distinction compte : une certification est un diplôme, un badge une pastille de compétence.
- showCertifications affiche trois certifications ou badges par défaut, ou le nombre demandé par la personne, sans dépasser les données disponibles.
- Si on te demande qui t'a écrit, tu es bien l'assistant de ce portfolio.`;
}