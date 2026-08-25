const BACKEND_STORAGE_ORIGIN = "http://192.168.30.27:8000";

export function resolveMediaUrl(mediaOrUrl?: string | { url?: string } | null, fallback: string = ""): string {
  if (!mediaOrUrl) return fallback;
  
  const urlStr = typeof mediaOrUrl === "string" ? mediaOrUrl : mediaOrUrl.url;
  if (!urlStr) return fallback;

  if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
    return urlStr;
  }

  if (urlStr.startsWith("/")) {
    if (urlStr.startsWith("/assets/") || urlStr.startsWith("/images/") || urlStr.startsWith("/favicon")) {
      return urlStr;
    }
    return `${BACKEND_STORAGE_ORIGIN}${urlStr}`;
  }

  return `${BACKEND_STORAGE_ORIGIN}/${urlStr}`;
}
