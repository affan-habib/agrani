"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { singletonsApi } from "@/lib/admin-api/singletons";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";

export default function SingletonPageEditor() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const slug = String(params.slug);

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPage() {
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
        showToast(err.message || "Failed to load page data", "error");
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (slug === "home-page") await singletonsApi.updateHomePage(data);
      else if (slug === "about-page") await singletonsApi.updateAboutPage(data);
      else if (slug === "product-services-page") await singletonsApi.updateProductServicesPage(data);
      else if (slug === "expertise-page") await singletonsApi.updateExpertisePage(data);
      else if (slug === "customer-experience-page") await singletonsApi.updateCustomerExperiencePage(data);
      else if (slug === "case-studies-page") await singletonsApi.updateCaseStudiesPage(data);
      else if (slug === "blog-page") await singletonsApi.updateBlogPage(data);
      else if (slug === "career-page") await singletonsApi.updateCareerPage(data);
      else if (slug === "contact-page") await singletonsApi.updateContactPage(data);

      showToast("Page content updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save page content", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading page content...</div>;
  }

  const pageTitle = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <Link href="/admin/pages" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to All Pages</Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
            {pageTitle}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Hero Section */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Hero Banner Section</h2>
          <FormGroup label="Eyebrow / Sub-headline">
            <input
              type="text"
              className="admin-input"
              value={data.hero?.eyebrow || data.overview?.eyebrow || ""}
              onChange={(e) => {
                if (slug === "about-page") {
                  setData({ ...data, overview: { ...data.overview, eyebrow: e.target.value } });
                } else {
                  setData({ ...data, hero: { ...data.hero, eyebrow: e.target.value } });
                }
              }}
            />
          </FormGroup>
          <FormGroup label="Main Title">
            <input
              type="text"
              className="admin-input"
              value={data.hero?.title || data.overview?.title || ""}
              onChange={(e) => {
                if (slug === "about-page") {
                  setData({ ...data, overview: { ...data.overview, title: e.target.value } });
                } else {
                  setData({ ...data, hero: { ...data.hero, title: e.target.value } });
                }
              }}
            />
          </FormGroup>
          <FormGroup label="Description">
            <textarea
              className="admin-textarea"
              value={data.hero?.description || data.overview?.description || ""}
              onChange={(e) => {
                if (slug === "about-page") {
                  setData({ ...data, overview: { ...data.overview, description: e.target.value } });
                } else {
                  setData({ ...data, hero: { ...data.hero, description: e.target.value } });
                }
              }}
            />
          </FormGroup>
        </div>

        {/* SEO Section */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>SEO Metadata</h2>
          <FormGroup label="SEO Meta Title">
            <input
              type="text"
              className="admin-input"
              value={data.seo?.title || ""}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, title: e.target.value } })}
            />
          </FormGroup>
          <FormGroup label="SEO Meta Description">
            <textarea
              className="admin-textarea"
              style={{ minHeight: 80 }}
              value={data.seo?.description || ""}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, description: e.target.value } })}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            {saving ? "Saving Changes..." : "Save Page Content"}
          </button>
        </div>
      </form>
    </div>
  );
}
