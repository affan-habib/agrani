"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { blogPostsApi } from "@/lib/admin-api/resources";
import { BlogPostResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastNotification";
import { CategoryManagerModal } from "@/components/admin/CategoryManagerModal";
import { Tags, Plus } from "lucide-react";

export default function BlogPostsAdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<BlogPostResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);

  // Auto-open modal if URL query param exists
  useEffect(() => {
    if (searchParams.get("categories") === "true" || searchParams.get("manageCategories") === "true") {
      setCategoriesModalOpen(true);
    }
  }, [searchParams]);

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

  const handleCloseCategoriesModal = () => {
    setCategoriesModalOpen(false);
    if (searchParams.get("categories") === "true") {
      router.replace("/admin/blog", { scroll: false });
    }
    fetchPosts();
  };

  const columns: Column<BlogPostResource>[] = [
    {
      header: "Title & Category",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)", fontSize: "0.925rem" }}>{item.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.2rem", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
            <span>/{item.slug}</span>
            {((item.categories && item.categories.length > 0) ? item.categories : item.category ? [item.category] : []).map((cat) => (
              <span
                key={cat.id || cat.name}
                style={{
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "var(--admin-accent)",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              >
                {cat.name}
              </span>
            ))}
          </div>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Blog Posts</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Create, edit, and publish technical and corporate blog articles
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setCategoriesModalOpen(true)}
            className="admin-btn admin-btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}
          >
            <Tags size={16} />
            <span>Manage Categories</span>
          </button>
          <Link href="/admin/blog/create" className="admin-btn admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Plus size={16} />
            <span>+ New Blog Post</span>
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

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={categoriesModalOpen}
        onClose={handleCloseCategoriesModal}
      />
    </div>
  );
}
