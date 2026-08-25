const BACKEND_STORAGE_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL
  ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/v1\/?$/, "")
  : "";

export function resolveMediaUrl(mediaOrUrl?: unknown, decorativeFallback: string = ""): string {
  if (!mediaOrUrl) return decorativeFallback;
  
  const media = typeof mediaOrUrl === "object" ? mediaOrUrl as Record<string, unknown> : null;
  let urlStr = typeof mediaOrUrl === "string" ? mediaOrUrl : typeof media?.url === "string" ? media.url : "";
  if (!urlStr && media) {
    const candidate = media.path || media.file_path || media.src || media.original_url || media.full_url;
    urlStr = typeof candidate === "string" ? candidate : "";
  }
  if (!urlStr) return decorativeFallback;

  // The API explicitly marks seed media as placeholders; local artwork is decorative only.
  if (urlStr.includes("agrani-design-placeholder.png") || urlStr.includes("/seeders/")) {
    return decorativeFallback;
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

  return BACKEND_STORAGE_ORIGIN ? `${BACKEND_STORAGE_ORIGIN}/${urlStr}` : decorativeFallback;
}
