"use client";

import React, { useState, useEffect } from "react";
import { singletonsApi } from "@/lib/admin-api/singletons";
import { AdminSiteSettingsResource } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AdminSiteSettingsResource>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await singletonsApi.getSiteSettings();
        setSettings(data || {});
      } catch (err: any) {
        showToast(err.message || "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await singletonsApi.updateSiteSettings(settings);
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
            <FormGroup label="Site Title">
              <input
                type="text"
                className="admin-input"
                value={settings.site_title || ""}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              />
            </FormGroup>
          </div>
          <FormGroup label="Tagline / Slogan">
            <input
              type="text"
              className="admin-input"
              value={settings.tagline || ""}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
          </FormGroup>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Contact Details</h2>
          <div className="admin-form-grid-2">
            <FormGroup label="Contact Email">
              <input
                type="email"
                className="admin-input"
                value={settings.contact_email || ""}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Support Email">
              <input
                type="email"
                className="admin-input"
                value={settings.support_email || ""}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
              />
            </FormGroup>
          </div>
          <div className="admin-form-grid-2">
            <FormGroup label="Phone Number">
              <input
                type="text"
                className="admin-input"
                value={settings.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Office Address">
              <input
                type="text"
                className="admin-input"
                value={settings.address || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </FormGroup>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Social Media Links</h2>
          <div className="admin-form-grid-2">
            <FormGroup label="LinkedIn URL">
              <input
                type="url"
                className="admin-input"
                value={settings.social_links?.linkedin || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, linkedin: e.target.value },
                  })
                }
              />
            </FormGroup>
            <FormGroup label="Twitter / X URL">
              <input
                type="url"
                className="admin-input"
                value={settings.social_links?.twitter || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, twitter: e.target.value },
                  })
                }
              />
            </FormGroup>
            <FormGroup label="Facebook URL">
              <input
                type="url"
                className="admin-input"
                value={settings.social_links?.facebook || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, facebook: e.target.value },
                  })
                }
              />
            </FormGroup>
            <FormGroup label="GitHub URL">
              <input
                type="url"
                className="admin-input"
                value={settings.social_links?.github || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, github: e.target.value },
                  })
                }
              />
            </FormGroup>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Footer & Legal</h2>
          <FormGroup label="Footer Text">
            <textarea
              className="admin-textarea"
              value={settings.footer_text || ""}
              onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="Copyright Notice">
            <input
              type="text"
              className="admin-input"
              value={settings.copyright || ""}
              onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            {saving ? "Saving Changes..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
