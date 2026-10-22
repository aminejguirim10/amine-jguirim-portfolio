export const identity = {
  firstName: "Amine",
  lastName: "Jguirim",
  fullName: "Amine Jguirim",
  handle: "aminejguirim10",
  role: "Élève ingénieur en IA agentique · Full-Stack · DevOps",
  roleTagline:
    "De l’IA agentique au développement full-stack, jusqu’au DevOps et à l’infrastructure cloud, je donne vie à des systèmes intelligents, conçus de bout en bout.",
  base: "Tunisie",
  baseNote: "Ariana",
  since: "2021",
  email: "mohamedamine.jguirim@enicar.ucar.tn",
  github: "https://github.com/aminejguirim10",
  linkedin: "https://www.linkedin.com/in/mohamed-amine-jguirim/",
  available: true,
  availabilityNote: "Recherche de stage PFE",
} as const;

export const siteUrl = "https://aminejguirim.dev";

export const cv = {
  href: "/Mohamed-Amine-Jguirim-CV.pdf",
  filename: "Mohamed-Amine-Jguirim-CV.pdf",
  label: "Télécharger le CV",
  shortLabel: "CV",
} as const;

export const heroFields = [
  { key: "Rôle", value: identity.role },
  {
    key: "Statut",
    value: identity.availabilityNote,
    signal: true,
  },
] as const;

export const nav = [
  { href: "#scope", label: "Scope" },
  { href: "#parcours", label: "Parcours" },
  { href: "#work", label: "Work" },
  { href: "#certifications", label: "Certs" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
] as const;
