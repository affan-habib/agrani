"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { caseStudiesApi } from "@/lib/admin-api/resources";
import { CaseStudyResource, PaginationMeta } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastNotification";
import { TagManagerModal } from "@/components/admin/TagManagerModal";
import { Bookmark, Plus } from "lucide-react";

export default function CaseStudiesAdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [studies, setStudies] = useState<CaseStudyResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleteCaseId, setDeleteCaseId] = useState<number | null>(null);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);

  // Auto-open modal if URL query param exists
  useEffect(() => {
    if (searchParams.get("tags") === "true" || searchParams.get("tab") === "tags") {
      setTagsModalOpen(true);
    }
  }, [searchParams]);

  const fetchStudies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await caseStudiesApi.list({ search, status, page, per_page: 15 });
      setStudies(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load case studies", "error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, showToast]);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const handleDeleteCase = async () => {
    if (!deleteCaseId) return;
    try {
      await caseStudiesApi.delete(deleteCaseId);
      showToast("Case study deleted successfully", "success");
      setDeleteCaseId(null);
      fetchStudies();
    } catch (err: any) {
      showToast(err.message || "Failed to delete case study", "error");
    }
  };

  const handleCloseTagsModal = () => {
    setTagsModalOpen(false);
    if (searchParams.get("tags") === "true" || searchParams.get("tab") === "tags") {
      router.replace("/admin/case-studies", { scroll: false });
    }
    fetchStudies();
  };

  const caseColumns: Column<CaseStudyResource>[] = [
    {
      header: "Case Study Title",
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--admin-text-main)", fontSize: "0.925rem" }}>{item.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.2rem" }}>
            Client: <span style={{ color: "var(--admin-text-main)" }}>{item.client_name || "Confidential"}</span>
            {item.sector?.title && <> • Sector: <span style={{ color: "var(--admin-text-main)" }}>{item.sector.title}</span></>}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem" }}>
              {item.tags.map((t) => (
                <span
                  key={t.id || t.name}
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "4px",
                    background: "rgba(99, 102, 241, 0.1)",
                    color: "var(--admin-accent)",
                    fontWeight: 500,
                  }}
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
      width: "120px",
    },
    {
      header: "Actions",
      render: (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <StatusActions
            currentStatus={item.status}
            onPublish={() => caseStudiesApi.publish(item.id)}
            onUnpublish={() => caseStudiesApi.unpublish(item.id)}
            onArchive={() => caseStudiesApi.archive(item.id)}
            onSuccess={fetchStudies}
          />
          <Link href={`/admin/case-studies/${item.id}`} className="admin-btn admin-btn-sm admin-btn-secondary">
            Edit
          </Link>
          <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteCaseId(item.id)}>
            Delete
          </button>
        </div>
      ),
      width: "280px",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>
            Case Studies
          </h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Client success stories, solutions, results, and classification tags
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setTagsModalOpen(true)}
            className="admin-btn admin-btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}
          >
            <Bookmark size={16} />
            <span>Manage Tags</span>
          </button>
          <Link href="/admin/case-studies/create" className="admin-btn admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Plus size={16} />
            <span>+ New Case Study</span>
          </Link>
        </div>
      </div>

      <DataTable
        columns={caseColumns}
        data={studies}
        loading={loading}
        meta={meta}
        searchPlaceholder="Search case studies..."
        searchValue={search}
        onSearchChange={setSearch}
        statusFilterValue={status}
        statusFilterOptions={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
          { label: "Archived", value: "archived" },
        ]}
        onStatusFilterChange={setStatus}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={!!deleteCaseId}
        title="Delete Case Study"
        message="Are you sure you want to delete this case study? This action cannot be undone."
        isDanger
        confirmText="Delete"
        onConfirm={handleDeleteCase}
        onCancel={() => setDeleteCaseId(null)}
      />

      {/* Tag Manager Modal */}
      <TagManagerModal
        isOpen={tagsModalOpen}
        onClose={handleCloseTagsModal}
      />
    </div>
  );
}
