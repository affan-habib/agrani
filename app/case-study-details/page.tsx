import { notFound } from "next/navigation";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { CaseStudyContent } from "./case-study-content";

export default async function CaseStudyDetailsRoute({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const requestedSlug = (await searchParams).slug;
  if (typeof requestedSlug !== "string" || !requestedSlug) notFound();
  const [study, listing] = await Promise.all([publicApi.getCaseStudyBySlug(requestedSlug), publicApi.getCaseStudies({ per_page: 1 })]);
  return <ThemePage active="Others" quote={listing.page_content?.quote} siteSettings={listing.page_content?.site_settings}><CaseStudyContent study={study} pageContent={listing.page_content} /></ThemePage>;
}
