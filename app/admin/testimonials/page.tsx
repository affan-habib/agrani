"use client";

import React, { useState, useEffect, useCallback } from "react";
import { testimonialsApi } from "@/lib/admin-api/resources";
import { TestimonialResource } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

export default function TestimonialsAdminPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<TestimonialResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ author_name: "", author_title: "", company_name: "", content: "", rating: 5 });
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await testimonialsApi.create(form);
      showToast("Testimonial added", "success");
      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      showToast(err.message || "Failed to add testimonial", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await testimonialsApi.delete(deleteId);
      showToast("Deleted", "success");
      setDeleteId(null);
      fetchItems();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const columns: Column<TestimonialResource>[] = [
    {
      header: "Client & Company",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.author_name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
            {item.author_title || "Client"} {item.company_name ? `at ${item.company_name}` : ""}
          </div>
        </div>
      ),
    },
    { header: "Review Content", accessor: "content" },
    { header: "Status", render: (item) => <StatusBadge status={item.status} />, width: "120px" },
    {
      header: "Actions",
      render: (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <StatusActions
            currentStatus={item.status}
            onPublish={() => testimonialsApi.publish(item.id)}
            onUnpublish={() => testimonialsApi.unpublish(item.id)}
            onArchive={() => testimonialsApi.archive(item.id)}
            onSuccess={fetchItems}
          />
          <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(item.id)}>
            Delete
          </button>
        </div>
      ),
      width: "250px",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Testimonials & Reviews</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Client feedback and satisfaction endorsements
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setModalOpen(true)}>
          + Add Testimonial
        </button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} />

      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <h3 className="admin-card-title">Add Client Testimonial</h3>
              <button onClick={() => setModalOpen(false)} style={{ color: "#8b9baa", fontSize: "1.1rem" }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="admin-modal-body">
                <FormGroup label="Author Name" required>
                  <input type="text" required className="admin-input" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
                </FormGroup>
                <div className="admin-form-grid-2">
                  <FormGroup label="Author Designation">
                    <input type="text" className="admin-input" value={form.author_title} onChange={(e) => setForm({ ...form, author_title: e.target.value })} />
                  </FormGroup>
                  <FormGroup label="Company Name">
                    <input type="text" className="admin-input" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                  </FormGroup>
                </div>
                <FormGroup label="Review Testimonial" required>
                  <textarea required className="admin-textarea" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                </FormGroup>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
