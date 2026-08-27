"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EmptyContent } from "@/components/public-content";
import { GradientButton, PageIntro } from "@/components/site-chrome";
import type { ProductServicesPageData } from "@/types/public";

function featureLabel(feature: string | { title?: string; name?: string; description?: string }) {
  return typeof feature === "string" ? feature : feature.title || feature.name || feature.description || "";
}

export function ProductsContent({ data }: { data: ProductServicesPageData }) {
  const [open, setOpen] = useState<number | null>(data.products.length ? 0 : null);
  return (
    <>
      <PageIntro label={data.page.eyebrow || ""} title={data.page.title || ""} copy={data.page.description || undefined} />
      <section className="catalog container">
        <div className="tab-row">
          <Link href="/services">{data.page.tabs?.services || "Services"}</Link>
          <Link className="active" href="/products">{data.page.tabs?.products || "Products"}</Link>
        </div>
        {data.page.products_introduction && <p className="catalog-intro-p">{data.page.products_introduction}</p>}
        <div className="catalog-list">
          {data.products.length ? data.products.map((product, index) => {
            const isOpen = open === index;
            const features = Array.isArray(product.features)
              ? product.features.map(featureLabel).filter(Boolean)
              : [];
            return (
              <motion.article initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={isOpen ? "open" : ""} key={product.slug}>
                <button type="button" onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen}>
                  <span className="catalog-badge">{String.fromCharCode(65 + (index % 26))}</span>
                  <strong className="catalog-title">{product.title}</strong>
                  <span className="catalog-indicator">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}>
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="catalog-details">
                      {(product.full_description || product.short_description) && <p className="catalog-description">{product.full_description || product.short_description}</p>}
                      {features.length > 0 && (
                        <div className="details-tags">
                          {features.map((feature) => (
                            <div className="details-tag-item" key={feature}>
                              <span className="tag-check-icon">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {data.page.service_cta?.text && (
                        <div className="catalog-cta-wrap">
                          <Link href={data.page.service_cta.url || "/contact"} className="catalog-cta-btn">
                            {data.page.service_cta.text}
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          }) : <EmptyContent message="No products are currently published by the API." />}
        </div>
      </section>
    </>
  );
}
