"use client";

import React, { useState, useEffect, useCallback } from "react";
import { contactsApi } from "@/lib/admin-api/submissions";
import { ContactMessageResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastNotification";

export default function ContactMessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessageResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMsg, setViewMsg] = useState<ContactMessageResource | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contactsApi.list({ search, page, per_page: 15 });
      setMessages(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, showToast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await contactsApi.updateStatus(id, status);
      showToast("Message status updated", "success");
      if (viewMsg && viewMsg.id === id) {
        setViewMsg({ ...viewMsg, status });
      }
      fetchMessages();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const columns: Column<ContactMessageResource>[] = [
    {
      header: "Sender",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{item.name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{item.email}</div>
        </div>
      ),
    },
    { header: "Subject / Topic", render: (item) => item.subject || item.service_interest || "General" },
    {
      header: "Message Snippet",
      render: (item) => (
        <span style={{ color: "var(--admin-text-muted)", fontSize: "0.825rem" }}>
          {item.message.slice(0, 60)}...
        </span>
      ),
    },
    { header: "Status", render: (item) => <StatusBadge status={item.status || "unread"} />, width: "120px" },
    {
      header: "Actions",
      render: (item) => (
        <button type="button" className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => setViewMsg(item)}>
          Read Message
        </button>
      ),
      width: "120px",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Contact Messages</h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
          General inquiries submitted through the contact us form
        </p>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search messages..."
        searchValue={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
      />

      {viewMsg && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 560 }}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-card-title">Message from {viewMsg.name}</h3>
                <p className="admin-card-desc">{viewMsg.email}</p>
              </div>
              <button onClick={() => setViewMsg(null)} style={{ color: "#8b9baa", fontSize: "1.1rem" }}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Subject</div>
                <div style={{ fontWeight: 600 }}>{viewMsg.subject || viewMsg.service_interest || "General Inquiry"}</div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Message Body</div>
                <div style={{ background: "var(--admin-sidebar-bg)", padding: "0.85rem", borderRadius: 8, fontSize: "0.875rem", whiteSpace: "pre-wrap", border: "1px solid var(--admin-border)" }}>
                  {viewMsg.message}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "0.35rem" }}>Update Status</div>
                <select
                  className="admin-select"
                  value={viewMsg.status || "unread"}
                  onChange={(e) => handleStatusChange(viewMsg.id, e.target.value)}
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <a href={`mailto:${viewMsg.email}?subject=Re: ${encodeURIComponent(viewMsg.subject || "Your Agrani Inquiry")}`} className="admin-btn admin-btn-primary">
                Reply via Email ↗
              </a>
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
