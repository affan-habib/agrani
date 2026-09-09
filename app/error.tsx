"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root Error Boundary]:", error);
  }, [error]);

  const { dark } = useTheme();

  return (
    <main
      className={`site ${dark ? "dark" : "light"} api-error-page`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <section
        className="api-empty-state"
        style={{
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          padding: "3rem 2rem",
          borderRadius: 20,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--accent-soft, rgba(241, 88, 39, 0.12))",
            color: "var(--accent, #f15827)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            margin: "0 auto 1.5rem",
          }}
        >
          ⚠️
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text)" }}>
          Something went wrong
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: 1.6, fontSize: "0.95rem" }}>
          We encountered an unexpected error while loading this page. You can retry the request or return to the homepage.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            className="gradient-button"
            onClick={reset}
            style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              padding: "0.75rem 1.75rem",
              fontSize: "0.95rem",
              borderRadius: 10,
              background: "var(--surface-2)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              transition: "opacity 0.2s ease",
            }}
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
