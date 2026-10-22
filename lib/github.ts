import { cacheLife } from "next/cache";
import type { GitHubStats } from "@/lib/types";

const API = "https://api.github.com";
const USER = "aminejguirim10";

const FALLBACK: GitHubStats = {
  publicRepos: 31,
  fetchedAt: "2026-10-21",
};

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "aminejguirim.dev-portfolio",
};

export async function getGitHubStats(): Promise<GitHubStats> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(`${API}/users/${USER}`, { headers });
    if (!res.ok) return FALLBACK;
    const profile = (await res.json()) as { public_repos?: number };

    return {
      publicRepos:
        typeof profile.public_repos === "number"
          ? profile.public_repos
          : FALLBACK.publicRepos,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return FALLBACK;
  }
}
