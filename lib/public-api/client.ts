export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.30.27:8000/api/v1";
export const FRONTEND_TOKEN = process.env.NEXT_PUBLIC_FRONTEND_API_TOKEN || "agrani_frontend_api_token_2024";

export interface PublicFetchOptions extends RequestInit {
  params?: Record<string, any>;
  isMultipart?: boolean;
}

export async function publicFetch<T>(endpoint: string, options: PublicFetchOptions = {}): Promise<T> {
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
      const message = data?.error?.message || response.statusText || "Public API request failed";
      console.warn(`[Public API] ${init.method || "GET"} ${url} returned ${response.status}:`, message);
      throw new Error(message);
    }

    return data as T;
  } catch (err: any) {
    console.warn(`[Public API Error] ${init.method || "GET"} ${url}:`, err.message);
    throw err;
  }
}
