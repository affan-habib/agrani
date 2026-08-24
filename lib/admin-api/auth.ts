import { adminFetch, setAdminToken, removeAdminToken } from "./client";
import { AdminLoginResource, AdminUserResource, LoginRequest, ApiResponse } from "@/types/admin";

export const adminAuthApi = {
  login: async (credentials: LoginRequest): Promise<AdminLoginResource> => {
    const res = await adminFetch<ApiResponse<AdminLoginResource>>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({
        ...credentials,
        device_name: credentials.device_name || "Admin Panel (Browser)",
      }),
    });
    const token = res.data?.access_token || res.data?.token;
    if (token) {
      setAdminToken(token);
    }
    return res.data;
  },

  me: async (): Promise<AdminUserResource> => {
    const res = await adminFetch<ApiResponse<AdminUserResource>>("/admin/auth/me", {
      method: "GET",
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await adminFetch("/admin/auth/logout", {
        method: "POST",
      });
    } finally {
      removeAdminToken();
    }
  },
};
