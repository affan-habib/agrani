"use client";

import React, { useState, useEffect, useCallback } from "react";
import { rbacApi } from "@/lib/admin-api/rbac";
import { RoleResource, PermissionResource } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/ToastNotification";

export default function RolesPermissionsPage() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState<RoleResource[]>([]);
  const [permissions, setPermissions] = useState<PermissionResource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([rbacApi.getRoles(), rbacApi.getPermissions()]);
      setRoles(r || []);
      setPermissions(p || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load access control", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const roleColumns: Column<RoleResource>[] = [
    { header: "Role Name", render: (item) => <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{item.name}</span> },
    { header: "Display Name", render: (item) => item.display_name || item.name },
    { header: "Description", accessor: "description" },
  ];

  const permColumns: Column<PermissionResource>[] = [
    { header: "Permission Name", render: (item) => <code style={{ color: "var(--admin-accent)", background: "var(--admin-sidebar-bg)", padding: "2px 6px", borderRadius: 4 }}>{item.name}</code> },
    { header: "Group", render: (item) => <span style={{ textTransform: "capitalize" }}>{item.group || "General"}</span> },
    { header: "Display Name", accessor: "display_name" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Roles & Permissions</h1>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
          Granular role-based access control and system permissions
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <h2 className="admin-card-title" style={{ marginBottom: "1rem" }}>System Roles</h2>
          <DataTable columns={roleColumns} data={roles} loading={loading} />
        </div>

        <div>
          <h2 className="admin-card-title" style={{ marginBottom: "1rem" }}>Available Permissions</h2>
          <DataTable columns={permColumns} data={permissions} loading={loading} />
        </div>
      </div>
    </div>
  );
}
