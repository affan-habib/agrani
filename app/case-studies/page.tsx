import { BlogGrid } from "@/components/pages/inner-pages";
import { ThemePage } from "@/components/site-chrome";

export default function CaseStudiesRoute() {
  return <ThemePage active="Others"><BlogGrid cases /></ThemePage>;
}
