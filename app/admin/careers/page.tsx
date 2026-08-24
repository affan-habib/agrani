"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { careerJobsApi } from "@/lib/admin-api/resources";
import { CareerJobResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastNotification";

export default function CareersAdminPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<CareerJobResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await careerJobsApi.list({ search, status, page, per_page: 15 });
      setJobs(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load job listings", "error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, showToast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async () => {
    if (!deleteJobId) return;
    try {
      await careerJobsApi.delete(deleteJobId);
      showToast("Job opening deleted successfully", "success");
      setDeleteJobId(null);
      fetchJobs();
    } catch (err: any) {
      showToast(err.message || "Failed to delete job", "error");
    }
  };

  const columns: Column<CareerJobResource>[] = [
    {
      header: "Position Title",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
            {item.employment_type} • {item.work_mode} {item.location ? `(${item.location})` : ""}
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      render: (item) => item.department?.name || "—",
    },
    {
      header: "Opening Type",
      render: (item) => <span style={{ textTransform: "capitalize" }}>{item.opening_type}</span>,
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
            onPublish={() => careerJobsApi.publish(item.id)}
            onUnpublish={() => careerJobsApi.unpublish(item.id)}
            onArchive={() => careerJobsApi.archive(item.id)}
            onSuccess={fetchJobs}
          />
          <Link href={`/admin/careers/${item.id}`} className="admin-btn admin-btn-sm admin-btn-secondary">
            Edit
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn-sm admin-btn-danger"
            onClick={() => setDeleteJobId(item.id)}
          >
            Delete
          </button>
        </div>
      ),
      width: "300px",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Career Job Openings</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Manage positions, internships, requirements, and job deadlines
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/careers/departments" className="admin-btn admin-btn-secondary">
            Departments
          </Link>
          <Link href="/admin/careers/create" className="admin-btn admin-btn-primary">
            + Post Job Opening
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={jobs}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search positions..."
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
        isOpen={!!deleteJobId}
        title="Delete Job Opening"
        message="Are you sure you want to delete this position?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteJobId(null)}
      />
    </div>
  );
}
