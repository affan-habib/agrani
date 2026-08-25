"use client";

import { motion } from "framer-motion";
import { EmptyContent } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { Address, ContactPageData } from "@/types/public";

function formatAddress(address?: Address | null) {
  if (!address) return "";
  return [address.line_1, address.line_2, address.city, address.postal_code, address.country].filter(Boolean).join(", ");
}

export function ContactContent({ data }: { data: ContactPageData }) {
  const info = [
    { label: "Address", value: formatAddress(data.office?.address), icon: "⌂" },
    { label: "Phone", value: data.office?.phones?.primary, icon: "☎" },
    { label: "Email", value: data.office?.emails?.primary, icon: "✉" },
    { label: "Website", value: data.office?.website_url, icon: "⊕" },
  ].filter((item) => item.value);

  return (
    <>
      <PageIntro label={data.page.eyebrow || ""} title={data.page.title || ""} copy={data.page.introduction || data.page.description || undefined} />
      <motion.section initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="map container" style={{ position: "relative", minHeight: 380, overflow: "hidden", borderRadius: 16 }}>
        {data.map?.embed_url ? <iframe src={data.map.embed_url} width="100%" height="100%" style={{ border: 0, minHeight: 380, width: "100%", borderRadius: 16 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Office Location Map" /> : <EmptyContent message="The office map is not available from the API." />}
      </motion.section>
      <section className="info-grid container">
        {info.length ? info.map((item) => <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} key={item.label}><div className="round-icon">{item.icon}</div><h3>{item.label}</h3><p>{item.value}</p></motion.article>) : <EmptyContent message="Office contact information is not available from the API." />}
      </section>
    </>
  );
}
