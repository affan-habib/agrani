import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { PublicApiError } from "@/lib/public-api/client";
import { BlogDetailsContent } from "@/app/blog-details/blog-details-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await publicApi.getBlogPostBySlug(slug);
    const title = post.title ? `${post.title} | Blog` : "Blog | Agrani Technologies";
    const description = post.excerpt || (post.title ? `Read ${post.title} on Agrani Technologies.` : "Read article on Agrani Technologies.");
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
      title: "Blog | Agrani Technologies",
      description: "Read article on Agrani Technologies.",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  let post;
  try {
    post = await publicApi.getBlogPostBySlug(slug);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) notFound();
    throw error;
  }

  const listing = await publicApi.getBlogPosts({ per_page: 1 });
  const settings = listing.page_content?.site_settings;

  return (
    <ThemePage active="Others" quote={listing.page_content?.quote} siteSettings={settings}>
      <BlogDetailsContent post={post} pageContent={listing.page_content} settings={settings} />
    </ThemePage>
  );
}
