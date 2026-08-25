import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { ExpertiseContent } from "./expertise-content";

export default async function ExpertiseRoute() {
  const data = await publicApi.getExpertise();
  return <ThemePage active="Others" quote={data.quote} siteSettings={data.site_settings}><ExpertiseContent data={data} /></ThemePage>;
}
