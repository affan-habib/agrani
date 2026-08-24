"use client";

import React, { useState, useEffect, useCallback } from "react";
import { quoteRequestsApi } from "@/lib/admin-api/submissions";
import { QuoteRequestResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastNotification";

export default function QuoteRequestsPage() {
  const { showToast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRequestResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewQuote, setViewQuote] = useState<QuoteRequestResource | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteRequestsApi.list({ search, page, per_page: 15 });
      setQuotes(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load quotes", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, showToast]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await quoteRequestsApi.updateStatus(id, status);
      showToast("Quote status updated", "success");
      if (viewQuote && viewQuote.id === id) {
        setViewQuote({ ...viewQuote, status });
      }
      fetchQuotes();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const columns: Column<QuoteRequestResource>[] = [
    {
      header: "Client & Company",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
            {item.company || "Individual"} • {item.email} {item.phone ? `(${item.phone})` : ""}
          </div>
        </div>
      ),
    },
    { header: "Service Type", render: (item) => item.service_type || "General" },
    { header: "Budget", render: (item) => item.budget_range || "Not specified" },
    { header: "Status", render: (item) => <StatusBadge status={item.status || "pending"} />, width: "120px" },
    {
      header: "Actions",
      render: (item) => (
        <button type="button" className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => setViewQuote(item)}>
          View Details
        </button>
      ),
      width: "120px",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Quote Requests</h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
          Client project inquiries, budget specifications, and requirements
        </p>
      </div>

      <DataTable
        columns={columns}
        data={quotes}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search quote requests..."
        searchValue={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
      />

      {viewQuote && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 580 }}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-card-title">Quote Request #{viewQuote.id}</h3>
                <p className="admin-card-desc">{new Date(viewQuote.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewQuote(null)} style={{ color: "#8b9baa", fontSize: "1.1rem" }}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Client Name</div>
                  <div style={{ fontWeight: 600 }}>{viewQuote.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Company</div>
                  <div style={{ fontWeight: 600 }}>{viewQuote.company || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Email Address</div>
                  <div><a href={`mailto:${viewQuote.email}`} style={{ color: "var(--admin-accent)" }}>{viewQuote.email}</a></div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Phone</div>
                  <div>{viewQuote.phone || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Service Type</div>
                  <div>{viewQuote.service_type || "General"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Budget Range</div>
                  <div>{viewQuote.budget_range || "Flexible"}</div>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Project Details</div>
                <div style={{ background: "var(--admin-sidebar-bg)", padding: "0.85rem", borderRadius: 8, fontSize: "0.875rem", whiteSpace: "pre-wrap", border: "1px solid var(--admin-border)" }}>
                  {viewQuote.project_details}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Update Status</div>
                <select
                  className="admin-select"
                  value={viewQuote.status || "pending"}
                  onChange={(e) => handleStatusChange(viewQuote.id, e.target.value)}
                >
                  <option value="pending">Pending Review</option>
                  <option value="in_discussion">In Discussion</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="resolved">Resolved / Closed</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setViewQuote(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
