"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { servicesApi } from "@/lib/admin-api/resources";
import { StoreServiceRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { MediaUploadField } from "@/components/admin/MediaUploadField";

export default function CreateServicePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<StoreServiceRequest>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    full_description: "",
    icon_media_id: null,
    featured_image_media_id: null,
    sort_order: 0,
    is_featured: false,
    status: "draft",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await servicesApi.create({
        ...form,
        full_description: form.full_description || form.description,
      });
      if (form.status === "published") {
        await servicesApi.publish(created.id);
      }
      showToast("Service created successfully!", "success");
      router.push("/admin/services");
    } catch (err: any) {
      showToast(err.message || "Failed to create service", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/services" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Services</Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
          Add New Service
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <FormGroup label="Service Title" required hint="e.g. Software Development, IT Consultancy">
            <input
              type="text"
              required
              className="admin-input"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm({
                  ...form,
                  title,
                  slug: form.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
                });
              }}
            />
          </FormGroup>

          <FormGroup label="URL Slug" required hint="URL identifier (e.g. software-development)">
            <input
              type="text"
              required
              className="admin-input"
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </FormGroup>

          <FormGroup
            label="Short Summary (Homepage Carousel Copy)"
            hint="This summary appears directly inside the card in the Homepage services carousel."
          >
            <textarea
              className="admin-textarea"
              style={{ minHeight: 90 }}
              placeholder="As the tech spectrum broadens, application development is becoming more and more complex..."
              value={form.short_description || ""}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            />
          </FormGroup>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", margin: "1rem 0" }}>
            <MediaUploadField
              label="Service Icon"
              description="Icon displayed on the Homepage services card (e.g. 36x36px PNG/SVG)"
              value={form.icon_media_id}
              onChange={(mediaId) => setForm({ ...form, icon_media_id: mediaId })}
            />

            <MediaUploadField
              label="Featured Image"
              description="Main artwork/banner for this service detail page"
              value={form.featured_image_media_id}
              onChange={(mediaId) => setForm({ ...form, featured_image_media_id: mediaId })}
            />
          </div>

          <FormGroup label="Full Description">
            <textarea
              className="admin-textarea"
              style={{ minHeight: 180 }}
              placeholder="Detailed description and overview for this service..."
              value={form.full_description || form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value, full_description: e.target.value })}
            />
          </FormGroup>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--admin-border)" }}>
            <FormGroup label="Display Order (Sort Order)" hint="Lower numbers appear first in the carousel">
              <input
                type="number"
                className="admin-input"
                min={0}
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </FormGroup>

            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", paddingTop: "1.75rem" }}>
              <input
                type="checkbox"
                id="is_featured"
                checked={!!form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              <label htmlFor="is_featured" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--admin-text-main)", cursor: "pointer" }}>
                Feature in Homepage Services Carousel
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
          <Link href="/admin/services" className="admin-btn admin-btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            {saving ? "Saving..." : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
