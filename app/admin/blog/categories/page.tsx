"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { blogCategoriesApi } from "@/lib/admin-api/resources";
import { BlogCategoryResource } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";

export default function BlogCategoriesAdminPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<BlogCategoryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<BlogCategoryResource | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [deleteCatId, setDeleteCatId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogCategoriesApi.list({ per_page: 50 });
      setCategories(res.data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setModalOpen(true);
  };

  const openEditModal = (cat: BlogCategoryResource) => {
    setEditCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCategory) {
        await blogCategoriesApi.update(editCategory.id, { name, slug, description });
        showToast("Category updated successfully", "success");
      } else {
        await blogCategoriesApi.create({ name, slug, description });
        showToast("Category created successfully", "success");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || "Failed to save category", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCatId) return;
    try {
      await blogCategoriesApi.delete(deleteCatId);
      showToast("Category deleted successfully", "success");
      setDeleteCatId(null);
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || "Failed to delete category", "error");
    }
  };

  const columns: Column<BlogCategoryResource>[] = [
    {
      header: "Category Name",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>/{item.slug}</div>
        </div>
      ),
    },
    {
      header: "Description",
      render: (item) => item.description || "—",
    },
    {
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
      width: "120px",
    },
    {
      header: "Actions",
      render: (item) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => openEditModal(item)}>
            Edit
          </button>
          <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteCatId(item.id)}>
            Delete
          </button>
        </div>
      ),
      width: "180px",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <Link href="/admin/blog" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Blog Posts</Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
            Blog Categories
          </h1>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreateModal}>
          + Add Category
        </button>
      </div>

      <DataTable columns={columns} data={categories} loading={loading} />

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <h3 className="admin-card-title">{editCategory ? "Edit Category" : "New Category"}</h3>
              <button onClick={() => setModalOpen(false)} style={{ color: "#8b9baa", fontSize: "1.1rem" }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <FormGroup label="Category Name" required>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editCategory) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup label="Slug">
                  <input
                    type="text"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Description">
                  <textarea
                    className="admin-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormGroup>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                  {saving ? "Saving..." : editCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteCatId}
        title="Delete Blog Category"
        message="Are you sure you want to delete this category?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteCatId(null)}
      />
    </div>
  );
}
