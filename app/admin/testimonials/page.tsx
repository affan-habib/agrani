"use client";

import React, { useState, useEffect, useCallback } from "react";
import { testimonialsApi } from "@/lib/admin-api/resources";
import { TestimonialResource, StoreTestimonialRequest, UpdateTestimonialRequest } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { MediaUploadField } from "@/components/admin/MediaUploadField";

interface FormState {
  customer_name: string;
  customer_role: string;
  company: string;
  testimonial: string;
  rating: number;
  avatar_media_id?: number | null;
}

const initialForm: FormState = {
  customer_name: "",
  customer_role: "",
  company: "",
  testimonial: "",
  rating: 5,
  avatar_media_id: null,
};

export default function TestimonialsAdminPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<TestimonialResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialResource | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await testimonialsApi.list();
      setItems(res.data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item: TestimonialResource) => {
    setEditingItem(item);
    setForm({
      customer_name: item.customer_name || item.author_name || "",
      customer_role: item.customer_role || item.author_title || "",
      company: item.company || item.company_name || "",
      testimonial: item.testimonial || item.content || "",
      rating: item.rating || 5,
      avatar_media_id: item.avatar_media_id || item.avatar?.id || null,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await testimonialsApi.update(editingItem.id, form as UpdateTestimonialRequest);
        showToast("Testimonial updated successfully", "success");
      } else {
        await testimonialsApi.create(form as StoreTestimonialRequest);
        showToast("Testimonial created successfully", "success");
      }
      closeModal();
      fetchItems();
    } catch (err: any) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await testimonialsApi.delete(deleteId);
      showToast("Deleted successfully", "success");
      setDeleteId(null);
      fetchItems();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const columns: Column<TestimonialResource>[] = [
    {
      header: "Client & Company",
      render: (item) => {
        const name = item.customer_name || item.author_name || "Anonymous Client";
        const role = item.customer_role || item.author_title || "";
        const company = item.company || item.company_name || "";
        const subtitle = [role, company].filter(Boolean).join(" at ") || "Client";
        const avatarUrl = item.avatar?.url || item.avatar_media?.url;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid var(--admin-border)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  backgroundColor: "rgba(241, 89, 35, 0.12)",
                  color: "var(--admin-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{subtitle}</div>
              {item.rating && (
                <div style={{ color: "#f59e0b", fontSize: "0.75rem", marginTop: "0.15rem" }}>
                  {"★".repeat(Math.min(5, Math.max(1, item.rating)))}
                </div>
              )}
            </div>
          </div>
        );
      },
      width: "260px",
    },
    {
      header: "Review Testimonial",
      render: (item) => (
        <div
          style={{
            maxHeight: "3.6em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            fontSize: "0.85rem",
            color: "var(--admin-text-main)",
            lineHeight: 1.5,
          }}
          title={item.testimonial || item.content || ""}
        >
          {item.testimonial || item.content || <span style={{ color: "var(--admin-text-muted)" }}>No testimonial text</span>}
        </div>
      ),
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
          <button
            type="button"
            className="admin-btn admin-btn-sm admin-btn-secondary"
            onClick={() => openEditModal(item)}
          >
            Edit
          </button>
          <StatusActions
            currentStatus={item.status}
            onPublish={() => testimonialsApi.publish(item.id)}
            onUnpublish={() => testimonialsApi.unpublish(item.id)}
            onArchive={() => testimonialsApi.archive(item.id)}
            onSuccess={fetchItems}
          />
          <button
            type="button"
            className="admin-btn admin-btn-sm admin-btn-danger"
            onClick={() => setDeleteId(item.id)}
          >
            Delete
          </button>
        </div>
      ),
      width: "280px",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Testimonials & Reviews</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Client feedback and satisfaction endorsements displayed across the site
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openAddModal}>
          + Add Testimonial
        </button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} />

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 540 }}>
            <div className="admin-modal-header">
              <h3 className="admin-card-title">{editingItem ? "Edit Client Testimonial" : "Add Client Testimonial"}</h3>
              <button onClick={closeModal} style={{ color: "#8b9baa", fontSize: "1.1rem" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <MediaUploadField
                  label="Client Avatar / Photo"
                  description="Upload client headshot or company logo"
                  value={form.avatar_media_id}
                  initialMedia={editingItem?.avatar || editingItem?.avatar_media}
                  onChange={(mediaId) => setForm({ ...form, avatar_media_id: mediaId })}
                />

                <FormGroup label="Customer / Client Name" required>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    placeholder="e.g. Steve Smith"
                  />
                </FormGroup>

                <div className="admin-form-grid-2">
                  <FormGroup label="Designation / Role">
                    <input
                      type="text"
                      className="admin-input"
                      value={form.customer_role}
                      onChange={(e) => setForm({ ...form, customer_role: e.target.value })}
                      placeholder="e.g. Director or CTO"
                    />
                  </FormGroup>
                  <FormGroup label="Company / Organization">
                    <input
                      type="text"
                      className="admin-input"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Global Tech Ltd."
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Star Rating">
                  <select
                    className="admin-select"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </FormGroup>

                <FormGroup label="Testimonial / Review Text" required>
                  <textarea
                    required
                    className="admin-textarea"
                    style={{ minHeight: 110 }}
                    value={form.testimonial}
                    onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                    placeholder="Enter what the client said about Agrani..."
                  />
                </FormGroup>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                  {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
