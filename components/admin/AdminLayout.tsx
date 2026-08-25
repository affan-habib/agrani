"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastProvider } from "./ToastNotification";
import "@/app/admin/admin.css";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { theme } = useAdminTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isLoginPage) {
        router.replace("/admin/login");
      } else if (isAuthenticated && isLoginPage) {
        router.replace("/admin");
      }
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // If on login page
  if (isLoginPage) {
    // If authenticated user visits login page, withhold login form and redirect
    if (isAuthenticated) {
      return (
        <div className="admin-loading-screen" data-theme={theme}>
          <div className="admin-loading-card">
            <div className="admin-loading-spinner" />
            <div className="admin-loading-text">Redirecting to Dashboard...</div>
          </div>
        </div>
      );
    }
    return <ToastProvider>{children}</ToastProvider>;
  }

  // If loading authentication state
  if (isLoading) {
    return (
      <div className="admin-loading-screen" data-theme={theme}>
        <div className="admin-loading-card">
          <div className="admin-loading-brand">
            <span className="admin-loading-icon">⚡</span>
            <span className="admin-loading-title">AGRANI ADMIN</span>
          </div>
          <div className="admin-loading-spinner" />
          <div className="admin-loading-text">Verifying session...</div>
        </div>
      </div>
    );
  }

  // If unauthenticated on a protected page, NEVER render protected children or sidebar
  if (!isAuthenticated) {
    return (
      <div className="admin-loading-screen" data-theme={theme}>
        <div className="admin-loading-card">
          <div className="admin-loading-spinner" />
          <div className="admin-loading-text">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  // Authenticated user on protected page
  return (
    <ToastProvider>
      <div className={`admin-root theme-${theme}`} data-theme={theme}>
        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div
            className="admin-mobile-backdrop"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
        )}

        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

        <div className="admin-main-wrapper">
          <Header onToggleMobile={() => setMobileOpen((prev) => !prev)} mobileOpen={mobileOpen} />
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
};

