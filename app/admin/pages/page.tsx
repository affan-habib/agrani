"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { singletonsApi } from "@/lib/admin-api/singletons";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import {
  Home,
  Building2,
  Zap,
  Cpu,
  Sparkles,
  Briefcase,
  FileText,
  Users,
  Mail,
  Save,
  Loader2,
} from "lucide-react";

const PAGES_CONFIG = [
  { slug: "home-page", title: "Home Page", icon: Home, subtitle: "Hero banner, review badges, and section headings" },
  { slug: "about-page", title: "About Us", icon: Building2, subtitle: "Overview, Director message, Mission & Vision statements" },
  { slug: "product-services-page", title: "Products & Services", icon: Zap, subtitle: "Catalog tab titles, intro copy, and service CTA" },
  { slug: "expertise-page", title: "Expertise", icon: Cpu, subtitle: "Technical team headers, tech stack, and capabilities" },
  { slug: "customer-experience-page", title: "Customer Experience", icon: Sparkles, subtitle: "Hero headline, client metrics, and quote copy" },
  { slug: "case-studies-page", title: "Case Studies", icon: Briefcase, subtitle: "Case study archive hero and detail labels" },
  { slug: "blog-page", title: "Blog & News", icon: FileText, subtitle: "Articles index hero, sharing defaults, and SEO" },
  { slug: "career-page", title: "Careers", icon: Users, subtitle: "Careers hero, current openings & internship copy" },
  { slug: "contact-page", title: "Contact Us", icon: Mail, subtitle: "Contact page hero, introduction copy, and office info" },
];

