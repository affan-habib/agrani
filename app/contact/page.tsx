import type { Metadata } from "next";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { ContactContent } from "./contact-content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await publicApi.getContactPage();
    const title = data.page?.title ? `${data.page.title} | Contact Us` : "Contact Us | Agrani Technologies";
    const description = data.page?.introduction || data.page?.description || "Get in touch with Agrani Technologies.";
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
      title: "Contact Us | Agrani Technologies",
      description: "Get in touch with Agrani Technologies.",
    };
  }
}

export default async function ContactRoute() {
  const [data, home] = await Promise.all([publicApi.getContactPage(), publicApi.getHome()]);
  return (
    <ThemePage active="Contact Us" quote={data.quote} siteSettings={home.site_settings}>
      <ContactContent data={data} />
    </ThemePage>
  );
}
