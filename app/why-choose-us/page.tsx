import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { WhyChooseContent } from "./why-choose-content";

export default async function WhyChooseUsRoute() {
  const [items, home] = await Promise.all([publicApi.getWhyChooseUs(), publicApi.getHome()]);
  return <ThemePage active="Others" quote={home.sections.quote} siteSettings={home.site_settings}><WhyChooseContent items={items} section={home.sections.why_choose_us} /></ThemePage>;
}
