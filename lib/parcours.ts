export type Entry = {
  id: string;
  org: string;
  role: string;
  detail?: string;
  place?: string;
  period: string;
  duration?: string;
  ongoing?: boolean;
  points?: string[];
};

export type Group = {
  title: string;
  total: string;
  icon: "company" | "school";
  entries: Entry[];
};

const stages: Entry[] = [
  {
    id: "proxym",
    org: "Proxym",
    role: "Stagiaire — Développement full-stack & IA",
    place: "Sousse",
    period: "Juillet 2026",
    duration: "1 mois",
    points: [
      "Automatiser la qualification des demandes de support grâce à un LLM intégré avec LangChain et FastAPI, qui découpe des fichiers CSV, PDF, DOCX et TXT en tickets distincts et extrait leur catégorie, leur priorité et leur sentiment.",
      "Développer une architecture multi-services avec une API REST en Spring Boot sécurisée par JWT et contrôle d’accès par rôle, une interface Angular réactive et une base PostgreSQL sur Supabase, avec tableau de bord statistique.",
      "Concevoir un agent conversationnel ReAct à 10 outils avec LangGraph, qui exige une confirmation avant toute action sensible et automatiser le déploiement avec Docker multi-étapes et des pipelines CI/CD sur GitHub Actions.",
    ],
  },
  {
    id: "swconsulting",
    org: "SWConsulting",
    role: "Stagiaire — Développement full-stack",
    place: "Bouhjar, Monastir",
    period: "Juin 2025",
    duration: "1 mois",
    points: [
      "Livrer une plateforme de blog full-stack en arabe avec Next.js 15, TypeScript, Prisma et PostgreSQL, couvrant articles, événements, commentaires et modération avec une interface RTL et un rendu serveur optimisé pour le SEO.",
      "Sécuriser l’application avec une authentification multi-rôles (Admin, Éditeur, Utilisateur) via Clerk et créer des tableaux de bord analytiques avec Recharts pour piloter le contenu et les utilisateurs.",
      "Intégrer un chatbot IA avec le Vercel AI SDK et Groq, capable de rechercher et de résumer les articles et automatiser les notifications par WhatsApp (Twilio) et par e-mail avec Nodemailer.",
    ],
  },
  {
    id: "globale",
    org: "Globale Service Informatique",
    role: "Stagiaire — Développement full-stack & IA",
    place: "Monastir",
    period: "Février — Juin 2024",
    duration: "4 mois",
    points: [
      "Développer une plateforme e-learning collaborative avec Next.js, NextAuth, Prisma et Supabase, avec classes virtuelles, publications, commentaires et partage de fichiers pour étudiants et enseignants.",
      "Concevoir un chatbot RAG avec LangChain et Pinecone pour indexer les cours PDF et répondre aux questions des étudiants par recherche sémantique avec des réponses générées par Groq en streaming.",
      "Implémenter une interface bilingue (français/anglais) avec next-intl et une authentification par code OTP envoyé par e-mail pour une application accessible et sécurisée.",
    ],
  },
];

const formation: Entry[] = [
  {
    id: "enicarthage",
    org: "École Nationale d'Ingénieurs de Carthage",
    role: "Diplôme d'ingénieur en informatique — 3ᵉ année",
    period: "2024 — présent",
    duration: "3ᵉ année",
    ongoing: true,
  },
  {
    id: "isimm",
    org: "Institut Supérieur d'Informatique et de Mathématiques de Monastir",
    role: "Licence en sciences informatiques — Spécialité génie logiciel",
    period: "2021 — 2024",
    duration: "3 ans",
  },
];

export const parcoursGroups: Group[] = [
  { title: "Stages", total: "6 mois", icon: "company", entries: stages },
  { title: "Formation", total: "5 ans", icon: "school", entries: formation },
];

export const associative: Entry[] = [
  {
    id: "melkart",
    org: "MELKART Junior Entreprise",
    role: "Membre du pôle Projet et Prospection",
    place: "ENICarthage",
    period: "Septembre 2024 — Mai 2026",
    detail:
      "Développement d’applications e-commerce full-stack intégrant la gestion des produits, des commandes et des utilisateurs, avec des interfaces intuitives et des tableaux de bord de suivi.",
  },
  {
    id: "mtc",
    org: "Microsoft Tech Club ENICarthage",
    role: "Membre de l'équipe de développement",
    place: "ENICarthage",
    period: "Janvier 2025 — Mai 2026",
    detail:
      "Développement de la plateforme Forum d’Entreprises, automatisant l’inscription des entreprises, la réservation des stands et la gestion des contrats, avec une contribution au développement du site web du club.",
  },
];
