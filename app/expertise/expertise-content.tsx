"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContentImage, EmptyContent, isApiArray } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { ExpertisePageData, PublicMedia } from "@/types/public";

interface ExpertiseEntry {
  title?: unknown;
  name?: unknown;
  description?: unknown;
  short_description?: unknown;
  icon?: PublicMedia;
  stack?: unknown;
  technologies?: unknown;
  tags?: unknown;
  items?: unknown;
  points?: unknown;
  features?: unknown;
}

function apiText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object" && "name" in value) return apiText((value as { name?: unknown }).name);
  return "";
}

function apiTextList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(apiText).filter(Boolean) : [];
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
            <h3>{apiText(role.title) || apiText(role.name)}</h3>
            {(apiText(role.description) || apiText(role.short_description)) && <p>{apiText(role.description) || apiText(role.short_description)}</p>}
            {apiText(role.stack) && <small>{apiText(role.stack)}</small>}
          </motion.article>
        ))}</div> : <EmptyContent message="Technical team data is malformed in the API response and cannot be displayed." />}

        <h2>{data.sections?.technological_expertise?.title}</h2>
        {data.sections?.technological_expertise?.description && <p>{data.sections.technological_expertise.description}</p>}
        {technologies.length ? <div className="technology-grid">{technologies.map((category, index) => {
          const tags = apiTextList(category.technologies || category.tags || category.items);
          return <motion.article whileHover={{ y: -3 }} key={`${apiText(category.title) || apiText(category.name)}-${index}`}><h3>{apiText(category.title) || apiText(category.name)}</h3><div>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></motion.article>;
        })}</div> : <EmptyContent message="Technology categories are malformed in the API response and cannot be displayed." />}

        <div className="csr">
          <h2>{data.sections?.company_capabilities?.title}</h2>
          {data.sections?.company_capabilities?.description && <p>{data.sections.company_capabilities.description}</p>}
          {capabilities.length ? <div>{capabilities.map((capability, index) => {
            const points = apiTextList(capability.points || capability.features || capability.items);
            const title = apiText(capability.title) || apiText(capability.name);
            return <div className={`csr-item ${openCapability === index ? "open" : ""}`} key={`${title}-${index}`}><motion.button whileHover={{ x: 4 }} type="button" aria-expanded={openCapability === index} onClick={() => setOpenCapability(openCapability === index ? -1 : index)}>{title}<span>⌄</span></motion.button>{openCapability === index && <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul>}</div>;
          })}</div> : <EmptyContent message="Company capabilities are malformed in the API response and cannot be displayed." />}
        </div>
      </section>
    </>
  );
}
