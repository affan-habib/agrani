import type { Metadata } from "next";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { CaseStudiesContent } from "./case-studies-content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await publicApi.getCaseStudies({ per_page: 1 });
    const content = response.page_content;
    const hero = content?.hero;
    const title = hero?.title ? `${hero.title} | Case Studies` : "Case Studies | Agrani Technologies";
    const description = hero?.description || "Explore how Agrani helps organizations scale and digitally transform.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    };
  } catch {
    return {
      title: "Case Studies | Agrani Technologies",
      description: "Explore how Agrani helps organizations scale and digitally transform.",
    };
  }
}

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
