import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { CareerContent } from "./career-content";

export default async function CareerRoute() {
  const data = await publicApi.getCareersPage();
  return <ThemePage active="Career" quote={data.quote} siteSettings={data.site_settings}><CareerContent data={data} /></ThemePage>;
}
