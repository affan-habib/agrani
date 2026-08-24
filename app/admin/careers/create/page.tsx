"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { careerJobsApi } from "@/lib/admin-api/resources";
import { StoreCareerJobRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";

export default function CreateJobPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<StoreCareerJobRequest>({
    title: "",
    slug: "",
    opening_type: "experienced",
    employment_type: "full-time",
    work_mode: "onsite",
    location: "Dhaka, Bangladesh",
    short_description: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    status: "draft",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await careerJobsApi.create(form);
      showToast("Job opening posted successfully!", "success");
      router.push("/admin/careers");
    } catch (err: any) {
      showToast(err.message || "Failed to create job", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/careers" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Job Openings</Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
          Post New Job Opening
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Job Summary</h2>
          <FormGroup label="Position Title" required>
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
              placeholder="e.g. Senior Full-Stack Engineer"
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

          <div className="admin-form-grid">
            <FormGroup label="Opening Type">
              <select
                className="admin-select"
                value={form.opening_type}
                onChange={(e) => setForm({ ...form, opening_type: e.target.value as any })}
              >
                <option value="experienced">Experienced Professional</option>
                <option value="entry-level">Entry Level</option>
                <option value="internship">Internship</option>
              </select>
            </FormGroup>

            <FormGroup label="Employment Type">
              <select
                className="admin-select"
                value={form.employment_type}
                onChange={(e) => setForm({ ...form, employment_type: e.target.value as any })}
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
              </select>
            </FormGroup>

            <FormGroup label="Work Mode">
              <select
                className="admin-select"
                value={form.work_mode}
                onChange={(e) => setForm({ ...form, work_mode: e.target.value as any })}
              >
                <option value="onsite">On-Site</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
            </FormGroup>
          </div>

          <FormGroup label="Location">
            <input
              type="text"
              className="admin-input"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </FormGroup>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Details & Requirements</h2>
          <FormGroup label="Job Description">
            <textarea
              className="admin-textarea"
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Key Responsibilities">
            <textarea
              className="admin-textarea"
              value={form.responsibilities || ""}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Candidate Requirements">
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
            {saving ? "Posting Job..." : "Post Job Opening"}
          </button>
        </div>
      </form>
    </div>
  );
}
