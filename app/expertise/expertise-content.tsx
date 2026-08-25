"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContentImage, EmptyContent, isApiArray } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { ExpertisePageData, PublicMedia } from "@/types/public";

interface ExpertiseEntry {
  title?: string;
  name?: string;
  description?: string;
  short_description?: string;
  icon?: PublicMedia;
  stack?: string;
  technologies?: string[];
  tags?: string[];
  items?: string[];
  points?: string[];
  features?: string[];
}

export function ExpertiseContent({ data }: { data: ExpertisePageData }) {
  const [openCapability, setOpenCapability] = useState(0);
  const roles = isApiArray<ExpertiseEntry>(data.roles) ? data.roles : [];
  const technologies = isApiArray<ExpertiseEntry>(data.technology_categories) ? data.technology_categories : [];
  const capabilities = isApiArray<ExpertiseEntry>(data.company_capabilities) ? data.company_capabilities : [];

  return (
    <>
      <PageIntro label={data.page.eyebrow || ""} title={data.page.title || ""} copy={data.page.description || undefined} />
      <section className="expertise container">
        <h2>{data.sections?.technical_team?.title}</h2>
        {data.sections?.technical_team?.description && <p>{data.sections.technical_team.description}</p>}
        {roles.length ? <div className="feature-grid">{roles.map((role, index) => (
          <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} key={`${role.title || role.name}-${index}`}>
            <div className="round-icon"><ContentImage media={role.icon} width={32} height={32} alt="" decorativeFallback={`/assets/figma/light/raw-${String((index % 4) + 1).padStart(2, "0")}.png`} /></div>
            <h3>{role.title || role.name}</h3>
            {(role.description || role.short_description) && <p>{role.description || role.short_description}</p>}
            {role.stack && <small>{role.stack}</small>}
          </motion.article>
        ))}</div> : <EmptyContent message="Technical team data is malformed in the API response and cannot be displayed." />}

        <h2>{data.sections?.technological_expertise?.title}</h2>
        {data.sections?.technological_expertise?.description && <p>{data.sections.technological_expertise.description}</p>}
        {technologies.length ? <div className="technology-grid">{technologies.map((category, index) => {
          const tags = category.technologies || category.tags || category.items || [];
          return <motion.article whileHover={{ y: -3 }} key={`${category.title || category.name}-${index}`}><h3>{category.title || category.name}</h3><div>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></motion.article>;
        })}</div> : <EmptyContent message="Technology categories are malformed in the API response and cannot be displayed." />}

        <div className="csr">
          <h2>{data.sections?.company_capabilities?.title}</h2>
          {data.sections?.company_capabilities?.description && <p>{data.sections.company_capabilities.description}</p>}
          {capabilities.length ? <div>{capabilities.map((capability, index) => {
            const points = capability.points || capability.features || capability.items || [];
            return <div className={`csr-item ${openCapability === index ? "open" : ""}`} key={`${capability.title || capability.name}-${index}`}><motion.button whileHover={{ x: 4 }} type="button" aria-expanded={openCapability === index} onClick={() => setOpenCapability(openCapability === index ? -1 : index)}>{capability.title || capability.name}<span>⌄</span></motion.button>{openCapability === index && <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul>}</div>;
          })}</div> : <EmptyContent message="Company capabilities are malformed in the API response and cannot be displayed." />}
        </div>
      </section>
    </>
  );
}
