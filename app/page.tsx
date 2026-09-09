import type { Metadata } from "next";
import { publicApi } from "@/lib/public-api/services";
import { HomeContent } from "./home-content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await publicApi.getHome();
    const site = data.site_settings;
    const title = site?.company?.name
      ? `${site.company.name} | ${site.company.short_description || "Innovative IT Solutions"}`
      : "Agrani Technologies & Services Limited";
    const description =
      site?.company?.description ||
      site?.company?.short_description ||
      "Innovative IT solutions for a smarter Bangladesh.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Agrani Technologies & Services Limited",
      description: "Innovative IT solutions for a smarter Bangladesh.",
    };
  }
}

export default async function HomePage() {
  const data = await publicApi.getHome();
  return <HomeContent data={data} />;
}
