const BACKEND_STORAGE_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL
  ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/v1\/?$/, "")
  : "http://192.168.30.27:8000";

export function resolveMediaUrl(mediaOrUrl?: any, fallback: string = ""): string {
  if (!mediaOrUrl) return fallback;
  
  let urlStr = typeof mediaOrUrl === "string" ? mediaOrUrl : mediaOrUrl.url;
  if (!urlStr && typeof mediaOrUrl === "object") {
    urlStr = mediaOrUrl.path || mediaOrUrl.file_path || mediaOrUrl.src || mediaOrUrl.original_url || mediaOrUrl.full_url;
  }
  if (!urlStr) return fallback;

  // If backend returned a 1x1 placeholder seeder image, prefer high-res Figma design fallback
  if (urlStr.includes("agrani-design-placeholder.png") || urlStr.includes("/seeders/")) {
    return fallback || urlStr;
  }

  // Fix malformed protocol like "http:192.168.30.27" -> "http://192.168.30.27"
  if (urlStr.startsWith("http:") && !urlStr.startsWith("http://")) {
    urlStr = urlStr.replace(/^http:/, "http://");
  } else if (urlStr.startsWith("https:") && !urlStr.startsWith("https://")) {
    urlStr = urlStr.replace(/^https:/, "https://");
  }

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
