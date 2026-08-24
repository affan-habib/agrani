"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { caseStudyTagsApi } from "@/lib/admin-api/resources";
import { CaseStudyTagResource } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

export default function CaseStudyTagsPage() {
  const { showToast } = useToast();
  const [tags, setTags] = useState<CaseStudyTagResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await caseStudyTagsApi.list();
      setTags(res.data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load tags", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await caseStudyTagsApi.create({ name });
      showToast("Tag created successfully", "success");
      setName("");
      fetchTags();
    } catch (err: any) {
      showToast(err.message || "Failed to create tag", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await caseStudyTagsApi.delete(deleteId);
      showToast("Tag deleted", "success");
      setDeleteId(null);
      fetchTags();
    } catch (err: any) {
      showToast(err.message || "Failed to delete tag", "error");
    }
  };

  const columns: Column<CaseStudyTagResource>[] = [
    { header: "Tag Name", render: (item) => <span style={{ fontWeight: 600 }}>{item.name}</span> },
    { header: "Slug", render: (item) => `/${item.slug}` },
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
        <Link href="/admin/case-studies" style={{ fontSize: "0.85rem", color: "var(--admin-accent)" }}>← Back to Case Studies</Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", marginTop: "0.25rem" }}>
          Case Study Tags
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
        <DataTable columns={columns} data={tags} loading={loading} />

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: "1rem" }}>Add Tag</h2>
          <form onSubmit={handleCreate}>
            <FormGroup label="Tag Name" required>
              <input
                type="text"
                required
                className="admin-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fintech"
              />
            </FormGroup>
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ width: "100%" }}>
              {saving ? "Saving..." : "Add Tag"}
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Tag"
        message="Are you sure you want to delete this tag?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
