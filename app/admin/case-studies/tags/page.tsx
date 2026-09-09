"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CaseStudyTagsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/case-studies?tab=tags");
  }, [router]);

  return (
    <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
      Loading Case Study Tags...
    </div>
  );
}
