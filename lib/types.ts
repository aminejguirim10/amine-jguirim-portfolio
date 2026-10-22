export type ProjectStatus = "shipped" | "building" | "archived";

export type Project = {
  slug: string;
  name: string;
  kicker: string;
  year: string;
  role: string;
  status: ProjectStatus;
  repo: string;
  repoExtra?: string[];
  live?: string;
  stack: string[];
  lede: string;
  useCase?: string;
  highlights?: string[];
  body: string[];
};

export type ProjectSummary = {
  slug: string;
  name: string;
  kicker: string;
  year: string;
  url: string;
  live?: string;
  stack: string[];
};

export type StackIcon =
  "braces" | "monitor" | "server" | "brain" | "database" | "container";

export type StackGroup = {
  category: string;
  items: string[];
  icon: StackIcon;
};

export type GitHubStats = {
  publicRepos: number;
  fetchedAt: string;
};
