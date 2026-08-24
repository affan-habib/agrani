"use client";

import React from "react";
import Link from "next/link";

export default function AdminPagesListPage() {
  const pages = [
    { slug: "home-page", title: "Home Page", desc: "Hero banners, stats, call-to-action sections, and SEO tags", icon: "🏠" },
    { slug: "about-page", title: "About Us Page", desc: "Overview, Director message, Mission & Vision statements, SEO", icon: "🏢" },
    { slug: "product-services-page", title: "Products & Services", desc: "Hero text, offerings highlight, and SEO metadata", icon: "⚡" },
    { slug: "expertise-page", title: "Expertise Page", desc: "Hero, core competencies overview, and SEO metadata", icon: "🧠" },
    { slug: "customer-experience-page", title: "Customer Experience", desc: "Hero, customer journey stages, client metrics", icon: "🤝" },
    { slug: "case-studies-page", title: "Case Studies Page", desc: "Case studies archive hero and SEO parameters", icon: "💼" },
    { slug: "blog-page", title: "Blog & News Page", desc: "Blog hero headline, sharing defaults, and SEO", icon: "📝" },
    { slug: "career-page", title: "Career & Culture Page", desc: "Careers hero, employee feedback intro, and perks", icon: "👥" },
    { slug: "contact-page", title: "Contact Us Page", desc: "Contact page hero, office hours, and contact copy", icon: "✉️" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Page Content Editors</h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
          Edit headlines, copy, hero banners, and SEO metadata for every marketing page
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {pages.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/pages/${p.slug}`}
            className="admin-card"
            style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.15s, border-color 0.15s" }}
          >
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{p.icon}</div>
              <h2 className="admin-card-title">{p.title}</h2>
              <p className="admin-card-desc">{p.desc}</p>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--admin-accent)", fontSize: "0.875rem", fontWeight: 600 }}>
              <span>Edit Page Content</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
