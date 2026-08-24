import { adminFetch } from "./client";
import { ApiResponse, ApiPaginatedResponse, MediaResource, UpdateMediaRequest } from "@/types/admin";

export interface MediaListParams {
  search?: string;
  mime_type?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

export const mediaApi = {
  list: async (params?: MediaListParams): Promise<ApiPaginatedResponse<MediaResource>> => {
    return adminFetch<ApiPaginatedResponse<MediaResource>>("/admin/media", {
      params,
    });
  },

  get: async (id: number): Promise<MediaResource> => {
    const res = await adminFetch<ApiResponse<MediaResource>>(`/admin/media/${id}`);
    return res.data;
  },

  upload: async (file: File, meta?: { alt_text?: string; title?: string; caption?: string }): Promise<MediaResource> => {
    const formData = new FormData();
    formData.append("file", file);
    if (meta?.alt_text) formData.append("alt_text", meta.alt_text);
    if (meta?.title) formData.append("title", meta.title);
    if (meta?.caption) formData.append("caption", meta.caption);

    const res = await adminFetch<ApiResponse<MediaResource>>("/admin/media", {
      method: "POST",
      body: formData,
      isMultipart: true,
    });
    return res.data;
  },

  update: async (id: number, data: UpdateMediaRequest): Promise<MediaResource> => {
    const res = await adminFetch<ApiResponse<MediaResource>>(`/admin/media/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await adminFetch(`/admin/media/${id}`, {
      method: "DELETE",
    });
  },
};
