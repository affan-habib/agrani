"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/theme";
import { ContactBlock, GradientButton, Pill, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ContentImage, EmptyContent } from "@/components/public-content";
import type { HomePageData, ServiceSummary } from "@/types/public";

const premiumEase = [0.16, 1, 0.3, 1] as const;

function Hero({ data }: { data: HomePageData["hero"] }) {
  const [dimensions, setDimensions] = useState({ width: 1240, height: 600 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const update = () => heroRef.current && setDimensions({ width: heroRef.current.offsetWidth, height: heroRef.current.offsetHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const { width: width, height } = dimensions;
  const mobile = width <= 768;
  const notchWidth = Math.min(380, width * 0.42);
  const notchX = width - notchWidth;
  const shelfY = 56;
  const radius = 32;
  const corner = 28;
  const clipPath = mobile
    ? `M ${radius} 0 H ${width - radius} A ${radius} ${radius} 0 0 1 ${width} ${radius} V ${height - radius} A ${radius} ${radius} 0 0 1 ${width - radius} ${height} H ${radius} A ${radius} ${radius} 0 0 1 0 ${height - radius} V ${radius} A ${radius} ${radius} 0 0 1 ${radius} 0 Z`
    : `M ${radius} 0 H ${notchX} A ${corner} ${corner} 0 0 1 ${notchX + corner} ${corner} A ${corner} ${corner} 0 0 0 ${notchX + corner * 2} ${shelfY} H ${width - radius} A ${radius} ${radius} 0 0 1 ${width} ${shelfY + radius} V ${height - radius} A ${radius} ${radius} 0 0 1 ${width - radius} ${height} H ${radius} A ${radius} ${radius} 0 0 1 0 ${height - radius} V ${radius} A ${radius} ${radius} 0 0 1 ${radius} 0 Z`;

  return (
    <div className="hero-outer-container container" id="top">
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}><defs><clipPath id="hero-cutout-clip" clipPathUnits="userSpaceOnUse"><path d={clipPath} /></clipPath></defs></svg>
      {!mobile && data.steps && data.steps.length > 0 && <div className="hero-floating-pill">{data.steps.map((step) => <span key={step.label}>{step.label}</span>)}</div>}
      <section className="hero" ref={heroRef} style={{ clipPath: "url(#hero-cutout-clip)" }}>
        <ContentImage media={data.media} fill sizes="(max-width: 900px) 100vw, 1240px" alt={data.media?.alt_text || data.title || ""} className="hero-image" priority decorativeFallback="/assets/figma/light/raw-11.jpeg" />
        <div className="hero-shade" />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: premiumEase }} className="hero-copy">
            {data.review && <div className="rating-badge"><span>{data.review.rating} {data.review.label}</span></div>}
            {data.title && <h1>{data.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: premiumEase }} className="hero-side">
            {data.description && <p style={{ whiteSpace: "pre-line" }}>{data.description}</p>}
            {data.primary_cta?.text && <div className="hero-cta"><Link className="hero-explore-btn" href={data.primary_cta.url || "/services"}>{data.primary_cta.text}</Link><a className="search-button" href="#services" aria-label="Explore our services">⌕</a></div>}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Stats({ data }: { data: HomePageData["statistics"] }) {
  return <section className="stats-section container"><div className="stats">{data.length ? data.map((stat, index) => <motion.div key={stat.key || index} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="stat"><strong>{stat.prefix}{stat.value}{stat.suffix}</strong><span>{stat.label}</span></motion.div>) : <EmptyContent message="Statistics are not available from the API." />}</div></section>;
}

function serviceIcon(service: ServiceSummary, index: number) {
  return service.icon || `/assets/figma/light/raw-0${(index % 4) + 1}.png`;
}

function Services({ data, heading }: { data: HomePageData["services"]; heading: HomePageData["sections"]["services"] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => railRef.current?.scrollBy({ left: direction * 400, behavior: "smooth" });
  return (
    <section className="services-section section-glow" id="services">
      <div className="container service-heading">
        <Pill>{heading?.eyebrow}</Pill>
        <div className="heading-row">
          <h2>{heading?.title}</h2>
          <div className="round-arrows">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous service">‹</button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next service">›</button>
          </div>
        </div>
      </div>
      <div className="service-rail-container container">
        <div className="service-rail" ref={railRef}>
          {data.length ? (
            data.map((service, index) => (
              <article className="service-card" key={service.slug || `service-${index}`}>
                <div className="service-icon">
                  <ContentImage media={serviceIcon(service, index)} width={36} height={36} alt="" />
                </div>
                <h3>{service.title}</h3>
                {service.short_description && <p>{service.short_description}</p>}
              </article>
            ))
          ) : (
            <EmptyContent message="Services are not available from the API." />
          )}
        </div>
      </div>
    </section>
  );
}

function Sectors({ data, heading }: { data: HomePageData["sectors"]; heading: HomePageData["sections"]["sectors"] }) {
  return (
    <section className="sectors-section section-glow" id="about">
      <div className="center-heading container">
        <Pill>{heading?.eyebrow}</Pill>
        <h2 style={{ whiteSpace: "pre-line" }}>{heading?.title}</h2>
      </div>
      <div className="sector-grid container">
        {data.length ? (
          data.map((sector, index) => (
            <article
              className={`sector-card sector-${index + 1}`}
              key={sector.slug || `sector-${index}`}
            >
              <h3>{sector.title}</h3>
              {sector.short_description && <p>{sector.short_description}</p>}
              <div className="sector-placeholder">
                <ContentImage
                  media={sector.featured_image}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  alt={sector.title}
                />
              </div>
            </article>
          ))
        ) : (
          <EmptyContent message="Sectors are not available from the API." />
        )}
      </div>
    </section>
  );
}

function WhyChoose({ data, heading }: { data: HomePageData["why_choose_us"]; heading: HomePageData["sections"]["why_choose_us"] }) {
  const [active, setActive] = useState<number | null>(data.length ? 0 : null);
  return (
    <section className="why-section section-glow" id="why"><motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="why-content">
      <Pill>{heading?.eyebrow}</Pill><h2>{heading?.title}</h2>
      <div className="accordion">{data.length ? data.map((item, index) => { const open = active === index; return <div className={`accordion-item ${open ? "active" : ""}`} key={`${item.title}-${index}`}><button type="button" onClick={() => setActive(open ? null : index)} aria-expanded={open} className="accordion-trigger"><span>{item.title}</span><span className="accordion-arrow">⌄</span></button><AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="accordion-body">{item.description && <p>{item.description}</p>}</motion.div>}</AnimatePresence></div>; }) : <EmptyContent message="Why choose us content is not available from the API." />}</div>
      {heading?.cta?.text && <GradientButton href={heading.cta.url || "/contact"}>{heading.cta.text}</GradientButton>}
    </motion.div></section>
  );
}

export function HomeContent({ data }: { data: HomePageData }) {
  const { dark, toggleTheme } = useTheme();
  return (
    <main className={dark ? "site dark home-site" : "site light home-site"}>
      <SiteHeader dark={dark} toggleTheme={toggleTheme} active="Home" />
      <Hero data={data.hero} />
      <Stats data={data.statistics} />
      <Services data={data.services} heading={data.sections.services} />
      <Sectors data={data.sectors} heading={data.sections.sectors} />
      <WhyChoose data={data.why_choose_us} heading={data.sections.why_choose_us} />
      <ContactBlock quote={data.sections.quote} />
      <SiteFooter settings={data.site_settings} />
    </main>
  );
}
