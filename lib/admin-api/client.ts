import { ApiErrorResponse, ApiError } from "@/types/admin";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.30.27:8000/api/v1";

const TOKEN_KEY = "agrani_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  // Store in cookie for middleware server-side route protection
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
}

export function removeAdminToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  // Expire cookie
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export class AdminApiError extends Error {
  code: string;
  fields?: Record<string, string[]>;
  status: number;

  constructor(message: string, code: string, status: number, fields?: Record<string, string[]>) {
    super(message);
    this.name = "AdminApiError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  isMultipart?: boolean;
}

export async function adminFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, isMultipart, headers: customHeaders, ...init } = options;
  
  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes("?") ? "&" : "?") + qs;
    }
  }

  const token = getAdminToken();
  const frontendToken = process.env.NEXT_PUBLIC_FRONTEND_API_TOKEN || "agrani_frontend_api_token_2024";
  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  if (frontendToken && !headers.has("X-Frontend-API-Token")) {
    headers.set("X-Frontend-API-Token", frontendToken);
  }

  if (!isMultipart && !headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const isPublicRoute = !endpoint.startsWith("/admin") && !endpoint.includes("/admin/");

  if (!isPublicRoute && token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  let data: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    // Only redirect to login if session restoration failed on /admin/auth/me or explicit unauthenticated error
    if (response.status === 401 && (endpoint.includes("/admin/auth/me") || (!isPublicRoute && data?.error?.code === "UNAUTHENTICATED"))) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
        removeAdminToken();
        window.location.href = "/admin/login";
      }
    }

    if (data && data.error) {
      const err = data as ApiErrorResponse;
      throw new AdminApiError(
        err.error.message || "An API error occurred",
        err.error.code || "UNKNOWN_ERROR",
        response.status,
        err.error.fields
      );
    }

    throw new AdminApiError(
      typeof data === "string" ? data : response.statusText || "Request failed",
      `HTTP_${response.status}`,
      response.status
    );
  }

  return data as T;
}
