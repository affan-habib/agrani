"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard,
  Settings2,
  FolderOpen,
  Layers,
  FileText,
  Tags,
  Briefcase,
  Bookmark,
  Zap,
  Globe,
  Users,
  Building2,
  Inbox,
  Building,
  Quote,
  ShieldCheck,
  DollarSign,
  Mail,
  Send,
  Lock,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

export interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const navGroups = [
    {
      title: "Core",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Site Settings", href: "/admin/settings", icon: Settings2 },
        { label: "Media Library", href: "/admin/media", icon: FolderOpen },
      ],
    },
    {
      title: "Page Content",
      items: [
        { label: "Page Editors", href: "/admin/pages", icon: Layers },
      ],
    },
    {
      title: "Content & Portfolio",
      items: [
        { label: "Blog Posts", href: "/admin/blog", icon: FileText },
        { label: "Blog Categories", href: "/admin/blog/categories", icon: Tags },
        { label: "Case Studies", href: "/admin/case-studies", icon: Briefcase },
        { label: "Case Study Tags", href: "/admin/case-studies/tags", icon: Bookmark },
        { label: "Services", href: "/admin/services", icon: Zap },
        { label: "Sectors", href: "/admin/sectors", icon: Globe },
      ],
    },
    {
      title: "Careers & HR",
      items: [
        { label: "Job Openings", href: "/admin/careers", icon: Users },
        { label: "Departments", href: "/admin/careers/departments", icon: Building2 },
        { label: "Applications", href: "/admin/inquiries/applications", icon: Inbox },
      ],
    },
    {
      title: "Company & Trust",
      items: [
        { label: "Company & Team", href: "/admin/company", icon: Building },
        { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
        { label: "Why Choose Us", href: "/admin/why-choose-us", icon: Sparkles },
      ],
    },
    {
      title: "Leads & Inquiries",
      items: [
        { label: "Quote Requests", href: "/admin/inquiries/quotes", icon: DollarSign },
        { label: "Contact Inquiries", href: "/admin/inquiries/contacts", icon: Mail },
        { label: "Newsletter Subscribers", href: "/admin/inquiries/subscribers", icon: Send },
      ],
    },
    {
      title: "Security & Access",
      items: [
        { label: "Roles & Permissions", href: "/admin/access", icon: Lock },
      ],
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = () => {
    if (!user || !user.roles || user.roles.length === 0) return "Administrator";
    const role = user.roles[0];
    if (role === "super-admin") return "Super Admin";
    if (role === "admin") return "Admin";
    if (role === "editor") return "Editor";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
      {/* Brand Header */}
      <div className="admin-sidebar-header">
        <Link href="/admin" className="admin-brand-link" onClick={onCloseMobile}>
          <div className="admin-brand-icon-wrapper">
            <span className="admin-brand-symbol">⚡</span>
          </div>
          <div className="admin-brand-info">
            <div className="admin-brand-title">
              AGRANI
              <span className="admin-brand-tag">PRO</span>
            </div>
            <div className="admin-brand-subtitle">Management Console</div>
          </div>
        </Link>

        {mobileOpen && (
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="admin-nav">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="admin-nav-group">
            <div className="admin-nav-group-title">{group.title}</div>
            <div className="admin-nav-group-items">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`admin-nav-item ${active ? "active" : ""}`}
                  >
                    <span className="admin-nav-icon">
                      <IconComponent size={17} strokeWidth={active ? 2.2 : 1.8} />
                    </span>
                    <span className="admin-nav-label">{item.label}</span>
                    {active && <span className="admin-nav-active-pill" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Mini-Card at Footer */}
      {user && (
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user-card">
            <div className="admin-sidebar-user-avatar">
              {getInitials(user.name)}
            </div>
            <div className="admin-sidebar-user-meta">
              <div className="admin-sidebar-user-name" title={user.name}>
                {user.name || "Administrator"}
              </div>
              <div className="admin-sidebar-user-role">
                <span className="admin-role-dot" />
                {getRoleLabel()}
              </div>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="admin-sidebar-logout-btn"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

