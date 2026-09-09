import type { Metadata } from "next";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { CareerContent } from "./career-content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await publicApi.getCareersPage();
    const title = data.hero?.title ? `${data.hero.title} | Careers` : "Careers | Agrani Technologies";
    const description = data.hero?.description || "Join Agrani Technologies and build resilient digital architectures.";
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
      title: "Careers | Agrani Technologies",
      description: "Join Agrani Technologies and build resilient digital architectures.",
    };
  }
}

export default async function CareerRoute() {
  const data = await publicApi.getCareersPage();
  return (
    <ThemePage active="Career" quote={data.quote} siteSettings={data.site_settings}>
      <CareerContent data={data} />
    </ThemePage>
  );
}
