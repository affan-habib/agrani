"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useToast } from "@/components/admin/ToastNotification";
import "@/app/admin/admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      showToast("Welcome back to Agrani Admin!", "success");
      router.push("/admin");
    } catch (err: any) {
      const msg = err.message || "Invalid email or password.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-root theme-dark"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top center, #192631 0%, #090e13 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        color: "#f3f6f8",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        className="admin-card"
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(18, 28, 36, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid #1f303f",
          borderRadius: 16,
          padding: "2.25rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⚡</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f3f6f8" }}>Agrani Admin</h1>
          <p style={{ fontSize: "0.85rem", color: "#8b9baa", marginTop: "0.35rem" }}>
            Sign in to access the control panel
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label className="admin-label">Email Address</label>
            <input
              type="email"
              required
              className="admin-input"
              placeholder="admin@agrani.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label className="admin-label">Password</label>
            <input
              type="password"
              required
              className="admin-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem" }}
          >
            {loading ? "Signing in..." : "Sign In to Admin"}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid #1f303f" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#8b9baa", marginBottom: "0.75rem", textAlign: "center", fontWeight: 600 }}>
            ⚡ Quick Login Demo Roles
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { role: "Super Admin", email: "superadmin1@example.com", badge: "Superadmin", color: "#f15827" },
              { role: "Administrator", email: "admin1@example.com", badge: "Admin", color: "#3b82f6" },
              { role: "Content Editor", email: "editor1@example.com", badge: "Editor", color: "#10b981" },
            ].map((preset) => (
              <button
                key={preset.email}
                type="button"
                disabled={loading}
                onClick={async () => {
                  setEmail(preset.email);
                  setPassword("Password@123");
                  setLoading(true);
                  setError(null);
                  try {
                    await login({ email: preset.email, password: "Password@123" });
                    showToast(`Logged in as ${preset.role}!`, "success");
                    router.push("/admin");
                  } catch (err: any) {
                    const msg = err.message || "Failed to log in.";
                    setError(msg);
                    showToast(msg, "error");
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 0.85rem",
                  background: "#0d141b",
                  border: "1px solid #1f303f",
                  borderRadius: 8,
                  color: "#f3f6f8",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = preset.color;
                  e.currentTarget.style.background = "#192631";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1f303f";
                  e.currentTarget.style.background = "#0d141b";
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#f3f6f8" }}>{preset.role}</div>
                  <div style={{ fontSize: "0.7rem", color: "#8b9baa" }}>{preset.email}</div>
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: `${preset.color}22`,
                    color: preset.color,
                    fontWeight: 600,
                  }}
                >
                  Sign In →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
