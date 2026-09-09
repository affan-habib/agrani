import type { Metadata } from "next";
import { ThemePage } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { BlogContent } from "./blog-content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await publicApi.getBlogPosts({ per_page: 1 });
    const content = response.page_content;
    const hero = content?.hero;
    const title = hero?.title ? `${hero.title} | Blog` : "Insights & News | Agrani Technologies";
    const description = hero?.description || "Read our latest articles on technology, cloud, and engineering.";
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
      description: "Read our latest articles on technology, cloud, and engineering.",
    };
  }
}

export default async function BlogRoute({ searchParams }: { searchParams: Promise<{ category?: string | string[]; page?: string | string[] }> }) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? Number(params.page) || 1 : 1;
  const [response, categories] = await Promise.all([publicApi.getBlogPosts({ page }), publicApi.getBlogCategories()]);
  const requested = typeof params.category === "string" ? params.category : undefined;
  const activeCategory = categories.some((category) => category.slug === requested) ? requested : categories[0]?.slug;

  return (
    <ThemePage active="Others" quote={response.page_content?.quote} siteSettings={response.page_content?.site_settings}>
      <BlogContent posts={response.data} categories={categories} pageContent={response.page_content} meta={response.meta} activeCategory={activeCategory} />
    </ThemePage>
  );
}
