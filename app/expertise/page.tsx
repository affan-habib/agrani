import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { ExpertiseContent } from "./expertise-content";

export default async function ExpertiseRoute() {
  const [data, home] = await Promise.all([publicApi.getExpertise(), publicApi.getHome()]);
  const settings = data.site_settings && "contact" in data.site_settings ? data.site_settings : home.site_settings;
  return <ThemePage active="Others" quote={data.quote} siteSettings={settings}><ExpertiseContent data={data} /></ThemePage>;
}
