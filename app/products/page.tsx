import { CatalogPage } from "@/components/pages/inner-pages";
import { ThemePage } from "@/components/site-chrome";

export default function ProductsRoute() {
  return <ThemePage active="Product and Services"><CatalogPage products /></ThemePage>;
}
