"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { caseStudiesApi, caseStudyTagsApi, sectorsApi } from "@/lib/admin-api/resources";
import { CaseStudyTagResource, SectorResource, StoreCaseStudyRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { TagManagerModal } from "@/components/admin/TagManagerModal";
import { Bookmark } from "lucide-react";

export default function CreateCaseStudyPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<StoreCaseStudyRequest>({
    title: "",
    slug: "",
    client_name: "",
    sector_id: undefined,
    tag_ids: [],
    excerpt: "",
    challenge: "",
    solution: "",
    result: "",
    status: "draft",
    is_featured: false,
  });
  const [availableTags, setAvailableTags] = useState<CaseStudyTagResource[]>([]);
  const [availableSectors, setAvailableSectors] = useState<SectorResource[]>([]);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      caseStudyTagsApi.list().catch(() => ({ data: [] })),
      sectorsApi.list().catch(() => ({ data: [] })),
    ]).then(([tagsRes, sectorsRes]) => {
      setAvailableTags(tagsRes.data || []);
      setAvailableSectors(sectorsRes.data || []);
    });
  }, []);

  const toggleTag = (tagId: number) => {
    const current = (form.tag_ids as number[]) || [];
    if (current.includes(tagId)) {
      setForm({ ...form, tag_ids: current.filter((t) => t !== tagId) });
    } else {
      setForm({ ...form, tag_ids: [...current, tagId] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await caseStudiesApi.create(form);
      if (form.status === "published") {
        await caseStudiesApi.publish(created.id);
      }
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

          <div className="admin-form-grid-2">
            <FormGroup label="Industry Sector">
              <select
                className="admin-select"
                value={form.sector_id || ""}
                onChange={(e) => setForm({ ...form, sector_id: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">-- None / General --</option>
                {availableSectors.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
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
                Feature on Public Portfolio
              </label>
            </div>
          </div>

          {/* Tag Selection with In-Modal Management */}
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--admin-border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--admin-text-main)" }}>
                Project Tags
              </label>
              <button
                type="button"
                onClick={() => setTagModalOpen(true)}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.6rem" }}
              >
                <Bookmark size={13} />
                <span>+ Manage / Add Tags</span>
              </button>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginBottom: "0.75rem" }}>
              Click on tags to assign them to this case study.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {availableTags.length === 0 ? (
                <div style={{ fontSize: "0.825rem", color: "var(--admin-text-muted)" }}>
                  No tags yet. Click <strong>+ Manage / Add Tags</strong> above to create some in a modal.
                </div>
              ) : (
                availableTags.map((t) => {
                  const active = ((form.tag_ids as number[]) || []).includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        border: active ? "1.5px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                        background: active ? "rgba(99, 102, 241, 0.15)" : "var(--admin-surface)",
                        color: active ? "var(--admin-accent)" : "var(--admin-text-muted)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {active ? "✓ " : "#"}{t.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <FormGroup label="Excerpt / Summary">
              <textarea
                className="admin-textarea"
                value={form.excerpt || ""}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </FormGroup>
          </div>

          <MediaUploadField
            label="Featured Showcase Image"
            description="The primary project thumbnail displayed on case study cards and headers"
            value={form.featured_media_id}
            onChange={(mediaId) => setForm({ ...form, featured_media_id: mediaId })}
          />
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

      {/* Tag Manager Modal */}
      <TagManagerModal
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        onTagsChange={(newTags) => setAvailableTags(newTags)}
      />
    </div>
  );
}
