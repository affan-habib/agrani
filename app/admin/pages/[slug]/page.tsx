"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SingletonPageEditorRedirect() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);

  useEffect(() => {
    router.replace(`/admin/pages?tab=${slug}`);
  }, [slug, router]);

  return (
    <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
      Loading editor...
    </div>
  );
}
