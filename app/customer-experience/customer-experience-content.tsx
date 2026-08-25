"use client";

import { motion } from "framer-motion";
import { ContentImage, EmptyContent } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { CustomerExperiencePageData } from "@/types/public";

export function CustomerExperienceContent({ data }: { data: CustomerExperiencePageData }) {
  return (
    <>
      <PageIntro label={data.hero.eyebrow || ""} title={data.hero.title || ""} copy={data.hero.description || undefined} />
      <section className="testimonials container">
        {data.testimonials.length ? data.testimonials.map((item, index) => (
          <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} key={`${item.customer_name}-${index}`}>
            <div>
              <ContentImage className="avatar" media={item.avatar} width={36} height={36} alt={item.customer_name} />
              <strong>{item.customer_name}</strong>
              <b>{"★".repeat(Math.max(0, Math.min(5, item.rating || 0)))}</b>
            </div>
            <p>{item.testimonial}</p>
            <small>{item.customer_role}{item.department && <i>{item.department}</i>}{!item.department && item.company && <i>{item.company}</i>}</small>
          </motion.article>
        )) : <EmptyContent message="Customer testimonials are not available from the API." />}
      </section>
    </>
  );
}
