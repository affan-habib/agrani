"use client";

import React, { useState, useEffect } from "react";
import { singletonsApi } from "@/lib/admin-api/singletons";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [socialMap, setSocialMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data: any = await singletonsApi.getSiteSettings();
        setSettings(data || {});
        
        // Populate social link map
        const map: Record<string, string> = {};
        if (Array.isArray(data?.social_links)) {
          data.social_links.forEach((s: any) => {
            if (s.channel) map[s.channel.toLowerCase()] = s.url || "";
          });
        }
        setSocialMap(map);
      } catch (err: any) {
        showToast(err.message || "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [showToast]);

  const handleSocialChange = (channel: string, url: string) => {
    setSocialMap((prev) => ({ ...prev, [channel]: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Format social links
      const formattedSocial = Object.entries(socialMap).map(([channel, url], idx) => ({
        channel,
        label: channel.charAt(0).toUpperCase() + channel.slice(1),
        url,
        icon_key: channel,
        is_active: true,
        sort_order: idx,
      }));

      const payload = {
        ...settings,
        social_links: formattedSocial,
      };

      const updated = await singletonsApi.updateSiteSettings(payload);
      setSettings(updated || {});
      showToast("Site settings saved successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading settings...</div>;
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Global Site Settings</h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
          Manage global branding, contact details, social links, and footer information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* BRANDING & GENERAL INFO */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Branding & General Info</h2>
          <div className="admin-form-grid-2">
            <FormGroup label="Company Name">
              <input
                type="text"
                className="admin-input"
                value={settings.company_name || ""}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Legal Entity Name">
              <input
                type="text"
                className="admin-input"
                value={settings.legal_name || ""}
                onChange={(e) => setSettings({ ...settings, legal_name: e.target.value })}
              />
            </FormGroup>
          </div>
          <div className="admin-form-grid-2">
            <FormGroup label="Tagline / Slogan">
              <input
                type="text"
                className="admin-input"
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Website URL">
              <input
                type="url"
                className="admin-input"
                value={settings.website_url || ""}
                onChange={(e) => setSettings({ ...settings, website_url: e.target.value })}
              />
            </FormGroup>
          </div>
          <FormGroup label="Short Company Description">
            <textarea
              className="admin-textarea"
              style={{ minHeight: 80 }}
              value={settings.short_description || settings.company_description || ""}
              onChange={(e) => setSettings({ ...settings, short_description: e.target.value, company_description: e.target.value })}
            />
          </FormGroup>
        </div>

        {/* CONTACT DETAILS */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Contact Information</h2>
          <div className="admin-form-grid-2">
            <FormGroup label="Primary Email">
              <input
                type="email"
                className="admin-input"
                value={settings.primary_email || ""}
                onChange={(e) => setSettings({ ...settings, primary_email: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Secondary / Support Email">
              <input
                type="email"
                className="admin-input"
                value={settings.secondary_email || ""}
                onChange={(e) => setSettings({ ...settings, secondary_email: e.target.value })}
              />
            </FormGroup>
          </div>
          <div className="admin-form-grid-2">
            <FormGroup label="Primary Phone">
              <input
                type="text"
                className="admin-input"
                value={settings.primary_phone || ""}
                onChange={(e) => setSettings({ ...settings, primary_phone: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Business Hours">
              <input
                type="text"
                className="admin-input"
                value={settings.business_hours_text || ""}
                onChange={(e) => setSettings({ ...settings, business_hours_text: e.target.value })}
              />
            </FormGroup>
          </div>
          <div className="admin-form-grid-2">
            <FormGroup label="Street Address Line 1">
              <input
                type="text"
                className="admin-input"
                value={settings.address_line_1 || ""}
                onChange={(e) => setSettings({ ...settings, address_line_1: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="City / Postal Code / Country">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="City"
                  className="admin-input"
                  value={settings.city || ""}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="admin-input"
                  value={settings.postal_code || ""}
                  onChange={(e) => setSettings({ ...settings, postal_code: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="admin-input"
                  value={settings.country || ""}
                  onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                />
              </div>
            </FormGroup>
          </div>
        </div>

        {/* SOCIAL MEDIA LINKS */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Social Media Profiles</h2>
          <div className="admin-form-grid-2">
            <FormGroup label="LinkedIn URL">
              <input
                type="url"
                className="admin-input"
                placeholder="https://linkedin.com/company/..."
                value={socialMap.linkedin || ""}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Twitter / X URL">
              <input
                type="url"
                className="admin-input"
                placeholder="https://twitter.com/..."
                value={socialMap.twitter || ""}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Facebook URL">
              <input
                type="url"
                className="admin-input"
                placeholder="https://facebook.com/..."
                value={socialMap.facebook || ""}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
              />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input
                type="url"
                className="admin-input"
                placeholder="https://github.com/..."
                value={socialMap.github || ""}
                onChange={(e) => handleSocialChange("github", e.target.value)}
              />
            </FormGroup>
          </div>
        </div>

        {/* FOOTER & COPYRIGHT */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Footer & Newsletter</h2>
          <div className="admin-form-grid-2">
            <FormGroup label="Newsletter Headline">
              <input
                type="text"
                className="admin-input"
                value={settings.newsletter_title || ""}
                onChange={(e) => setSettings({ ...settings, newsletter_title: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Copyright Notice">
              <input
                type="text"
                className="admin-input"
                value={settings.copyright_text || ""}
                onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
              />
            </FormGroup>
          </div>
          <FormGroup label="Newsletter Description">
            <input
              type="text"
              className="admin-input"
              value={settings.newsletter_description || ""}
              onChange={(e) => setSettings({ ...settings, newsletter_description: e.target.value })}
            />
          </FormGroup>
        </div>

        {/* DEFAULT SEO */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Default SEO Configuration</h2>
          <FormGroup label="Default SEO Title">
            <input
              type="text"
              className="admin-input"
              value={settings.default_seo_title || ""}
              onChange={(e) => setSettings({ ...settings, default_seo_title: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="Default SEO Description">
            <textarea
              className="admin-textarea"
              style={{ minHeight: 80 }}
              value={settings.default_seo_description || ""}
              onChange={(e) => setSettings({ ...settings, default_seo_description: e.target.value })}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "0.75rem 1.75rem", fontSize: "1rem" }}>
            {saving ? "Saving Changes..." : "Save Site Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
