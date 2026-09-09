import type { Metadata } from "next";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { ServicesContent } from "./services-content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await publicApi.getProductServices();
    const title = data.page?.title ? `${data.page.title} | Products & Services` : "Products & Services | Agrani Technologies";
    const description = data.page?.description || data.page?.services_introduction || "Explore Agrani software, cloud, and consulting services.";
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
      title: "Products & Services | Agrani Technologies",
      description: "Explore Agrani software, cloud, and consulting services.",
    };
  }
}

export default async function ServicesRoute() {
  const data = await publicApi.getProductServices();
  return (
    <ThemePage active="Product and Services" quote={data.quote} siteSettings={data.site_settings}>
      <ServicesContent data={data} />
    </ThemePage>
  );
}
