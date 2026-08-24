import { AboutPage, type AboutTab } from "@/components/pages/inner-pages";
import { ThemePage } from "@/components/site-chrome";

const validTabs = new Set<AboutTab>(["mission", "vision", "values"]);

export default async function AboutRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const requestedTab = (await searchParams).tab;
  const initialTab = typeof requestedTab === "string" && validTabs.has(requestedTab as AboutTab)
    ? requestedTab as AboutTab
    : "mission";

  return <ThemePage active="About Us"><AboutPage initialTab={initialTab} /></ThemePage>;
}
