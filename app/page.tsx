import { Certifications } from "@/components/certifications";
import { Contact, Footer } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Masthead } from "@/components/masthead";
import { Parcours } from "@/components/parcours";
import { Scope } from "@/components/scope";
import { StackCards } from "@/components/stack-cards";
import { WorkIndex } from "@/components/work-index";
import { getGitHubStats } from "@/lib/github";

export default async function Home() {
  const stats = await getGitHubStats();
  const year = Number(stats.fetchedAt.slice(0, 4));

  return (
    <>
      <Masthead />
      <main>
        <Hero />
        <Scope />
        <Parcours />
        <WorkIndex reposCount={stats.publicRepos} />
        <Certifications />
        <StackCards />
        <Contact />
      </main>
      <Footer year={year} />
    </>
  );
}