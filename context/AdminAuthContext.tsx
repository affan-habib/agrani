"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AdminUserResource, LoginRequest } from "@/types/admin";
import { adminAuthApi } from "@/lib/admin-api/auth";
import { getAdminToken, removeAdminToken } from "@/lib/admin-api/client";

interface AdminAuthContextType {
  user: AdminUserResource | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUserResource | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const savedToken = getAdminToken();
    if (!savedToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }

    setTokenState(savedToken);
    try {
      const adminUser = await adminAuthApi.me();
      setUser(adminUser);
    } catch (err) {
      console.warn("Failed to restore admin session:", err);
      removeAdminToken();
      setUser(null);
      setTokenState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const data = await adminAuthApi.login(credentials);
      const token = data.access_token || data.token || null;
      setTokenState(token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await adminAuthApi.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role) || user.roles.includes("admin") || user.roles.includes("super-admin");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.roles?.includes("super-admin") || user.roles?.includes("admin")) return true;
    return !!user.permissions?.includes(permission);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
