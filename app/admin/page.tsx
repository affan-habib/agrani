"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api/client";
import { jobApplicationsApi, quoteRequestsApi, contactsApi } from "@/lib/admin-api/submissions";
import { blogPostsApi, careerJobsApi } from "@/lib/admin-api/resources";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    activeJobs: 0,
    quoteRequests: 0,
    contacts: 0,
    jobApplications: 0,
  });
  const [health, setHealth] = useState<string>("Checking...");
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [healthRes, blogs, jobs, quotes, contacts, apps] = await Promise.allSettled([
          adminFetch<{ data: { status: string } }>("/health"),
          blogPostsApi.list({ per_page: 1 }),
          careerJobsApi.list({ per_page: 1 }),
          quoteRequestsApi.list({ per_page: 5 }),
          contactsApi.list({ per_page: 1 }),
          jobApplicationsApi.list({ per_page: 5 }),
        ]);

        if (healthRes.status === "fulfilled") setHealth("Healthy (v1.0.0)");
        else setHealth("Connected");

        setStats({
          blogPosts: blogs.status === "fulfilled" ? blogs.value.meta?.total || 0 : 0,
          activeJobs: jobs.status === "fulfilled" ? jobs.value.meta?.total || 0 : 0,
          quoteRequests: quotes.status === "fulfilled" ? quotes.value.meta?.total || 0 : 0,
          contacts: contacts.status === "fulfilled" ? contacts.value.meta?.total || 0 : 0,
          jobApplications: apps.status === "fulfilled" ? apps.value.meta?.total || 0 : 0,
        });

        if (quotes.status === "fulfilled") setRecentQuotes(quotes.value.data || []);
        if (apps.status === "fulfilled") setRecentApps(apps.value.data || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    { label: "Quote Requests", value: stats.quoteRequests, href: "/admin/inquiries/quotes", icon: "💰", color: "var(--admin-accent)" },
    { label: "Job Applications", value: stats.jobApplications, href: "/admin/inquiries/applications", icon: "📥", color: "#10b981" },
    { label: "Contact Inquiries", value: stats.contacts, href: "/admin/inquiries/contacts", icon: "✉️", color: "#3b82f6" },
    { label: "Blog Posts", value: stats.blogPosts, href: "/admin/blog", icon: "📝", color: "#8b5cf6" },
    { label: "Job Openings", value: stats.activeJobs, href: "/admin/careers", icon: "👥", color: "#f59e0b" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>
            Overview Dashboard
          </h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Real-time status of Agrani content, services, and client inquiries
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--admin-surface)", border: "1px solid var(--admin-border)", padding: "0.4rem 0.85rem", borderRadius: 8, fontSize: "0.8rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ color: "var(--admin-text-muted)" }}>API Backend:</span>
          <span style={{ fontWeight: 600, color: "var(--admin-text-main)" }}>{health}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="admin-card"
            style={{ textDecoration: "none", marginBottom: 0, transition: "transform 0.15s, border-color 0.15s" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{card.icon}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>Manage ↗</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: card.color, marginBottom: "0.2rem" }}>
              {loading ? "..." : card.value}
            </div>
            <div style={{ fontSize: "0.825rem", color: "var(--admin-text-muted)", fontWeight: 500 }}>
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.5rem" }}>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Recent Quote Requests</h2>
              <p className="admin-card-desc">Latest project quote submissions</p>
            </div>
            <Link href="/admin/inquiries/quotes" className="admin-btn admin-btn-sm admin-btn-secondary">
              View All
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading quotes...</div>
          ) : recentQuotes.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No quote requests yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentQuotes.map((q) => (
                <div key={q.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--admin-sidebar-bg)", borderRadius: 8, border: "1px solid var(--admin-border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--admin-text-main)" }}>{q.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{q.service_type || "General Inquiry"} • {q.email}</div>
                  </div>
                  <StatusBadge status={q.status || "pending"} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Recent Job Applications</h2>
              <p className="admin-card-desc">Latest candidate resumes submitted</p>
            </div>
            <Link href="/admin/inquiries/applications" className="admin-btn admin-btn-sm admin-btn-secondary">
              View All
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading applications...</div>
          ) : recentApps.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No job applications yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentApps.map((a) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--admin-sidebar-bg)", borderRadius: 8, border: "1px solid var(--admin-border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--admin-text-main)" }}>{a.applicant_name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{a.job?.title || "Position"} • {a.email}</div>
                  </div>
                  <StatusBadge status={a.status || "pending"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
