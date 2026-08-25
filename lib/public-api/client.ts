export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const FRONTEND_TOKEN = process.env.NEXT_PUBLIC_FRONTEND_API_TOKEN;

export interface PublicFetchOptions extends RequestInit {
  params?: Record<string, unknown>;
  isMultipart?: boolean;
}

export async function publicFetch<T>(endpoint: string, options: PublicFetchOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

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

  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  if (FRONTEND_TOKEN && !headers.has("X-Frontend-API-Token")) {
    headers.set("X-Frontend-API-Token", FRONTEND_TOKEN);
  }

  if (!isMultipart && !headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      cache: init.method && init.method !== "GET" ? init.cache : (init.cache ?? "no-store"),
      ...init,
      headers,
    });

    if (response.status === 204) {
      return {} as T;
    }

    let data: unknown = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }

    if (!response.ok) {
      const payload = data && typeof data === "object" ? data as { error?: { message?: string } } : null;
      const message = payload?.error?.message || response.statusText || "Public API request failed";
      console.warn(`[Public API] ${init.method || "GET"} ${url} returned ${response.status}:`, message);
      throw new Error(message);
    }

    return data as T;
  } catch (reason) {
    const error = reason instanceof Error ? reason : new Error("Public API request failed");
    console.warn(`[Public API Error] ${init.method || "GET"} ${url}:`, error.message);
    throw error;
  }
}
