import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { ServicesContent } from "./services-content";

export default async function ServicesRoute() {
  const data = await publicApi.getProductServices();
  return <ThemePage active="Product and Services" quote={data.quote} siteSettings={data.site_settings}><ServicesContent data={data} /></ThemePage>;
}
