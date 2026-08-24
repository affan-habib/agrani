"use client";

import React, { useState, useEffect, useCallback } from "react";
import { whyChooseUsApi } from "@/lib/admin-api/resources";
import { WhyChooseUsItemResource } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

export default function WhyChooseUsAdminPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<WhyChooseUsItemResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await whyChooseUsApi.list();
      setItems(res.data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load items", "error");
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
      await whyChooseUsApi.create(form);
      showToast("Item added successfully", "success");
      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      showToast(err.message || "Failed to add item", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await whyChooseUsApi.delete(deleteId);
      showToast("Deleted", "success");
      setDeleteId(null);
      fetchItems();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const columns: Column<WhyChooseUsItemResource>[] = [
    { header: "Card Title", render: (item) => <span style={{ fontWeight: 600 }}>{item.title}</span> },
    { header: "Description", accessor: "description" },
    {
      header: "Actions",
      render: (item) => (
        <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(item.id)}>
          Delete
        </button>
      ),
      width: "120px",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Why Choose Us Cards</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Key differentiators, strengths, and competitive advantages shown on homepage
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setModalOpen(true)}>
          + Add Item
        </button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} />

      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 480 }}>
            <div className="admin-modal-header">
              <h3 className="admin-card-title">Add Why Choose Us Card</h3>
              <button onClick={() => setModalOpen(false)} style={{ color: "#8b9baa", fontSize: "1.1rem" }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="admin-modal-body">
                <FormGroup label="Title" required>
                  <input type="text" required className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </FormGroup>
                <FormGroup label="Description" required>
                  <textarea required className="admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </FormGroup>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Item"
        message="Are you sure you want to delete this differentiator card?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
