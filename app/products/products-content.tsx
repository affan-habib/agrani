"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EmptyContent } from "@/components/public-content";
import { GradientButton, PageIntro } from "@/components/site-chrome";
import type { ProductServicesPageData } from "@/types/public";

export function ProductsContent({ data }: { data: ProductServicesPageData }) {
  const [open, setOpen] = useState<number | null>(data.products.length ? 0 : null);
  return (
    <>
      <PageIntro label={data.page.eyebrow || ""} title={data.page.title || ""} copy={data.page.description || undefined} />
      <section className="catalog container">
        <div className="tab-row">
          <Link href="/services">{data.page.tabs?.services}</Link>
          <Link className="active" href="/products">{data.page.tabs?.products}</Link>
        </div>
        {data.page.products_introduction && <p className="catalog-intro-p">{data.page.products_introduction}</p>}
        <div className="catalog-list">
          {data.products.length ? data.products.map((product, index) => {
            const isOpen = open === index;
            const features = Array.isArray(product.features)
              ? product.features.map((feature) => typeof feature === "string" ? feature : feature.title || feature.name || feature.description || "").filter(Boolean)
              : [];
            return (
              <motion.article initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={isOpen ? "open" : ""} key={product.slug}>
                <button type="button" onClick={() => setOpen(isOpen ? null : index)}><span>{String.fromCharCode(65 + index)}</span><strong>{product.title}</strong><span className="accordion-indicator">{isOpen ? "−" : "+"}</span></button>
                <AnimatePresence>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="catalog-details">
                  {(product.full_description || product.short_description) && <p>{product.full_description || product.short_description}</p>}
                  {features.length > 0 && <div className="details-tags">{features.map((feature) => <span key={feature}>◉ {feature}</span>)}</div>}
                  {data.page.service_cta?.text && <GradientButton href={data.page.service_cta.url || "/contact"}>{data.page.service_cta.text}</GradientButton>}
                </motion.div>}</AnimatePresence>
              </motion.article>
            );
          }) : <EmptyContent message="No products are currently published by the API." />}
        </div>
      </section>
    </>
  );
}
