"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { rbacApi } from "@/lib/admin-api/rbac";
import { RoleResource, PermissionResource } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import {
  ShieldCheck,
  Lock,
  Search,
  Loader2,
  X,
  Key,
  Check,
  AlertTriangle,
  Sliders,
  Sparkles,
} from "lucide-react";

export default function RolesPermissionsPage() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState<RoleResource[]>([]);
  const [permissions, setPermissions] = useState<PermissionResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Permission Configuration Modal State
  const [activeRole, setActiveRole] = useState<RoleResource | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([rbacApi.getRoles(), rbacApi.getPermissions()]);
      setRoles(r || []);
      setPermissions(p || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load access control data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Permissions Modal for a Role
  const openConfigureModal = (role: RoleResource) => {
    setActiveRole(role);
    setSearchQuery("");

    // Identify which permission IDs this role currently has
    const activeIds = new Set<number>();
    const rolePerms = role.permissions || [];

    rolePerms.forEach((rp: any) => {
      if (typeof rp === "number") {
        activeIds.add(rp);
      } else if (typeof rp === "string") {
        const found = permissions.find((p) => p.name === rp || String(p.id) === rp);
        if (found) activeIds.add(found.id);
      } else if (typeof rp === "object" && rp !== null && rp.id) {
        activeIds.add(Number(rp.id));
      }
    });

    setSelectedPermissionIds(activeIds);
    setModalOpen(true);
  };

  const closeConfigureModal = () => {
    setModalOpen(false);
    setActiveRole(null);
    setSelectedPermissionIds(new Set());
  };

  const togglePermission = (permId: number) => {
    const updated = new Set(selectedPermissionIds);
    if (updated.has(permId)) {
      updated.delete(permId);
    } else {
      updated.add(permId);
    }
    setSelectedPermissionIds(updated);
  };

  // Group permissions by resource or prefix
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, PermissionResource[]> = {};
    permissions.forEach((perm) => {
      let grp = perm.group || perm.resource;
      if (!grp) {
        const parts = perm.name.split(".");
        grp = parts.length > 1 ? parts[0] : "general";
      }
      grp = grp.toLowerCase();
      if (!groups[grp]) groups[grp] = [];
      groups[grp].push(perm);
    });
    return groups;
  }, [permissions]);

  // Filter permissions based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedPermissions;
    const q = searchQuery.toLowerCase();
    const result: Record<string, PermissionResource[]> = {};

    Object.entries(groupedPermissions).forEach(([groupName, permList]) => {
      const matched = permList.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.display_name && p.display_name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          groupName.includes(q)
      );
      if (matched.length > 0) {
        result[groupName] = matched;
      }
    });
    return result;
  }, [groupedPermissions, searchQuery]);

  const toggleGroupPermissions = (groupPerms: PermissionResource[]) => {
    const allSelected = groupPerms.every((p) => selectedPermissionIds.has(p.id));
    const updated = new Set(selectedPermissionIds);
    if (allSelected) {
      groupPerms.forEach((p) => updated.delete(p.id));
    } else {
      groupPerms.forEach((p) => updated.add(p.id));
    }
    setSelectedPermissionIds(updated);
  };

  const selectAllPermissions = () => {
    setSelectedPermissionIds(new Set(permissions.map((p) => p.id)));
  };

  const deselectAllPermissions = () => {
    setSelectedPermissionIds(new Set());
  };

  // Save Permissions to Backend
  const handleSavePermissions = async () => {
    if (!activeRole) return;
    setSaving(true);
    try {
      const idsArray = Array.from(selectedPermissionIds);
      const updated = await rbacApi.syncRolePermissions(activeRole.id, idsArray);

      // Update local role list
      setRoles((prev) =>
        prev.map((r) =>
          r.id === activeRole.id
            ? {
                ...r,
                permissions: updated.permissions || idsArray,
              }
            : r
        )
      );

      showToast(`Permissions updated for role "${activeRole.display_name || activeRole.name}"!`, "success");
      closeConfigureModal();
    } catch (err: any) {
      showToast(err.message || "Failed to update role permissions", "error");
    } finally {
      setSaving(false);
    }
  };

  // Count active permissions for each role
  const getRolePermissionCount = (role: RoleResource): number => {
    const rPerms = role.permissions || [];
    return rPerms.length;
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent)" }}>
            <ShieldCheck size={20} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)", letterSpacing: "-0.02em" }}>
            Roles &amp; Permissions
          </h1>
        </div>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
          Manage role authorization rules and assign fine-grained permissions to system roles using interactive controls.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="admin-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(99, 102, 241, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent)" }}>
            <Lock size={22} />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--admin-text-main)", lineHeight: 1 }}>
              {roles.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", marginTop: "0.25rem" }}>
              Configured Roles
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(16, 185, 129, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
            <Key size={22} />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--admin-text-main)", lineHeight: 1 }}>
              {permissions.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", marginTop: "0.25rem" }}>
              Total Permissions Vocabulary
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(245, 158, 11, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--admin-text-main)", lineHeight: 1 }}>
              {Object.keys(groupedPermissions).length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", marginTop: "0.25rem" }}>
              Permission Modules
            </div>
          </div>
        </div>
      </div>

      {/* 1. Interactive Roles Table */}
      <div className="admin-card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h2 className="admin-card-title" style={{ fontSize: "1.15rem" }}>
              System Roles &amp; Grants
            </h2>
            <p style={{ color: "var(--admin-text-muted)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
              Click <strong>Configure Permissions</strong> on any role to customize its access privileges.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
            <Loader2 size={28} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginBottom: "0.5rem" }} />
            <div>Loading roles and permissions...</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 200 }}>Role Name</th>
                  <th style={{ minWidth: 140 }}>Slug / Key</th>
                  <th>Description</th>
                  <th style={{ minWidth: 150 }}>Assigned Grants</th>
                  <th style={{ minWidth: 160, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => {
                  const permCount = getRolePermissionCount(role);
                  return (
                    <tr key={role.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 600, color: "var(--admin-text-main)", textTransform: "capitalize" }}>
                            {role.display_name || role.name}
                          </span>
                          {role.is_system && (
                            <span
                              style={{
                                fontSize: "0.68rem",
                                padding: "0.15rem 0.45rem",
                                borderRadius: 4,
                                background: "rgba(245, 158, 11, 0.12)",
                                color: "#f59e0b",
                                fontWeight: 600,
                              }}
                            >
                              System
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <code style={{ fontSize: "0.8rem", color: "var(--admin-accent)", background: "rgba(99, 102, 241, 0.08)", padding: "0.15rem 0.45rem", borderRadius: 4 }}>
                          {role.slug || role.name}
                        </code>
                      </td>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>
                        {role.description || "—"}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.2rem 0.6rem",
                            borderRadius: 12,
                            background: permCount > 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                            color: permCount > 0 ? "#10b981" : "#ef4444",
                            fontWeight: 600,
                          }}
                        >
                          {permCount} {permCount === 1 ? "grant" : "grants"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => openConfigureModal(role)}
                          className="admin-btn admin-btn-sm admin-btn-primary"
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.8rem" }}
                        >
                          <Sliders size={13} />
                          <span>Configure Permissions</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Permission Vocabulary Reference Table */}
      <div className="admin-card">
        <h2 className="admin-card-title" style={{ marginBottom: "0.5rem", fontSize: "1.15rem" }}>
          Registered Permission Vocabulary
        </h2>
        <p style={{ color: "var(--admin-text-muted)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
          All capabilities registered in the Agrani backend security kernel.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Permission Key</th>
                <th style={{ minWidth: 140 }}>Module / Resource</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.id}>
                  <td>
                    <code style={{ fontSize: "0.8rem", color: "var(--admin-accent)", background: "rgba(99, 102, 241, 0.08)", padding: "0.15rem 0.45rem", borderRadius: 4 }}>
                      {perm.name}
                    </code>
                  </td>
                  <td>
                    <span style={{ textTransform: "capitalize", fontSize: "0.85rem", color: "var(--admin-text-main)", fontWeight: 500 }}>
                      {perm.group || perm.resource || "General"}
                    </span>
                  </td>
                  <td style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>
                    {perm.description || perm.display_name || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Role Permissions Configuration Modal */}
      {modalOpen && activeRole && (
        <div className="admin-modal-overlay" onClick={closeConfigureModal}>
          <div
            className="admin-modal"
            style={{ maxWidth: 860, width: "95%", maxHeight: "88vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="admin-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent)" }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--admin-text-main)", margin: 0 }}>
                    Configure: {activeRole.display_name || activeRole.name}
                  </h2>
                  <p style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", margin: "0.15rem 0 0 0" }}>
                    Select the operations and capabilities allowed for this role.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeConfigureModal}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--admin-text-muted)",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                  padding: "0.25rem",
                  lineHeight: 1,
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Controls Bar */}
            <div
              style={{
                padding: "0.75rem 1.5rem",
                borderBottom: "1px solid var(--admin-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                background: "var(--admin-sidebar-bg)",
              }}
            >
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-muted)" }} />
                <input
                  type="text"
                  placeholder="Filter permissions..."
                  className="admin-input"
                  style={{ paddingLeft: "2rem", fontSize: "0.825rem", height: 34 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={selectAllPermissions}
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllPermissions}
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Modal Body: Grouped Permissions List */}
            <div className="admin-modal-body" style={{ maxHeight: "55vh", overflowY: "auto", padding: "1.25rem 1.5rem" }}>
              {activeRole.is_system && (
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    borderRadius: 8,
                    padding: "0.75rem 1rem",
                    marginBottom: "1.25rem",
                    fontSize: "0.825rem",
                    color: "var(--admin-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <AlertTriangle size={16} style={{ color: "#f59e0b", flexShrink: 0 }} />
                  <span>
                    <strong>System Role:</strong> This is a core administrative role. Removing critical permissions may restrict administrative access.
                  </span>
                </div>
              )}

              {Object.keys(filteredGroups).length === 0 ? (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
                  No permissions match your filter &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {Object.entries(filteredGroups).map(([groupName, groupPerms]) => {
                    const allInGroup = groupPerms.every((p) => selectedPermissionIds.has(p.id));
                    const someInGroup = groupPerms.some((p) => selectedPermissionIds.has(p.id));

                    return (
                      <div
                        key={groupName}
                        style={{
                          border: "1px solid var(--admin-border)",
                          borderRadius: 10,
                          padding: "1rem",
                          background: "var(--admin-surface)",
                        }}
                      >
                        {/* Group Header with toggle */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--admin-text-main)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              {groupName}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", fontWeight: 500 }}>
                              ({groupPerms.filter((p) => selectedPermissionIds.has(p.id)).length} / {groupPerms.length})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleGroupPermissions(groupPerms)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--admin-accent)",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              padding: "0.2rem 0.4rem",
                            }}
                          >
                            {allInGroup ? "Deselect Group" : "Select Group"}
                          </button>
                        </div>

                        {/* Grid of Permission Items */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.6rem" }}>
                          {groupPerms.map((perm) => {
                            const isChecked = selectedPermissionIds.has(perm.id);
                            return (
                              <label
                                key={perm.id}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "0.6rem",
                                  padding: "0.6rem 0.75rem",
                                  borderRadius: 8,
                                  border: isChecked ? "1.5px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                                  background: isChecked ? "rgba(99, 102, 241, 0.08)" : "transparent",
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.id)}
                                  style={{ marginTop: 2, cursor: "pointer", accentColor: "var(--admin-accent)" }}
                                />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--admin-text-main)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                    {perm.display_name || perm.name}
                                  </div>
                                  <code style={{ fontSize: "0.72rem", color: "var(--admin-text-muted)", display: "block", marginTop: 2 }}>
                                    {perm.name}
                                  </code>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="admin-modal-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>
                Selected: <strong style={{ color: "var(--admin-text-main)" }}>{selectedPermissionIds.size}</strong> of {permissions.length} grants
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={closeConfigureModal}
                  disabled={saving}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem" }}
                >
                  {saving ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Check size={16} />
                  )}
                  <span>{saving ? "Saving Grants..." : "Save Role Permissions"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
