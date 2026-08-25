"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ContentImage, EmptyContent } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { CaseStudy, ListingPageContent } from "@/types/public";

export function CaseStudiesContent({ studies, pageContent }: { studies: CaseStudy[]; pageContent?: ListingPageContent }) {
  const hero = pageContent?.hero;
  return (
    <>
      <PageIntro label={hero?.eyebrow || ""} title={hero?.title || ""} copy={hero?.description || undefined} />
      <section className="blog-listing container">
        <div className="blog-grid">
          {studies.length ? studies.map((study) => (
            <motion.div key={study.slug} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }}>
              <Link href={`/case-study-details?slug=${study.slug}`} className="blog-card">
                <div className="blog-img-wrap">
                  <ContentImage media={study.featured_media} fill sizes="608px" alt={study.title} className="blog-image-desktop" />
                  <ContentImage media={study.featured_media} fill sizes="100vw" alt="" className="blog-image-mobile" />
                  <div className="blog-image-meta">
                    {study.client && <strong>{study.client}</strong>}
                    {study.publication_date && <span>{new Date(study.publication_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                  </div>
                </div>
                <h2>{study.title}</h2>
                {study.short_summary && <p>{study.short_summary}</p>}
                <span className="read-link">Read Case Study <b>↗</b></span>
              </Link>
            </motion.div>
          )) : <EmptyContent message="No case studies are currently published by the API." />}
        </div>
      </section>
    </>
  );
}
