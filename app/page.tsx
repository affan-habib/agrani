import { publicApi } from "@/lib/public-api/services";
import { HomeContent } from "./home-content";

export default async function HomePage() {
  const data = await publicApi.getHome();
  return <HomeContent data={data} />;
}
