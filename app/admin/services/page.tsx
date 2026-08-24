"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { servicesApi } from "@/lib/admin-api/resources";
import { ServiceResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastNotification";

export default function ServicesAdminPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState<ServiceResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await servicesApi.list({ search, status, page, per_page: 15 });
      setServices(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, showToast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await servicesApi.delete(deleteId);
      showToast("Service deleted successfully", "success");
      setDeleteId(null);
      fetchServices();
    } catch (err: any) {
      showToast(err.message || "Failed to delete service", "error");
    }
  };

  const columns: Column<ServiceResource>[] = [
    {
      header: "Service Title",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>/{item.slug}</div>
        </div>
      ),
    },
    {
      header: "Short Description",
      render: (item) => item.short_description || "—",
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
            onPublish={() => servicesApi.publish(item.id)}
            onUnpublish={() => servicesApi.unpublish(item.id)}
            onArchive={() => servicesApi.archive(item.id)}
            onSuccess={fetchServices}
          />
          <Link href={`/admin/services/${item.id}`} className="admin-btn admin-btn-sm admin-btn-secondary">
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
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Services Management</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Agrani technology and consulting offerings, capabilities, and solutions
          </p>
        </div>
        <Link href="/admin/services/create" className="admin-btn admin-btn-primary">
          + Add New Service
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search services..."
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
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
