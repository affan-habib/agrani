"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { sectorsApi } from "@/lib/admin-api/resources";
import { SectorResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastNotification";

export default function SectorsAdminPage() {
  const { showToast } = useToast();
  const [sectors, setSectors] = useState<SectorResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchSectors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sectorsApi.list({ search, status, page, per_page: 15 });
      setSectors(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load sectors", "error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, showToast]);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await sectorsApi.delete(deleteId);
      showToast("Sector deleted successfully", "success");
      setDeleteId(null);
      fetchSectors();
    } catch (err: any) {
      showToast(err.message || "Failed to delete sector", "error");
    }
  };

  const columns: Column<SectorResource>[] = [
    {
      header: "Sector Title",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>/{item.slug}</div>
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
            onPublish={() => sectorsApi.publish(item.id)}
            onUnpublish={() => sectorsApi.unpublish(item.id)}
            onArchive={() => sectorsApi.archive(item.id)}
            onSuccess={fetchSectors}
          />
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
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Industry Sectors</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Target business sectors (Fintech, Telecom, Health, Manufacturing, etc.)
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sectors}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search sectors..."
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
        title="Delete Sector"
        message="Are you sure you want to delete this sector?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
