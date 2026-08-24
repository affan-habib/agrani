"use client";

import React, { useState, useEffect, useCallback } from "react";
import { newsletterSubscribersApi } from "@/lib/admin-api/submissions";
import { NewsletterSubscriberResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastNotification";

export default function NewsletterSubscribersPage() {
  const { showToast } = useToast();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await newsletterSubscribersApi.list({ search, page, per_page: 20 });
      setSubscribers(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load subscribers", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, showToast]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const toggleStatus = async (item: NewsletterSubscriberResource) => {
    const newStatus = item.status === "subscribed" ? "unsubscribed" : "subscribed";
    try {
      await newsletterSubscribersApi.updateStatus(item.id, newStatus);
      showToast(`Subscriber marked as ${newStatus}`, "success");
      fetchSubs();
    } catch (err: any) {
      showToast(err.message || "Failed to update subscriber", "error");
    }
  };

  const columns: Column<NewsletterSubscriberResource>[] = [
    { header: "Email Address", render: (item) => <span style={{ fontWeight: 600 }}>{item.email}</span> },
    { header: "First Name", render: (item) => item.first_name || "—" },
    { header: "Subscribed Date", render: (item) => new Date(item.subscribed_at || item.created_at).toLocaleDateString() },
    { header: "Status", render: (item) => <StatusBadge status={item.status} />, width: "120px" },
    {
      header: "Actions",
      render: (item) => (
        <button
          type="button"
          className="admin-btn admin-btn-sm admin-btn-secondary"
          onClick={() => toggleStatus(item)}
        >
          {item.status === "subscribed" ? "Unsubscribe" : "Re-subscribe"}
        </button>
      ),
      width: "140px",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Newsletter Subscribers</h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
          Email subscribers list from blog and footer newsletter forms
        </p>
      </div>

      <DataTable
        columns={columns}
        data={subscribers}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search subscriber emails..."
        searchValue={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
      />
    </div>
  );
}
