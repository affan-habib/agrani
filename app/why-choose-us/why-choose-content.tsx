"use client";

import { motion } from "framer-motion";
import { ContentImage, EmptyContent } from "@/components/public-content";
import { GradientButton, PageIntro } from "@/components/site-chrome";
import type { HomePageData, WhyChooseItem } from "@/types/public";

export function WhyChooseContent({ items, section }: { items: WhyChooseItem[]; section: HomePageData["sections"]["why_choose_us"] }) {
  return (
    <>
      <PageIntro label={section?.eyebrow || ""} title={section?.title || ""} />
      <section className={`why-cards container why-count-${items.length}`}>
        {items.length ? items.map((item, index) => (
          <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} className={item.cta ? "accent" : ""} key={`${item.title}-${index}`}>
            <div className="round-icon"><ContentImage media={item.icon} width={30} height={30} alt="" decorativeFallback="/assets/figma/light/raw-01.png" /></div>
            <h2>{item.metric?.value}{item.metric?.suffix} {item.title}</h2>
            {item.description && <p>{item.description}</p>}
            {item.cta?.text && <GradientButton href={item.cta.url || "/contact"}>{item.cta.text}</GradientButton>}
          </motion.article>
        )) : <EmptyContent message="Why choose us content is not available from the API." />}
      </section>
      {section?.cta?.text && <div className="container center-heading"><GradientButton href={section.cta.url || "/contact"}>{section.cta.text}</GradientButton></div>}
    </>
  );
}
