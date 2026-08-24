"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { servicesApi } from "@/lib/admin-api/resources";
import { StoreServiceRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";

export default function CreateServicePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<StoreServiceRequest>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    status: "draft",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await servicesApi.create(form);
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
          <FormGroup label="Service Title" required>
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

          <FormGroup label="URL Slug" required>
            <input
              type="text"
              required
              className="admin-input"
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Short Summary">
            <textarea
              className="admin-textarea"
              value={form.short_description || ""}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Full Description">
            <textarea
              className="admin-textarea"
              style={{ minHeight: 180 }}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Link href="/admin/services" className="admin-btn admin-btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            {saving ? "Saving..." : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
