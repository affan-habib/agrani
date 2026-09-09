"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogPostsApi, blogCategoriesApi } from "@/lib/admin-api/resources";
import { BlogCategoryResource, StoreBlogPostRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { CategoryManagerModal } from "@/components/admin/CategoryManagerModal";
import { Tags } from "lucide-react";

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<StoreBlogPostRequest>({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    category_ids: [],
    status: "draft",
    is_featured: false,
    seo_title: "",
    seo_description: "",
  });
  const [availableCategories, setAvailableCategories] = useState<BlogCategoryResource[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    blogCategoriesApi
      .list({ per_page: 100 })
      .then((res) => setAvailableCategories(res.data || []))
      .catch(() => {});
  }, []);

  const toggleCategory = (catId: number) => {
    const current = (form.category_ids as number[]) || [];
    if (current.includes(catId)) {
      setForm({ ...form, category_ids: current.filter((c) => c !== catId) });
    } else {
      setForm({ ...form, category_ids: [...current, catId] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await blogPostsApi.create(form);
      if (form.status === "published") {
        await blogPostsApi.publish(created.id);
      }
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

          {/* Category Selector with In-Modal Management */}
          <div style={{ margin: "1.25rem 0", padding: "1rem", borderRadius: "8px", background: "rgba(99, 102, 241, 0.04)", border: "1px solid var(--admin-border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--admin-text-main)" }}>
                Categories
              </label>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(true)}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.6rem" }}
              >
                <Tags size={13} />
                <span>+ Manage / Add Categories</span>
              </button>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginBottom: "0.75rem" }}>
              Select categories that apply to this article.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {availableCategories.length === 0 ? (
                <div style={{ fontSize: "0.825rem", color: "var(--admin-text-muted)" }}>
                  No categories found. Click <strong>+ Manage / Add Categories</strong> above to add one in a modal.
                </div>
              ) : (
                availableCategories.map((c) => {
                  const active = ((form.category_ids as number[]) || []).includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.id)}
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
                      {active ? "✓ " : ""}{c.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <MediaUploadField
            label="Featured Cover Image"
            description="The primary banner image displayed on the blog post header and cards"
            value={form.featured_media_id}
            onChange={(mediaId) => setForm({ ...form, featured_media_id: mediaId })}
          />

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

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCategoriesChange={(newCats) => setAvailableCategories(newCats)}
      />
    </div>
  );
}
