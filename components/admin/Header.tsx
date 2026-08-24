"use client";

import React from "react";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";

export const Header: React.FC = () => {
  const { user, logout } = useAdminAuth();

  return (
    <header className="admin-header">
      <div className="admin-breadcrumbs">
        <Link href="/admin">Admin</Link>
        <span>/</span>
        <span style={{ color: "var(--admin-text-main)" }}>Management Console</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-sm admin-btn-secondary"
          style={{ textDecoration: "none" }}
        >
          View Public Site ↗
        </a>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--admin-text-main)" }}>
                {user.name || "Administrator"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--admin-text-muted)" }}>
                {user.email}
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="admin-btn admin-btn-sm admin-btn-danger"
              title="Sign Out"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
