"use client";

import React, { useState, useEffect, useCallback } from "react";
import { blogCategoriesApi } from "@/lib/admin-api/resources";
import { BlogCategoryResource } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Tags, Plus, Loader2, X, Edit2, Trash2 } from "lucide-react";

export interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesChange?: (categories: BlogCategoryResource[]) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  onCategoriesChange,
}) => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<BlogCategoryResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [editCategory, setEditCategory] = useState<BlogCategoryResource | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteCatId, setDeleteCatId] = useState<number | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogCategoriesApi.list({ per_page: 100 });
      const list = res.data || [];
      setCategories(list);
      onCategoriesChange?.(list);
    } catch (err: any) {
      showToast(err.message || "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, onCategoriesChange]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
  }, [isOpen, fetchCategories]);

  const resetForm = () => {
    setEditCategory(null);
    setName("");
    setSlug("");
    setDescription("");
  };

  const startEdit = (cat: BlogCategoryResource) => {
    setEditCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editCategory) {
        await blogCategoriesApi.update(editCategory.id, {
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
        });
        showToast("Category updated successfully", "success");
      } else {
        await blogCategoriesApi.create({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
        });
        showToast("Category created successfully", "success");
      }
      resetForm();
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
      if (editCategory && editCategory.id === deleteCatId) {
        resetForm();
      }
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || "Failed to delete category", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ maxWidth: 840, width: "95%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent)" }}>
              <Tags size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--admin-text-main)", margin: 0 }}>
                Manage Blog Categories
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", margin: 0 }}>
                Add, edit, or delete categories without leaving the page
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--admin-text-muted)",
              cursor: "pointer",
              fontSize: "1.25rem",
              padding: "0.25rem",
              lineHeight: 1,
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Left: Category list */}
          <div style={{ borderRight: "1px solid var(--admin-border)", paddingRight: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--admin-text-main)" }}>
                Categories ({categories.length})
              </span>
              {editCategory && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
                >
                  + New Category
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
                <Loader2 size={24} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginBottom: "0.5rem" }} />
                <div style={{ fontSize: "0.85rem" }}>Loading categories...</div>
              </div>
            ) : categories.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>
                No categories created yet. Add one using the form on the right.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "380px", overflowY: "auto" }}>
                {categories.map((cat) => {
                  const isSelected = editCategory?.id === cat.id;
                  return (
                    <div
                      key={cat.id}
                      style={{
                        padding: "0.7rem 0.85rem",
                        borderRadius: "8px",
                        border: isSelected ? "1.5px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                        background: isSelected ? "rgba(99, 102, 241, 0.08)" : "var(--admin-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{cat.name}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", fontWeight: 400 }}>({cat.posts_count ?? 0} posts)</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.15rem" }}>
                          /{cat.slug}
                        </div>
                        {cat.description && (
                          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.2rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {cat.description}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="admin-btn admin-btn-sm admin-btn-secondary"
                          style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem" }}
                          title="Edit Category"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCatId(cat.id)}
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem" }}
                          title="Delete Category"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--admin-text-main)", margin: 0 }}>
                {editCategory ? `Edit: ${editCategory.name}` : "Add New Category"}
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.2rem" }}>
                {editCategory ? "Modify category details and save" : "Create a new topic to organize blog posts"}
              </p>
            </div>

            <form onSubmit={handleSave}>
              <FormGroup label="Category Name" required hint="e.g. Technology, Cloud, Enterprise">
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="Enter category name..."
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    if (!editCategory) {
                      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                    }
                  }}
                />
              </FormGroup>

              <FormGroup label="URL Slug" hint="URL identifier (e.g. technology)">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="category-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Description" hint="Optional summary">
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: 75 }}
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormGroup>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                {editCategory && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="admin-btn admin-btn-secondary"
                    style={{ flex: 1, padding: "0.55rem" }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="admin-btn admin-btn-primary"
                  style={{ flex: 2, padding: "0.55rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.4rem" }}
                >
                  {saving ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Plus size={16} />
                  )}
                  <span>{saving ? "Saving..." : editCategory ? "Update Category" : "Add Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer" style={{ justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">
            Done
          </button>
        </div>

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={!!deleteCatId}
          title="Delete Blog Category"
          message="Are you sure you want to delete this category? Any posts linked to this category will have their category unlinked."
          isDanger
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteCatId(null)}
        />
      </div>
    </div>
  );
};
