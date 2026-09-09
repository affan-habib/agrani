import Link from "next/link";
import { ThemePage, GradientButton } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";

export default async function NotFound() {
  let siteSettings;
  try {
    const home = await publicApi.getHome();
    siteSettings = home.site_settings;
  } catch {
    // fallback
  }

  return (
    <ThemePage active="404" siteSettings={siteSettings} includeContact={false}>
      <section
        className="container"
        style={{
          padding: "5rem 0 7rem",
          textAlign: "center",
          minHeight: "55vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "clamp(4rem, 10vw, 6.5rem)",
            fontWeight: 800,
            color: "var(--accent)",
            lineHeight: 1,
            marginBottom: "1rem",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "1rem", color: "var(--text)" }}>
          Page Not Found
        </h1>
        <p style={{ maxWidth: 540, color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          We could not find the page you were looking for. It might have been relocated, updated, or temporarily taken offline.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <GradientButton href="/">Return to Home</GradientButton>
          <Link
            href="/services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0 1.5rem",
              height: "46px",
              borderRadius: "999px",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontWeight: 500,
              fontSize: "0.95rem",
              background: "var(--surface)",
              transition: "border-color 0.2s ease, transform 0.2s ease",
            }}
          >
            Explore Services
          </Link>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0 1.5rem",
              height: "46px",
              borderRadius: "999px",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontWeight: 500,
              fontSize: "0.95rem",
              background: "var(--surface)",
              transition: "border-color 0.2s ease, transform 0.2s ease",
            }}
          >
            Contact Support
          </Link>
        </div>
      </section>
    </ThemePage>
  );
}
