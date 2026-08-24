"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { caseStudiesApi } from "@/lib/admin-api/resources";
import { CaseStudyResource, UpdateCaseStudyRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function EditCaseStudyPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = Number(params.id);

  const [study, setStudy] = useState<CaseStudyResource | null>(null);
  const [form, setForm] = useState<UpdateCaseStudyRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadStudy() {
      try {
        const data = await caseStudiesApi.get(id);
        setStudy(data);
        setForm({
          title: data.title,
          slug: data.slug,
          client_name: data.client_name || "",
          excerpt: data.excerpt || "",
          challenge: data.challenge || "",
          solution: data.solution || "",
          result: data.result || "",
          status: data.status,
        });
      } catch (err: any) {
        showToast(err.message || "Failed to load case study", "error");
      } finally {
        setLoading(false);
      }
    }
    loadStudy();
  }, [id, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await caseStudiesApi.update(id, form);
      setStudy(updated);
      showToast("Case study updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save case study", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading case study...</div>;
  if (!study) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-danger)" }}>Not found.</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <Link href="/admin/case-studies" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Case Studies</Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
            Edit Case Study
          </h1>
        </div>
        <StatusBadge status={study.status} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <FormGroup label="Case Study Title" required>
            <input
              type="text"
              required
              className="admin-input"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Case Details</h2>
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
          <FormGroup label="The Results">
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
            {saving ? "Saving..." : "Update Case Study"}
          </button>
        </div>
      </form>
    </div>
  );
}
