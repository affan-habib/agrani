import { notFound } from "next/navigation";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { BlogDetailsContent } from "./blog-details-content";

export default async function BlogDetailsRoute({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const requestedSlug = (await searchParams).slug;
  if (typeof requestedSlug !== "string" || !requestedSlug) notFound();
  const [post, listing] = await Promise.all([publicApi.getBlogPostBySlug(requestedSlug), publicApi.getBlogPosts({ per_page: 1 })]);
  const settings = listing.page_content?.site_settings;
  return <ThemePage active="Others" quote={listing.page_content?.quote} siteSettings={settings}><BlogDetailsContent post={post} pageContent={listing.page_content} settings={settings} /></ThemePage>;
}
