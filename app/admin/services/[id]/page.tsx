"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { servicesApi } from "@/lib/admin-api/resources";
import { ServiceResource, UpdateServiceRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = Number(params.id);

  const [service, setService] = useState<ServiceResource | null>(null);
  const [form, setForm] = useState<UpdateServiceRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        const data = await servicesApi.get(id);
        setService(data);
        setForm({
          title: data.title,
          slug: data.slug,
          short_description: data.short_description || "",
          description: data.description || "",
          status: data.status,
        });
      } catch (err: any) {
        showToast(err.message || "Failed to load service", "error");
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await servicesApi.update(id, form);
      setService(updated);
      showToast("Service updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save service", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading service...</div>;
  if (!service) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-danger)" }}>Not found.</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <Link href="/admin/services" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Services</Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
            Edit Service
          </h1>
        </div>
        <StatusBadge status={service.status} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <FormGroup label="Service Title" required>
            <input
              type="text"
              required
              className="admin-input"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
            {saving ? "Saving..." : "Update Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
