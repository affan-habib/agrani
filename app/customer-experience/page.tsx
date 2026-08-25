import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { CustomerExperienceContent } from "./customer-experience-content";

export default async function CustomerExperienceRoute() {
  const data = await publicApi.getCustomerExperience();
  return <ThemePage active="Others" quote={data.quote} siteSettings={data.site_settings}><CustomerExperienceContent data={data} /></ThemePage>;
}
