"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { careerJobsApi } from "@/lib/admin-api/resources";
import { CareerJobResource, UpdateCareerJobRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = Number(params.id);

  const [job, setJob] = useState<CareerJobResource | null>(null);
  const [form, setForm] = useState<UpdateCareerJobRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await careerJobsApi.get(id);
        setJob(data);
        setForm({
          title: data.title,
          slug: data.slug,
          opening_type: data.opening_type,
          employment_type: data.employment_type,
          work_mode: data.work_mode,
          location: data.location || "",
          description: data.description || "",
          requirements: data.requirements || "",
          responsibilities: data.responsibilities || "",
          benefits: data.benefits || "",
          status: data.status,
        });
      } catch (err: any) {
        showToast(err.message || "Failed to load job", "error");
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await careerJobsApi.update(id, form);
      setJob(updated);
      showToast("Job opening updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save job", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading position details...</div>;
  }

  if (!job) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-danger)" }}>Position not found.</div>;
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <Link href="/admin/careers" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Job Openings</Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
            Edit Position
          </h1>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <FormGroup label="Position Title" required>
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

          <FormGroup label="Job Description">
            <textarea
              className="admin-textarea"
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Responsibilities">
            <textarea
              className="admin-textarea"
              value={form.responsibilities || ""}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Requirements">
            <textarea
              className="admin-textarea"
              value={form.requirements || ""}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Link href="/admin/careers" className="admin-btn admin-btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            {saving ? "Saving..." : "Update Job Opening"}
          </button>
        </div>
      </form>
    </div>
  );
}
