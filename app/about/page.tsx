import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { AboutContent, type AboutTab } from "./about-content";

const validTabs = new Set<AboutTab>(["mission", "vision", "values"]);

export default async function AboutRoute({ searchParams }: { searchParams: Promise<{ tab?: string | string[] }> }) {
  const requestedTab = (await searchParams).tab;
  const initialTab = typeof requestedTab === "string" && validTabs.has(requestedTab as AboutTab)
    ? requestedTab as AboutTab
    : "mission";
  const data = await publicApi.getAbout();

  return (
    <ThemePage active="About Us" quote={data.quote} siteSettings={data.site_settings}>
      <AboutContent data={data} initialTab={initialTab} />
    </ThemePage>
  );
}
