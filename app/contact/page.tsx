import { ContactPage } from "@/components/pages/inner-pages";
import { ThemePage } from "@/components/site-chrome";

export default function ContactRoute() {
  return <ThemePage active="Contact Us"><ContactPage /></ThemePage>;
}
