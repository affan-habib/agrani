"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EmptyContent } from "@/components/public-content";
import { GradientButton, PageIntro } from "@/components/site-chrome";
import type { ProductServicesPageData, ServiceSummary } from "@/types/public";

function featureLabel(feature: string | { title?: string; name?: string; description?: string }) {
  return typeof feature === "string" ? feature : feature.title || feature.name || feature.description || "";
}

export function ServicesContent({ data }: { data: ProductServicesPageData }) {
  const [open, setOpen] = useState<number | null>(data.services.length ? 0 : null);

  return (
    <>
      <PageIntro label={data.page.eyebrow || ""} title={data.page.title || ""} copy={data.page.description || undefined} />
      <section className="catalog container">
        <div className="tab-row">
          <Link className="active" href="/services">{data.page.tabs?.services}</Link>
          <Link href="/products">{data.page.tabs?.products}</Link>
        </div>
        {data.page.services_introduction && <p className="catalog-intro-p">{data.page.services_introduction}</p>}
        <div className="catalog-list">
          {data.services.length ? data.services.map((service, index) => {
            const isOpen = open === index;
            const features = Array.isArray(service.features) ? service.features.map(featureLabel).filter(Boolean) : [];
            return (
              <motion.article initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={isOpen ? "open" : ""} key={service.slug}>
                <button type="button" onClick={() => setOpen(isOpen ? null : index)}>
                  <span>{String.fromCharCode(65 + (index % 26))}</span>
                  <strong>{service.title}</strong>
                  <span className="accordion-indicator">{isOpen ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="catalog-details">
                      {(service.full_description || service.short_description) && <p>{service.full_description || service.short_description}</p>}
                      {features.length > 0 && <div className="details-tags">{features.map((feature) => <span key={feature}>◉ {feature}</span>)}</div>}
                      {data.page.service_cta?.text && <GradientButton href={data.page.service_cta.url || "/contact"}>{data.page.service_cta.text}</GradientButton>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          }) : <EmptyContent message="Services are not available from the API." />}
        </div>
      </section>
    </>
  );
}
