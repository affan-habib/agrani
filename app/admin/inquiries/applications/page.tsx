"use client";

import React, { useState, useEffect, useCallback } from "react";
import { jobApplicationsApi } from "@/lib/admin-api/submissions";
import { JobApplicationResource, PaginationMeta, JobApplicationStatus } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastNotification";

export default function JobApplicationsPage() {
  const { showToast } = useToast();
  const [apps, setApps] = useState<JobApplicationResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewApp, setViewApp] = useState<JobApplicationResource | null>(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobApplicationsApi.list({ search, page, per_page: 15 });
      setApps(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, showToast]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleStatusChange = async (id: number, status: JobApplicationStatus) => {
    try {
      await jobApplicationsApi.updateStatus(id, status);
      showToast("Application status updated", "success");
      if (viewApp && viewApp.id === id) {
        setViewApp({ ...viewApp, status });
      }
      fetchApps();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const columns: Column<JobApplicationResource>[] = [
    {
      header: "Candidate",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.applicant_name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
            {item.email} • {item.phone}
          </div>
        </div>
      ),
    },
    { header: "Applied Position", render: (item) => item.job?.title || "Position" },
    { header: "Status", render: (item) => <StatusBadge status={item.status} />, width: "120px" },
    {
      header: "Resume",
      render: (item) => (
        item.resume_url ? (
          <a href={item.resume_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--admin-accent)", fontSize: "0.85rem", textDecoration: "underline" }}>
            View Resume ↗
          </a>
        ) : "—"
      ),
      width: "120px",
    },
    {
      header: "Actions",
      render: (item) => (
        <button type="button" className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => setViewApp(item)}>
          Review Candidate
        </button>
      ),
      width: "150px",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Job Applications</h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
          Candidate submissions, resumes, cover letters, and applicant tracking
        </p>
      </div>

      <DataTable
        columns={columns}
        data={apps}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search candidate name or email..."
        searchValue={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
      />

      {viewApp && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 600 }}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-card-title">{viewApp.applicant_name}</h3>
                <p className="admin-card-desc">Applied for: {viewApp.job?.title || "Position"}</p>
              </div>
              <button onClick={() => setViewApp(null)} style={{ color: "#8b9baa", fontSize: "1.1rem" }}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Email</div>
                  <div><a href={`mailto:${viewApp.email}`} style={{ color: "var(--admin-accent)" }}>{viewApp.email}</a></div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Phone Number</div>
                  <div>{viewApp.phone}</div>
                </div>
              </div>

              {viewApp.cover_letter && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Cover Letter</div>
                  <div style={{ background: "var(--admin-sidebar-bg)", padding: "0.85rem", borderRadius: 8, fontSize: "0.875rem", whiteSpace: "pre-wrap", border: "1px solid var(--admin-border)" }}>
                    {viewApp.cover_letter}
                  </div>
                </div>
              )}

              {viewApp.resume_url && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <a
                    href={viewApp.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    📄 Download / Open Candidate Resume PDF ↗
                  </a>
                </div>
              )}

              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Applicant Status</div>
                <select
                  className="admin-select"
                  value={viewApp.status}
                  onChange={(e) => handleStatusChange(viewApp.id, e.target.value as any)}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setViewApp(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
