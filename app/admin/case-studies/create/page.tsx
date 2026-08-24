"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { caseStudiesApi } from "@/lib/admin-api/resources";
import { StoreCaseStudyRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";

export default function CreateCaseStudyPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<StoreCaseStudyRequest>({
    title: "",
    slug: "",
    client_name: "",
    excerpt: "",
    challenge: "",
    solution: "",
    result: "",
    status: "draft",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await caseStudiesApi.create(form);
      showToast("Case study created successfully!", "success");
      router.push("/admin/case-studies");
    } catch (err: any) {
      showToast(err.message || "Failed to create case study", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/case-studies" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Case Studies</Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
          New Case Study
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <FormGroup label="Case Study Title" required>
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

          <div className="admin-form-grid-2">
            <FormGroup label="URL Slug" required>
              <input
                type="text"
                required
                className="admin-input"
                value={form.slug || ""}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Client Name">
              <input
                type="text"
                className="admin-input"
                value={form.client_name || ""}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              />
            </FormGroup>
          </div>

          <FormGroup label="Excerpt / Summary">
            <textarea
              className="admin-textarea"
              value={form.excerpt || ""}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </FormGroup>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Case Analysis</h2>
          <FormGroup label="The Challenge">
            <textarea
              className="admin-textarea"
              value={form.challenge || ""}
              onChange={(e) => setForm({ ...form, challenge: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="The Solution">
            <textarea
              className="admin-textarea"
              value={form.solution || ""}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="The Results & Impact">
            <textarea
              className="admin-textarea"
              value={form.result || ""}
              onChange={(e) => setForm({ ...form, result: e.target.value })}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Link href="/admin/case-studies" className="admin-btn admin-btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            {saving ? "Saving..." : "Create Case Study"}
          </button>
        </div>
      </form>
    </div>
  );
}
