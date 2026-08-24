"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastProvider } from "./ToastNotification";
import "@/app/admin/admin.css";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (isLoading) {
    return (
      <div
        className="admin-root"
        style={{ alignItems: "center", justifyContent: "center", height: "100vh" }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--admin-accent)" }}>⚡</div>
          <div style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem" }}>Loading Agrani Admin...</div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="admin-root">
        <Sidebar />
        <div className="admin-main-wrapper">
          <Header />
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
};
