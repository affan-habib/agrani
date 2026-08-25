import { notFound } from "next/navigation";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { PublicApiError } from "@/lib/public-api/client";
import { BlogDetailsContent } from "./blog-details-content";

export default async function BlogDetailsRoute({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const requestedSlug = (await searchParams).slug;
  if (typeof requestedSlug !== "string" || !requestedSlug) notFound();
  let post;
  try {
    post = await publicApi.getBlogPostBySlug(requestedSlug);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) notFound();
    throw error;
  }
  const listing = await publicApi.getBlogPosts({ per_page: 1 });
  const settings = listing.page_content?.site_settings;
  return <ThemePage active="Others" quote={listing.page_content?.quote} siteSettings={settings}><BlogDetailsContent post={post} pageContent={listing.page_content} settings={settings} /></ThemePage>;
}
