"use client";

import React from "react";

export interface FormGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, required, error, hint, children }) => (
  <div className="admin-form-group">
    <label className="admin-label">
      {label}
      {required && <span className="required">*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.25rem" }}>{hint}</p>}
    {error && <p style={{ fontSize: "0.75rem", color: "var(--admin-danger)", marginTop: "0.25rem" }}>{error}</p>}
  </div>
);

export interface FormToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const FormToggle: React.FC<FormToggleProps> = ({ label, checked, onChange, description }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0" }}>
    <div>
      <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--admin-text-main)" }}>{label}</div>
      {description && <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{description}</div>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "var(--admin-accent)" : "var(--admin-border)",
        position: "relative",
        transition: "background 0.2s",
        border: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          transition: "left 0.2s",
        }}
      />
    </button>
  </div>
);
