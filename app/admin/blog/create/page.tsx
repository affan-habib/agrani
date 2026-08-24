"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogPostsApi } from "@/lib/admin-api/resources";
import { StoreBlogPostRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<StoreBlogPostRequest>({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    status: "draft",
    is_featured: false,
    seo_title: "",
    seo_description: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await blogPostsApi.create(form);
      showToast("Blog post created successfully!", "success");
      router.push("/admin/blog");
    } catch (err: any) {
      showToast(err.message || "Failed to create post", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm({ ...form, title: val, slug: form.slug ? form.slug : slug });
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/blog" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Blog Posts</Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
          New Blog Post
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Article Details</h2>
          <FormGroup label="Post Title" required>
            <input
              type="text"
              required
              className="admin-input"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Scaling Enterprise Microservices with Kubernetes"
            />
          </FormGroup>

          <FormGroup label="URL Slug" required hint="Lowercase letters, numbers, and dashes only">
            <input
              type="text"
              required
              className="admin-input"
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="scaling-enterprise-microservices"
            />
          </FormGroup>

          <FormGroup label="Short Excerpt" required>
            <textarea
              required
              className="admin-textarea"
              style={{ minHeight: 80 }}
              value={form.excerpt || ""}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="A brief summary for previews and social sharing"
            />
          </FormGroup>

          <FormGroup label="Article Content (Markdown / HTML)">
            <textarea
              className="admin-textarea"
              style={{ minHeight: 280, fontFamily: "monospace" }}
              value={form.body || ""}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write your article body content here..."
            />
          </FormGroup>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Publishing & SEO</h2>
          <div className="admin-form-grid-2">
            <FormGroup label="Initial Status">
              <select
                className="admin-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormGroup>

            <FormGroup label="SEO Meta Title">
              <input
                type="text"
                className="admin-input"
                value={form.seo_title || ""}
                onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
              />
            </FormGroup>
          </div>

          <FormGroup label="SEO Meta Description">
            <textarea
              className="admin-textarea"
              style={{ minHeight: 80 }}
              value={form.seo_description || ""}
              onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Link href="/admin/blog" className="admin-btn admin-btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            {saving ? "Creating Post..." : "Create Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
