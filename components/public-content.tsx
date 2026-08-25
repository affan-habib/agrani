"use client";

import Image from "next/image";
import { resolveMediaUrl } from "@/lib/public-api/media";
import type { PublicMedia } from "@/types/public";

export function EmptyContent({ message }: { message: string }) {
  return <div className="api-empty-state" role="status">{message}</div>;
}

export function ContentImage({
  media,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
  decorativeFallback,
}: {
  media?: PublicMedia | string | null;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  decorativeFallback?: string;
}) {
  const src = resolveMediaUrl(media, decorativeFallback);

  if (!src) {
    return <div className={[className, "api-media-unavailable"].filter(Boolean).join(" ")} aria-label="Image unavailable" />;
  }

  return (
    <Image
      src={src}
      alt={alt || (typeof media === "object" && media?.alt_text) || ""}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("http")}
    />
  );
}

export function isApiArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}
