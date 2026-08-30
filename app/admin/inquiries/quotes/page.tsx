"use client";

import React, { useState, useEffect, useCallback } from "react";
import { quoteRequestsApi } from "@/lib/admin-api/submissions";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastNotification";
import { Mail, Phone, MapPin, Eye, Reply } from "lucide-react";

export default function QuoteRequestsPage() {
  const { showToast } = useToast();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewQuote, setViewQuote] = useState<any | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteRequestsApi.list({ search, page, per_page: 15 });
      setQuotes(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load quote requests", "error");
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

  const columns: Column<any>[] = [
    {
      header: "Client Name",
      render: (item) => {
        const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.name || "Client";
        return (
          <div>
            <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{fullName}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "2px" }}>
              {item.email && <span>{item.email}</span>}
              {item.phone && <span>• {item.phone}</span>}
            </div>
          </div>
        );
      },
    },
    {
      header: "Origin / City",
      render: (item) => (
        <div>
          <span style={{ textTransform: "capitalize", fontWeight: 500 }}>
            {item.source_page || "General"}
          </span>
          {item.city && (
            <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{item.city}</div>
          )}
        </div>
      ),
      width: "140px",
    },
    {
      header: "Requirements / Note",
      render: (item) => {
        const text = item.message || item.project_details || "";
        return (
          <span style={{ color: "var(--admin-text-muted)", fontSize: "0.825rem" }}>
            {text.length > 70 ? text.slice(0, 70) + "..." : text || "—"}
          </span>
        );
      },
    },
    {
      header: "Submitted",
      render: (item) => (
        <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      width: "110px",
    },
    {
      header: "Status",
      render: (item) => <StatusBadge status={item.status || "new"} />,
      width: "120px",
    },
    {
      header: "Actions",
      render: (item) => (
        <button
          type="button"
          className="admin-btn admin-btn-sm admin-btn-secondary"
          onClick={() => setViewQuote(item)}
          style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
        >
          <Eye size={14} />
          <span>Details</span>
        </button>
      ),
      width: "100px",
    },
  ];

  const modalFullName = viewQuote
    ? `${viewQuote.first_name || ""} ${viewQuote.last_name || ""}`.trim() || viewQuote.name || "Quote Request"
    : "";

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", letterSpacing: "-0.02em" }}>
          Quote Requests
        </h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Inquiries and quote requests submitted by prospective clients
        </p>
      </div>

      <DataTable
        columns={columns}
        data={quotes}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search by name, email, city or message..."
        searchValue={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
      />

      {viewQuote && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 580 }}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-card-title">{modalFullName}</h3>
                <p className="admin-card-desc">
                  Ref: {viewQuote.reference || `#${viewQuote.id}`} • {viewQuote.created_at ? new Date(viewQuote.created_at).toLocaleString() : ""}
                </p>
              </div>
              <button
                onClick={() => setViewQuote(null)}
                style={{ background: "none", border: "none", color: "var(--admin-text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Email Address</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Mail size={14} color="var(--admin-accent)" />
                    {viewQuote.email ? (
                      <a href={`mailto:${viewQuote.email}`} style={{ color: "var(--admin-accent)", fontSize: "0.875rem" }}>
                        {viewQuote.email}
                      </a>
                    ) : (
                      <span style={{ color: "var(--admin-text-muted)" }}>—</span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Phone Number</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Phone size={14} color="var(--admin-accent)" />
                    <span style={{ fontSize: "0.875rem" }}>{viewQuote.phone || "—"}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>City / Location</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={14} color="var(--admin-accent)" />
                    <span style={{ fontSize: "0.875rem" }}>{viewQuote.city || "—"}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Source Page</div>
                  <span style={{ fontSize: "0.875rem", textTransform: "capitalize", fontWeight: 500 }}>
                    {viewQuote.source_page || "Website"}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Requirement / Message</div>
                <div
                  style={{
                    background: "var(--admin-sidebar-bg)",
                    padding: "0.9rem",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    whiteSpace: "pre-wrap",
                    border: "1px solid var(--admin-border)",
                    lineHeight: 1.5,
                  }}
                >
                  {viewQuote.message || viewQuote.project_details || "No details provided."}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Update Status</div>
                <select
                  className="admin-select"
                  value={viewQuote.status || "new"}
                  onChange={(e) => handleStatusChange(viewQuote.id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed / Converted</option>
                </select>
              </div>
            </div>

            <div className="admin-modal-footer">
              {viewQuote.email && (
                <a
                  href={`mailto:${viewQuote.email}?subject=${encodeURIComponent("Re: Your Quote Request - Agrani Technologies")}`}
                  className="admin-btn admin-btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Reply size={15} />
                  <span>Send Proposal / Reply</span>
                </a>
              )}
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
