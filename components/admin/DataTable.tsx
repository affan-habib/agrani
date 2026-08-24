"use client";

import React from "react";
import { PaginationMeta } from "@/types/admin";

export interface Column<T> {
  header: string;
  accessor?: keyof T | string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  meta?: PaginationMeta;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  statusFilterValue?: string;
  statusFilterOptions?: { label: string; value: string }[];
  onStatusFilterChange?: (val: string) => void;
  onPageChange?: (page: number) => void;
  actions?: React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<T extends { id?: number | string }>({
  columns,
  data,
  loading,
  meta,
  searchPlaceholder = "Search records...",
  searchValue,
  onSearchChange,
  statusFilterValue,
  statusFilterOptions,
  onStatusFilterChange,
  onPageChange,
  actions,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  return (
    <div className="admin-table-container">
      {(onSearchChange || onStatusFilterChange || actions) && (
        <div className="admin-table-toolbar">
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flex: 1, minWidth: 260 }}>
            {onSearchChange && (
              <input
                type="text"
                className="admin-input"
                style={{ maxWidth: 280 }}
                placeholder={searchPlaceholder}
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            )}
            {onStatusFilterChange && statusFilterOptions && (
              <select
                className="admin-select"
                style={{ maxWidth: 160 }}
                value={statusFilterValue || ""}
                onChange={(e) => onStatusFilterChange(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusFilterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width }}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", padding: "3rem", color: "var(--admin-text-muted)" }}>
                  Loading records...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", padding: "3rem", color: "var(--admin-text-muted)" }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr key={item.id ?? rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render
                        ? col.render(item)
                        : col.accessor
                        ? String((item as any)[col.accessor] ?? "—")
                        : "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.last_page > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.25rem", borderTop: "1px solid var(--admin-border)", background: "var(--admin-sidebar-bg)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
            Showing {meta.from || 0} to {meta.to || 0} of {meta.total} entries
          </div>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-secondary"
              disabled={meta.current_page <= 1}
              onClick={() => onPageChange && onPageChange(meta.current_page - 1)}
            >
              Previous
            </button>
            <span style={{ display: "flex", alignItems: "center", padding: "0 0.5rem", fontSize: "0.8rem", color: "var(--admin-text-main)" }}>
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-secondary"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => onPageChange && onPageChange(meta.current_page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
