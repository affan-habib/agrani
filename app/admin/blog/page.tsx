"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { blogPostsApi } from "@/lib/admin-api/resources";
import { BlogPostResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastNotification";

export default function BlogPostsAdminPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPostResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogPostsApi.list({ search, status, page, per_page: 15 });
      setPosts(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, showToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deletePostId) return;
    try {
      await blogPostsApi.delete(deletePostId);
      showToast("Post deleted successfully", "success");
      setDeletePostId(null);
      fetchPosts();
    } catch (err: any) {
      showToast(err.message || "Failed to delete post", "error");
    }
  };

  const columns: Column<BlogPostResource>[] = [
    {
      header: "Title & Slug",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>/{item.slug}</div>
        </div>
      ),
    },
    {
      header: "Author",
      render: (item) => item.author?.full_name || "—",
    },
    {
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
      width: "120px",
    },
    {
      header: "Actions",
      render: (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <StatusActions
            currentStatus={item.status}
            onPublish={() => blogPostsApi.publish(item.id)}
            onUnpublish={() => blogPostsApi.unpublish(item.id)}
            onArchive={() => blogPostsApi.archive(item.id)}
            onSuccess={fetchPosts}
          />
          <Link href={`/admin/blog/${item.id}`} className="admin-btn admin-btn-sm admin-btn-secondary">
            Edit
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn-sm admin-btn-danger"
            onClick={() => setDeletePostId(item.id)}
          >
            Delete
          </button>
        </div>
      ),
      width: "300px",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Blog Posts</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Create, edit, and publish technical and corporate blog articles
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/blog/categories" className="admin-btn admin-btn-secondary">
            Manage Categories
          </Link>
          <Link href="/admin/blog/create" className="admin-btn admin-btn-primary">
            + New Blog Post
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search blog posts..."
        searchValue={search}
        onSearchChange={setSearch}
        statusFilterValue={status}
        statusFilterOptions={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
          { label: "Archived", value: "archived" },
        ]}
        onStatusFilterChange={setStatus}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={!!deletePostId}
        title="Delete Blog Post"
        message="Are you sure you want to permanently delete this blog post? This action cannot be undone."
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeletePostId(null)}
      />
    </div>
  );
}
