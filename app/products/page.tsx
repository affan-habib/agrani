import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { ProductsContent } from "./products-content";

export default async function ProductsRoute() {
  const data = await publicApi.getProductServices();
  return <ThemePage active="Product and Services" quote={data.quote} siteSettings={data.site_settings}><ProductsContent data={data} /></ThemePage>;
}