export default function AdminPagesManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const initialTab = searchParams.get("tab") || "home-page";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPageData = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      let res: any = {};
      if (slug === "home-page") res = await singletonsApi.getHomePage();
      else if (slug === "about-page") res = await singletonsApi.getAboutPage();
      else if (slug === "product-services-page") res = await singletonsApi.getProductServicesPage();
      else if (slug === "expertise-page") res = await singletonsApi.getExpertisePage();
      else if (slug === "customer-experience-page") res = await singletonsApi.getCustomerExperiencePage();
      else if (slug === "case-studies-page") res = await singletonsApi.getCaseStudiesPage();
      else if (slug === "blog-page") res = await singletonsApi.getBlogPage();
      else if (slug === "career-page") res = await singletonsApi.getCareerPage();
      else if (slug === "contact-page") res = await singletonsApi.getContactPage();

      setData(res || {});
    } catch (err: any) {
      showToast(err.message || "Failed to load page content", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPageData(activeTab);
  }, [activeTab, loadPageData]);

  const handleTabChange = (slug: string) => {
    setActiveTab(slug);
    router.replace(`/admin/pages?tab=${slug}`, { scroll: false });
  };

  const handleChange = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === "home-page") await singletonsApi.updateHomePage(data);
      else if (activeTab === "about-page") await singletonsApi.updateAboutPage(data);
      else if (activeTab === "product-services-page") await singletonsApi.updateProductServicesPage(data);
      else if (activeTab === "expertise-page") await singletonsApi.updateExpertisePage(data);
      else if (activeTab === "customer-experience-page") await singletonsApi.updateCustomerExperiencePage(data);
      else if (activeTab === "case-studies-page") await singletonsApi.updateCaseStudiesPage(data);
      else if (activeTab === "blog-page") await singletonsApi.updateBlogPage(data);
      else if (activeTab === "career-page") await singletonsApi.updateCareerPage(data);
      else if (activeTab === "contact-page") await singletonsApi.updateContactPage(data);

      showToast("Page content saved successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save page content", "error");
    } finally {
      setSaving(false);
    }
  };

  const currentConfig = PAGES_CONFIG.find((p) => p.slug === activeTab) || PAGES_CONFIG[0];
  const CurrentIcon = currentConfig.icon;

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", letterSpacing: "-0.02em" }}>
          Page Content Editors
        </h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Select a page tab below to customize headlines, copy, section texts, and SEO metadata.
        </p>
      </div>

      {/* Sleek Tab Navigation with Lucide Icons */}
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          overflowX: "auto",
          paddingBottom: "0.75rem",
          marginBottom: "1.75rem",
          borderBottom: "1px solid var(--admin-border)",
          scrollbarWidth: "thin",
        }}
      >
        {PAGES_CONFIG.map((p) => {
          const isActive = activeTab === p.slug;
          const TabIcon = p.icon;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => handleTabChange(p.slug)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
                color: isActive ? "var(--admin-accent)" : "var(--admin-text-muted)",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                borderBottom: isActive ? "2px solid var(--admin-accent)" : "2px solid transparent",
              }}
            >
              <TabIcon size={16} />
              <span>{p.title}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
          <div style={{ display: "inline-block", animation: "spin 1s linear infinite", marginBottom: "1rem" }}>
            <Loader2 size={32} style={{ color: "var(--admin-accent)" }} />
          </div>
          <div>Loading {currentConfig.title} content...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Active Tab Banner */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent)" }}>
                  <CurrentIcon size={18} />
                </div>
                <span>{currentConfig.title} Settings</span>
              </div>
              <p style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                {currentConfig.subtitle}
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn admin-btn-primary"
              style={{ padding: "0.65rem 1.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {saving ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
              <span>{saving ? "Saving..." : "Save Page Content"}</span>
            </button>
          </div>

          {/* 1. HERO & INTRO SECTION */}
          <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
            <h2 className="admin-card-title" style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>
              Hero &amp; Introduction
            </h2>

            <FormGroup label="Eyebrow / Sub-headline">
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. About Us / Our Services / Careers"
                value={data.intro_eyebrow ?? data.hero_eyebrow ?? data.eyebrow ?? ""}
                onChange={(e) => {
                  if (activeTab === "about-page") handleChange("intro_eyebrow", e.target.value);
                  else if (activeTab === "contact-page" || activeTab === "product-services-page") handleChange("eyebrow", e.target.value);
                  else handleChange("hero_eyebrow", e.target.value);
                }}
              />
            </FormGroup>

            <FormGroup label="Main Headline Title">
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Pioneering Next-Gen Cloud Architecture"
                value={data.intro_title ?? data.hero_title ?? data.title ?? ""}
                onChange={(e) => {
                  if (activeTab === "about-page") handleChange("intro_title", e.target.value);
                  else if (activeTab === "contact-page" || activeTab === "product-services-page") handleChange("title", e.target.value);
                  else handleChange("hero_title", e.target.value);
                }}
              />
            </FormGroup>

            <FormGroup label="Introductory Description">
              <textarea
                className="admin-textarea"
                style={{ minHeight: 95 }}
                placeholder="High-level introductory paragraph for this page..."
                value={data.intro_description ?? data.hero_description ?? data.introduction ?? data.services_introduction ?? ""}
                onChange={(e) => {
                  if (activeTab === "about-page") handleChange("intro_description", e.target.value);
                  else if (activeTab === "contact-page") handleChange("introduction", e.target.value);
                  else if (activeTab === "product-services-page") handleChange("services_introduction", e.target.value);
                  else handleChange("hero_description", e.target.value);
                }}
              />
            </FormGroup>

            {/* Home Page specific buttons */}
            {activeTab === "home-page" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
                <FormGroup label="Primary Button Text">
                  <input
                    type="text"
                    className="admin-input"
                    value={data.primary_cta_text || ""}
                    onChange={(e) => handleChange("primary_cta_text", e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Primary Button Target URL">
                  <input
                    type="text"
                    className="admin-input"
                    value={data.primary_cta_url || ""}
                    onChange={(e) => handleChange("primary_cta_url", e.target.value)}
                  />
                </FormGroup>
              </div>
            )}

            {/* Product & Services tab switcher labels */}
            {activeTab === "product-services-page" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
                <FormGroup label="Services Tab Label">
                  <input
                    type="text"
                    className="admin-input"
                    value={data.services_tab_label || ""}
                    onChange={(e) => handleChange("services_tab_label", e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Products Tab Label">
                  <input
                    type="text"
                    className="admin-input"
                    value={data.products_tab_label || ""}
                    onChange={(e) => handleChange("products_tab_label", e.target.value)}
                  />
                </FormGroup>
              </div>
            )}
          </div>

          {/* 2. ABOUT PAGE SPECIAL SECTIONS */}
          {activeTab === "about-page" && (
            <>
              <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
                <h2 className="admin-card-title" style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>
                  Director Keynote Speech
                </h2>
                <FormGroup label="Keynote Headline">
                  <input
                    type="text"
                    className="admin-input"
                    value={data.director_message_title || ""}
                    onChange={(e) => handleChange("director_message_title", e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Keynote Message">
                  <textarea
                    className="admin-textarea"
                    style={{ minHeight: 110 }}
                    value={data.director_message || ""}
                    onChange={(e) => handleChange("director_message", e.target.value)}
                  />
                </FormGroup>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <FormGroup label="Director Full Name">
                    <input
                      type="text"
                      className="admin-input"
                      value={data.director_name || ""}
                      onChange={(e) => handleChange("director_name", e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup label="Designation">
                    <input
                      type="text"
                      className="admin-input"
                      value={data.director_designation || ""}
                      onChange={(e) => handleChange("director_designation", e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
                <h2 className="admin-card-title" style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>
                  Mission &amp; Vision
                </h2>
                <FormGroup label="Mission Statement">
                  <textarea
                    className="admin-textarea"
                    style={{ minHeight: 80 }}
                    value={data.mission || ""}
                    onChange={(e) => handleChange("mission", e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Vision Statement">
                  <textarea
                    className="admin-textarea"
                    style={{ minHeight: 80 }}
                    value={data.vision || ""}
                    onChange={(e) => handleChange("vision", e.target.value)}
                  />
                </FormGroup>
              </div>
            </>
          )}

          {/* 3. EXPERTISE SPECIAL SECTIONS */}
          {activeTab === "expertise-page" && (
            <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
              <h2 className="admin-card-title" style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>
                Section Headers
              </h2>
              <FormGroup label="Technical Team Section Title">
                <input
                  type="text"
                  className="admin-input"
                  value={data.technical_team_title || ""}
                  onChange={(e) => handleChange("technical_team_title", e.target.value)}
                />
              </FormGroup>
              <FormGroup label="Technological Expertise Section Title">
                <input
                  type="text"
                  className="admin-input"
                  value={data.technological_expertise_title || ""}
                  onChange={(e) => handleChange("technological_expertise_title", e.target.value)}
                />
              </FormGroup>
              <FormGroup label="Capabilities Section Title">
                <input
                  type="text"
                  className="admin-input"
                  value={data.capabilities_title || ""}
                  onChange={(e) => handleChange("capabilities_title", e.target.value)}
                />
              </FormGroup>
            </div>
          )}

          {/* 4. CAREER SPECIAL SECTIONS */}
          {activeTab === "career-page" && (
            <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
              <h2 className="admin-card-title" style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>
                Job List Headings
              </h2>
              <FormGroup label="Current Openings Title">
                <input
                  type="text"
                  className="admin-input"
                  value={data.current_openings_title || ""}
                  onChange={(e) => handleChange("current_openings_title", e.target.value)}
                />
              </FormGroup>
              <FormGroup label="Current Openings Description">
                <input
                  type="text"
                  className="admin-input"
                  value={data.current_openings_description || ""}
                  onChange={(e) => handleChange("current_openings_description", e.target.value)}
                />
              </FormGroup>
              <FormGroup label="Internship Openings Title">
                <input
                  type="text"
                  className="admin-input"
                  value={data.internship_openings_title || ""}
                  onChange={(e) => handleChange("internship_openings_title", e.target.value)}
                />
              </FormGroup>
            </div>
          )}

          {/* 5. QUOTE & BOTTOM CTA SECTION */}
          <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
            <h2 className="admin-card-title" style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>
              Bottom Quote &amp; CTA Banner
            </h2>
            <FormGroup label="Quote Banner Headline">
              <input
                type="text"
                className="admin-input"
                value={data.quote_title || ""}
                onChange={(e) => handleChange("quote_title", e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Quote Banner Description">
              <textarea
                className="admin-textarea"
                style={{ minHeight: 75 }}
                value={data.quote_description || ""}
                onChange={(e) => handleChange("quote_description", e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Form Header Title">
              <input
                type="text"
                className="admin-input"
                value={data.quote_form_title || ""}
                onChange={(e) => handleChange("quote_form_title", e.target.value)}
              />
            </FormGroup>
          </div>

          {/* 6. SEO METADATA SECTION */}
          <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
            <h2 className="admin-card-title" style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>
              Search Engine Optimization (SEO)
            </h2>
            <FormGroup label="Page Meta Title">
              <input
                type="text"
                className="admin-input"
                value={data.seo_title || ""}
                onChange={(e) => handleChange("seo_title", e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Page Meta Description">
              <textarea
                className="admin-textarea"
                style={{ minHeight: 75 }}
                value={data.seo_description || ""}
                onChange={(e) => handleChange("seo_description", e.target.value)}
              />
            </FormGroup>
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn admin-btn-primary"
              style={{ padding: "0.75rem 2rem", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {saving ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
              <span>{saving ? "Saving Changes..." : `Save ${currentConfig.title}`}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
