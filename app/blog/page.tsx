import { BlogGrid, type BlogCategory } from "@/components/pages/inner-pages";
import { ThemePage } from "@/components/site-chrome";

const validCategories = new Set<BlogCategory>([
  "it-trends",
  "ai-automation",
  "cybersecurity",
  "digital-transformation",
  "industry-practices",
]);

export default async function BlogRoute({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const requestedCategory = (await searchParams).category;
  const initialCategory = typeof requestedCategory === "string" && validCategories.has(requestedCategory as BlogCategory)
    ? requestedCategory as BlogCategory
    : "it-trends";

  return <ThemePage active="Others"><BlogGrid initialCategory={initialCategory} /></ThemePage>;
}
