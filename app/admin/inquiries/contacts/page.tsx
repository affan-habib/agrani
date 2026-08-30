"use client";

import React, { useState, useEffect, useCallback } from "react";
import { quoteRequestsApi } from "@/lib/admin-api/submissions";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastNotification";
import { Mail, Phone, MapPin, Eye, Reply } from "lucide-react";

export default function ContactMessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMsg, setViewMsg] = useState<any | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteRequestsApi.list({ search, page, per_page: 15 });
      setMessages(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load inquiries", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, showToast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await quoteRequestsApi.updateStatus(id, status);
      showToast("Inquiry status updated", "success");
      if (viewMsg && viewMsg.id === id) {
        setViewMsg({ ...viewMsg, status });
      }
      fetchMessages();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Sender",
      render: (item) => {
        const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.name || "Anonymous";
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
      header: "Source & City",
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
      header: "Message Snippet",
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
      header: "Received",
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
          onClick={() => setViewMsg(item)}
          style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
        >
          <Eye size={14} />
          <span>View</span>
        </button>
      ),
      width: "100px",
    },
  ];

  const modalFullName = viewMsg
    ? `${viewMsg.first_name || ""} ${viewMsg.last_name || ""}`.trim() || viewMsg.name || "Inquiry"
    : "";

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", letterSpacing: "-0.02em" }}>
          Contact Inquiries &amp; Messages
        </h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Messages and inquiries submitted by visitors across contact forms and CTA sections
        </p>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search by name, email, phone or message..."
        searchValue={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
      />

      {viewMsg && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 580 }}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-card-title">{modalFullName}</h3>
                <p className="admin-card-desc">
                  Ref: {viewMsg.reference || `#${viewMsg.id}`} • {viewMsg.created_at ? new Date(viewMsg.created_at).toLocaleString() : ""}
                </p>
              </div>
              <button
                onClick={() => setViewMsg(null)}
                style={{ background: "none", border: "none", color: "var(--admin-text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Email</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Mail size={14} color="var(--admin-accent)" />
                    {viewMsg.email ? (
                      <a href={`mailto:${viewMsg.email}`} style={{ color: "var(--admin-accent)", fontSize: "0.875rem" }}>
                        {viewMsg.email}
                      </a>
                    ) : (
                      <span style={{ color: "var(--admin-text-muted)" }}>—</span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Phone</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Phone size={14} color="var(--admin-accent)" />
                    <span style={{ fontSize: "0.875rem" }}>{viewMsg.phone || "—"}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>City / Location</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={14} color="var(--admin-accent)" />
                    <span style={{ fontSize: "0.875rem" }}>{viewMsg.city || "—"}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Source Page</div>
                  <span style={{ fontSize: "0.875rem", textTransform: "capitalize", fontWeight: 500 }}>
                    {viewMsg.source_page || "Website"}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Message Content</div>
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
                  {viewMsg.message || viewMsg.project_details || "No message content provided."}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Update Status</div>
                <select
                  className="admin-select"
                  value={viewMsg.status || "new"}
                  onChange={(e) => handleStatusChange(viewMsg.id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed / Resolved</option>
                </select>
              </div>
            </div>

            <div className="admin-modal-footer">
              {viewMsg.email && (
                <a
                  href={`mailto:${viewMsg.email}?subject=${encodeURIComponent("Re: Inquiry with Agrani Technologies")}`}
                  className="admin-btn admin-btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Reply size={15} />
                  <span>Reply via Email</span>
                </a>
              )}
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setViewMsg(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
