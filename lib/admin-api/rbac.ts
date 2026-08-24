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

  syncRolePermissions: async (roleId: number, permissions: string[]): Promise<RoleResource> => {
    const res = await adminFetch<ApiResponse<RoleResource>>(`/admin/roles/${roleId}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
    return res.data;
  },

  syncUserRoles: async (userId: number, roles: string[]): Promise<any> => {
    const res = await adminFetch<ApiResponse<any>>(`/admin/users/${userId}/roles`, {
      method: "PUT",
      body: JSON.stringify({ roles }),
    });
    return res.data;
  },
};
