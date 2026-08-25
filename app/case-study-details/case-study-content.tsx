"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ContentImage, EmptyContent } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { CaseStudy, ContentBlock, ListingPageContent, PublicMedia } from "@/types/public";

function CaseBlock({ block }: { block: ContentBlock }) {
  const payload = block.payload || {};
  if (block.type === "heading" && typeof payload.text === "string") return <section className="case-block-heading container"><h2>{payload.text}</h2></section>;
  if (block.type === "rich_text" && Array.isArray(payload.paragraphs)) return <section className="case-rich-text container">{payload.paragraphs.filter((text): text is string => typeof text === "string").map((text, index) => <p key={index}>{text}</p>)}</section>;
  if (block.type === "image" && payload.media && typeof payload.media === "object") return <section className="case-content-image container"><ContentImage media={payload.media as PublicMedia} fill sizes="1240px" alt={typeof payload.alt_text === "string" ? payload.alt_text : ""} /></section>;
  if (block.type === "problem_solution") {
    const solutions = Array.isArray(payload.solutions) ? payload.solutions.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object") : [];
    return <section className="case-story container"><div className="case-lead"><h2>{typeof payload.problem_heading === "string" ? payload.problem_heading : ""}</h2>{typeof payload.problem_body === "string" && <p>{payload.problem_body}</p>}</div><div className="problem-flow">{solutions.map((solution, index) => <motion.article whileHover={{ y: -4 }} key={index}><b>{typeof solution.title === "string" ? solution.title : ""}</b><p>{typeof solution.body === "string" ? solution.body : ""}</p></motion.article>)}</div></section>;
  }
  if (block.type === "stat_group") {
    const items = Array.isArray(payload.items) ? payload.items.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object") : [];
    return <section className="research-section"><div className="container"><div className="research-stats">{items.map((item, index) => <article key={index}><strong>{typeof item.value === "string" ? item.value : ""}</strong><span>{typeof item.description === "string" ? item.description : typeof item.label === "string" ? item.label : ""}</span></article>)}</div></div></section>;
  }
  if (block.type === "gallery") {
    const media = Array.isArray(payload.media) ? payload.media.filter((item): item is PublicMedia => Boolean(item) && typeof item === "object") : [];
    return <section className="case-showcase-grid container">{media.map((item, index) => <article key={item.uuid || index}><div><ContentImage media={item} fill sizes="420px" alt={item.alt_text || ""} /></div></article>)}</section>;
  }
  if (block.type === "quote" && typeof payload.text === "string") return <blockquote className="case-api-quote container">{payload.text}</blockquote>;
  if (block.type === "callout") return <section className="thanks-block container"><h2>{typeof payload.heading === "string" ? payload.heading : ""}</h2>{typeof payload.body === "string" && <p>{payload.body}</p>}</section>;
  return null;
}

export function CaseStudyContent({ study, pageContent }: { study: CaseStudy; pageContent?: ListingPageContent }) {
  const blocks = [...(study.content || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  return (
    <>
      <PageIntro label={pageContent?.detail?.eyebrow || ""} title={study.title} copy={study.project_statement || study.short_summary || undefined} />
      <section className="case-overview container" aria-label="Project preview"><div className="case-device-frame"><ContentImage media={study.featured_media} fill sizes="(max-width: 768px) 90vw, 760px" alt={study.title} priority /></div>{study.short_summary && <p>{study.short_summary}</p>}</section>
      {blocks.length ? blocks.map((block, index) => <CaseBlock block={block} key={`${block.type}-${index}`} />) : <EmptyContent message="This case study has no published content blocks." />}
      {study.related_case_studies && study.related_case_studies.length > 0 && <section className="similar container"><div className="blog-grid compact">{study.related_case_studies.map((related) => <Link className="blog-card" href={`/case-study-details?slug=${related.slug}`} key={related.slug}><div className="blog-img-wrap"><ContentImage media={related.featured_media} fill sizes="590px" alt={related.title} /></div><h3>{related.title}</h3></Link>)}</div></section>}
    </>
  );
}
