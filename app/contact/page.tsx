import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { ContactContent } from "./contact-content";

export default async function ContactRoute() {
  const [data, home] = await Promise.all([publicApi.getContactPage(), publicApi.getHome()]);
  return <ThemePage active="Contact Us" quote={data.quote} siteSettings={home.site_settings}><ContactContent data={data} /></ThemePage>;
}
