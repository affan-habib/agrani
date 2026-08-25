"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminTheme } from "@/context/AdminThemeContext";
import {
  Menu,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Shield,
  LogOut,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

export interface HeaderProps {
  onToggleMobile?: () => void;
  mobileOpen?: boolean;
}

const routeTitleMap: Record<string, string> = {
  admin: "Dashboard",
  settings: "Site Settings",
  media: "Media Library",
  pages: "Page Editors",
  blog: "Blog Posts",
  categories: "Categories",
  create: "Create New",
  "case-studies": "Case Studies",
  tags: "Tags",
  services: "Services",
  sectors: "Sectors",
  careers: "Job Openings",
  departments: "Departments",
  inquiries: "Inquiries & Leads",
  applications: "Job Applications",
  quotes: "Quote Requests",
  contacts: "Contact Messages",
  subscribers: "Subscribers",
  company: "Company & Team",
  testimonials: "Testimonials",
  "why-choose-us": "Why Choose Us",
  access: "Roles & Permissions",
};

export const Header: React.FC<HeaderProps> = ({ onToggleMobile, mobileOpen }) => {
  const { user, logout } = useAdminAuth();
  const { theme, isDark, toggleTheme } = useAdminTheme();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close dropdown on path change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) {
      return [
        { label: "Dashboard", href: "/admin", isLast: true },
      ];
    }

    const items = [];
    let accumulatedPath = "";

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      accumulatedPath += `/${seg}`;
      const isLast = i === segments.length - 1;
      const label = routeTitleMap[seg] || (seg.length > 20 ? `${seg.substring(0, 18)}...` : seg);

      items.push({
        label: i === 0 ? "Admin" : label,
        href: accumulatedPath,
        isLast,
      });
    }

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleBadge = () => {
    if (!user || !user.roles || user.roles.length === 0) return "Admin";
    const role = user.roles[0];
    if (role === "super-admin") return "Super Admin";
    if (role === "admin") return "Admin";
    if (role === "editor") return "Editor";
    return role;
  };

  return (
    <header className="admin-header">
      {/* Left Area: Mobile Menu Button & Dynamic Breadcrumbs */}
      <div className="admin-header-left">
        {onToggleMobile && (
          <button
            type="button"
            className="admin-mobile-toggle-btn"
            onClick={onToggleMobile}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            <Menu size={20} />
          </button>
        )}

        <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/admin" className="admin-breadcrumb-home" title="Go to Dashboard">
            <LayoutDashboard size={15} />
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href + idx}>
              <ChevronRight size={13} className="admin-breadcrumb-separator" />
              {crumb.isLast ? (
                <span className="admin-breadcrumb-current">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="admin-breadcrumb-link">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Area: System Status, Theme Toggle, View Public Site, User Profile Menu */}
      <div className="admin-header-right">
        {/* Live Backend Indicator */}
        <div className="admin-header-status-pill">
          <span className="admin-status-indicator-dot" />
          <span className="admin-status-text">Production</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="admin-theme-toggle-btn"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun size={15} className="admin-theme-icon sun" />
          ) : (
            <Moon size={15} className="admin-theme-icon moon" />
          )}
          <span className="admin-theme-label">{isDark ? "Light" : "Dark"}</span>
        </button>

        {/* View Public Site Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-public-site-btn"
          title="Open public website in new tab"
        >
          <span>Live Site</span>
          <ExternalLink size={13} />
        </a>

        {/* User Profile Dropdown */}
        {user && (
          <div className="admin-user-dropdown-container" ref={dropdownRef}>
            <button
              type="button"
              className={`admin-user-menu-trigger ${dropdownOpen ? "active" : ""}`}
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="admin-user-avatar">
                {getInitials(user.name)}
              </div>
              <div className="admin-user-trigger-info">
                <span className="admin-user-trigger-name">{user.name || "Administrator"}</span>
                <span className="admin-user-trigger-role">{getRoleBadge()}</span>
              </div>
              <ChevronDown size={14} className={`admin-user-chevron ${dropdownOpen ? "rotate" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="admin-user-dropdown-menu">
                <div className="admin-dropdown-header">
                  <div className="admin-dropdown-avatar">
                    {getInitials(user.name)}
                  </div>
                  <div className="admin-dropdown-user-details">
                    <div className="admin-dropdown-name">{user.name || "Administrator"}</div>
                    <div className="admin-dropdown-email">{user.email}</div>
                    <span className="admin-dropdown-role-badge">{getRoleBadge()}</span>
                  </div>
                </div>

                <div className="admin-dropdown-divider" />

                <div className="admin-dropdown-section">
                  {/* Quick Theme Switch in Dropdown */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="admin-dropdown-item"
                  >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                    <span>Theme: {isDark ? "Switch to Light" : "Switch to Dark"}</span>
                  </button>

                  <Link
                    href="/admin/settings"
                    className="admin-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={15} />
                    <span>Site Settings</span>
                  </Link>
                  <Link
                    href="/admin/access"
                    className="admin-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Shield size={15} />
                    <span>Roles & Permissions</span>
                  </Link>
                </div>

                <div className="admin-dropdown-divider" />

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="admin-dropdown-item admin-dropdown-logout"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

