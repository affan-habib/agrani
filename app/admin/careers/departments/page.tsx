"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { departmentsApi } from "@/lib/admin-api/resources";
import { DepartmentResource } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

export default function DepartmentsAdminPage() {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<DepartmentResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await departmentsApi.list();
      setDepartments(res.data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load departments", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await departmentsApi.create({ name, description });
      showToast("Department created successfully", "success");
      setName("");
      setDescription("");
      fetchDepartments();
    } catch (err: any) {
      showToast(err.message || "Failed to create department", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await departmentsApi.delete(deleteId);
      showToast("Department deleted", "success");
      setDeleteId(null);
      fetchDepartments();
    } catch (err: any) {
      showToast(err.message || "Failed to delete department", "error");
    }
  };

  const columns: Column<DepartmentResource>[] = [
    { header: "Department Name", render: (item) => <span style={{ fontWeight: 600 }}>{item.name}</span> },
    { header: "Description", render: (item) => item.description || "—" },
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
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/careers" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Job Openings</Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
          Company Departments
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
        <DataTable columns={columns} data={departments} loading={loading} />

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1rem" }}>Add Department</h2>
          <form onSubmit={handleCreate}>
            <FormGroup label="Name" required>
              <input
                type="text"
                required
                className="admin-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Engineering"
              />
            </FormGroup>
            <FormGroup label="Description">
              <textarea
                className="admin-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ width: "100%" }}>
              {saving ? "Saving..." : "Add Department"}
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Department"
        message="Are you sure you want to delete this department?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
