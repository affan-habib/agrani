"use client";

import React from "react";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminThemeProvider } from "@/context/AdminThemeContext";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminAuthProvider>
        <AdminLayout>{children}</AdminLayout>
      </AdminAuthProvider>
    </AdminThemeProvider>
  );
}
