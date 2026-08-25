import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { CaseStudiesContent } from "./case-studies-content";

export default async function CaseStudiesRoute({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const requestedPage = (await searchParams).page;
  const page = typeof requestedPage === "string" ? Number(requestedPage) || 1 : 1;
  const response = await publicApi.getCaseStudies({ page });
  return (
    <ThemePage active="Others" quote={response.page_content?.quote} siteSettings={response.page_content?.site_settings}>
      <CaseStudiesContent studies={response.data} pageContent={response.page_content} />
    </ThemePage>
  );
}
