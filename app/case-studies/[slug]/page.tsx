import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { PublicApiError } from "@/lib/public-api/client";
import { CaseStudyContent } from "@/app/case-study-details/case-study-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const study = await publicApi.getCaseStudyBySlug(slug);
    const title = study.title ? `${study.title} | Case Study` : "Case Study | Agrani Technologies";
    const description = study.short_summary || study.project_statement || (study.title ? `Explore case study: ${study.title}` : "Case study from Agrani Technologies.");
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
      title: "Case Study | Agrani Technologies",
      description: "Case study from Agrani Technologies.",
    };
  }
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  let study;
  try {
    study = await publicApi.getCaseStudyBySlug(slug);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) notFound();
    throw error;
  }

  const listing = await publicApi.getCaseStudies({ per_page: 1 });

  return (
    <ThemePage active="Others" quote={listing.page_content?.quote} siteSettings={listing.page_content?.site_settings}>
      <CaseStudyContent study={study} pageContent={listing.page_content} />
    </ThemePage>
  );
}
