import { adminFetch } from "./client";
import { ApiResponse, RoleResource, PermissionResource } from "@/types/admin";

export const rbacApi = {
  getPermissions: async (): Promise<PermissionResource[]> => {
    const res = await adminFetch<ApiResponse<PermissionResource[]>>("/admin/permissions");
    return res.data;
  },

  getRoles: async (): Promise<RoleResource[]> => {
    const res = await adminFetch<ApiResponse<RoleResource[]>>("/admin/roles");
    return res.data;
  },

  syncRolePermissions: async (roleId: number, permissions: (number | string)[]): Promise<RoleResource> => {
    const payload = permissions.map((p) => (typeof p === "number" ? p : isNaN(Number(p)) ? p : Number(p)));
    const res = await adminFetch<ApiResponse<RoleResource>>(`/admin/roles/${roleId}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissions: payload }),
    });
    return res.data;
  },

  syncUserRoles: async (userId: number, roles: (number | string)[]): Promise<any> => {
    const payload = roles.map((r) => (typeof r === "number" ? r : isNaN(Number(r)) ? r : Number(r)));
    const res = await adminFetch<ApiResponse<any>>(`/admin/users/${userId}/roles`, {
      method: "PUT",
      body: JSON.stringify({ roles: payload }),
    });
    return res.data;
  },
};
