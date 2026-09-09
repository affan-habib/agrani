"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogCategoriesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/blog?categories=true");
  }, [router]);

  return (
    <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
      Loading Blog Categories...
    </div>
  );
}
