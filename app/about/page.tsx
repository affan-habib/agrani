import type { Metadata } from "next";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { AboutContent, type AboutTab } from "./about-content";

const validTabs = new Set<AboutTab>(["mission", "vision", "values"]);

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await publicApi.getAbout();
    const title = data.overview?.title ? `${data.overview.title} | About Us` : "About Us | Agrani Technologies";
    const description = data.overview?.description || data.overview?.introduction || "Learn more about Agrani Technologies & Services Limited.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    };
  } catch {
    return {
      title: "About Us | Agrani Technologies",
      description: "Learn more about Agrani Technologies & Services Limited.",
    };
  }
}

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
