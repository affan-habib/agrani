"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { caseStudiesApi } from "@/lib/admin-api/resources";
import { CaseStudyResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastNotification";

export default function CaseStudiesAdminPage() {
  const { showToast } = useToast();
  const [studies, setStudies] = useState<CaseStudyResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchStudies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await caseStudiesApi.list({ search, status, page, per_page: 15 });
      setStudies(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load case studies", "error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, showToast]);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await caseStudiesApi.delete(deleteId);
      showToast("Case study deleted successfully", "success");
      setDeleteId(null);
      fetchStudies();
    } catch (err: any) {
      showToast(err.message || "Failed to delete case study", "error");
    }
  };

  const columns: Column<CaseStudyResource>[] = [
    {
      header: "Case Study Title",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
            Client: {item.client_name || "Confidential"} • Sector: {item.sector?.title || "General"}
          </div>
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
          <StatusActions
            currentStatus={item.status}
            onPublish={() => caseStudiesApi.publish(item.id)}
            onUnpublish={() => caseStudiesApi.unpublish(item.id)}
            onArchive={() => caseStudiesApi.archive(item.id)}
            onSuccess={fetchStudies}
          />
          <Link href={`/admin/case-studies/${item.id}`} className="admin-btn admin-btn-sm admin-btn-secondary">
            Edit
          </Link>
          <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(item.id)}>
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
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Case Studies</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Client success stories, solutions, results, and impact metrics
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/case-studies/tags" className="admin-btn admin-btn-secondary">
            Manage Tags
          </Link>
          <Link href="/admin/case-studies/create" className="admin-btn admin-btn-primary">
            + New Case Study
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={studies}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search case studies..."
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
        isOpen={!!deleteId}
        title="Delete Case Study"
        message="Are you sure you want to delete this case study?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
