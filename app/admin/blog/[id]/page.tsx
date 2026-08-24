"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { blogPostsApi } from "@/lib/admin-api/resources";
import { BlogPostResource, UpdateBlogPostRequest } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = Number(params.id);

  const [post, setPost] = useState<BlogPostResource | null>(null);
  const [form, setForm] = useState<UpdateBlogPostRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await blogPostsApi.get(id);
        setPost(data);
        setForm({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || "",
          body: data.body || "",
          status: data.status,
          is_featured: data.is_featured,
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
        });
      } catch (err: any) {
        showToast(err.message || "Failed to load post", "error");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await blogPostsApi.update(id, form);
      setPost(updated);
      showToast("Post updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save post", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading post details...</div>;
  }

  if (!post) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-danger)" }}>Blog post not found.</div>;
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <Link href="/admin/blog" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Blog Posts</Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
            Edit Blog Post
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <StatusBadge status={post.status} />
          <StatusActions
            currentStatus={post.status}
            onPublish={() => blogPostsApi.publish(post.id)}
            onUnpublish={() => blogPostsApi.unpublish(post.id)}
            onArchive={() => blogPostsApi.archive(post.id)}
            onSuccess={async () => {
              const updated = await blogPostsApi.get(id);
              setPost(updated);
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>Article Details</h2>
          <FormGroup label="Post Title" required>
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

          <FormGroup label="Short Excerpt" required>
            <textarea
              required
              className="admin-textarea"
              style={{ minHeight: 80 }}
              value={form.excerpt || ""}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Article Content">
            <textarea
              className="admin-textarea"
              style={{ minHeight: 280, fontFamily: "monospace" }}
              value={form.body || ""}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </FormGroup>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1.25rem" }}>SEO Metadata</h2>
          <FormGroup label="SEO Meta Title">
            <input
              type="text"
              className="admin-input"
              value={form.seo_title || ""}
              onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
            />
          </FormGroup>
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
            {saving ? "Saving Changes..." : "Update Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
