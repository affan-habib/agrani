import { redirect, notFound } from "next/navigation";

export default async function CaseStudyDetailsRoute({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const requestedSlug = (await searchParams).slug;
  if (typeof requestedSlug === "string" && requestedSlug) {
    redirect(`/case-studies/${encodeURIComponent(requestedSlug)}`);
  }
  notFound();
}
