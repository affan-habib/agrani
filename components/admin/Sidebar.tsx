"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const navGroups = [
    {
      title: "Core",
      items: [
        { label: "Dashboard", href: "/admin", icon: "📊" },
        { label: "Site Settings", href: "/admin/settings", icon: "⚙️" },
        { label: "Media Library", href: "/admin/media", icon: "🖼️" },
      ],
    },
    {
      title: "Page Content",
      items: [
        { label: "Page Editors", href: "/admin/pages", icon: "📄" },
      ],
    },
    {
      title: "Content & Portfolio",
      items: [
        { label: "Blog Posts", href: "/admin/blog", icon: "📝" },
        { label: "Blog Categories", href: "/admin/blog/categories", icon: "🏷️" },
        { label: "Case Studies", href: "/admin/case-studies", icon: "💼" },
        { label: "Case Study Tags", href: "/admin/case-studies/tags", icon: "🔖" },
        { label: "Services", href: "/admin/services", icon: "⚡" },
        { label: "Sectors", href: "/admin/sectors", icon: "🌐" },
      ],
    },
    {
      title: "Careers & HR",
      items: [
        { label: "Job Openings", href: "/admin/careers", icon: "👥" },
        { label: "Departments", href: "/admin/careers/departments", icon: "🏢" },
        { label: "Applications", href: "/admin/inquiries/applications", icon: "📥" },
      ],
    },
    {
      title: "Company & Trust",
      items: [
        { label: "Company & Team", href: "/admin/company", icon: "🏛️" },
        { label: "Testimonials", href: "/admin/testimonials", icon: "⭐" },
        { label: "Why Choose Us", href: "/admin/why-choose-us", icon: "✨" },
      ],
    },
    {
      title: "Leads & Inquiries",
      items: [
        { label: "Quote Requests", href: "/admin/inquiries/quotes", icon: "💰" },
        { label: "Newsletter Subscribers", href: "/admin/inquiries/subscribers", icon: "📬" },
      ],
    },
    {
      title: "Access Control",
      items: [
        { label: "Roles & Permissions", href: "/admin/access", icon: "🔒" },
      ],
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link href="/admin" className="admin-logo-text">
          <span style={{ color: "var(--admin-accent)" }}>⚡</span> Agrani <span className="admin-logo-badge">Admin</span>
        </Link>
      </div>

      <nav className="admin-nav">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <div className="admin-nav-group-title">{group.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${isActive(item.href) ? "active" : ""}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
