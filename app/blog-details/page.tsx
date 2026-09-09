import { redirect, notFound } from "next/navigation";

export default async function BlogDetailsRoute({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const requestedSlug = (await searchParams).slug;
  if (typeof requestedSlug === "string" && requestedSlug) {
    redirect(`/blog/${encodeURIComponent(requestedSlug)}`);
  }
  notFound();
}
