export type CredentialKind = "certification" | "badge";

export type Credential = {
  id: string;
  kind: CredentialKind;
  icon: "award" | "medal";
  title: string;
  issuer: string;
  code?: string;
  summary: string;
  url?: string;
};

export const credentials: readonly Credential[] = [
  {
    id: "ccna-introduction",
    kind: "certification",
    icon: "award",
    title: "Introduction to Networks",
    issuer: "Cisco Networking Academy",
    url: "https://www.credly.com/earner/earned/badge/076472e5-6457-44d2-afbc-67fc6269a28f",
    summary:
      "Maîtrise des bases réseau : modèle OSI et TCP/IP, adressage IPv4/IPv6, sous-réseaux, VLAN et protocoles essentiels pour concevoir et maintenir un réseau local fiable.",
  },
  {
    id: "ccna-routing",
    kind: "certification",
    icon: "award",
    title: "Switching, Routing, and Wireless Essentials",
    issuer: "Cisco Networking Academy",
    url: "https://www.credly.com/earner/earned/badge/dcac4269-c989-40af-966c-98791d65d3c0",
    summary:
      "Maîtrise de la commutation et du routage : tables de routage, OSPF, NAT, VLAN, réseaux sans fil et diagnostic des pannes sur infrastructure Cisco.",
  },
  {
    id: "aws-cloud-basics",
    kind: "badge",
    icon: "medal",
    title: "Cloud Foundations",
    issuer: "Amazon Web Services",
    url: "https://www.credly.com/earner/earned/badge/83fde705-1295-4678-8f41-25eb53277f50",
    summary:
      "Compréhension des fondamentaux AWS : régions, zones de disponibilité, services cloud, gestion des identités, sécurité, responsabilité partagée et maîtrise des coûts selon l'usage professionnel.",
  },
];

export function getCredential(id: string) {
  return credentials.find((credential) => credential.id === id);
}
