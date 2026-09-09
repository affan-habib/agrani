"use client";

import React, { useState, useEffect, useCallback } from "react";
import { caseStudyTagsApi } from "@/lib/admin-api/resources";
import { CaseStudyTagResource } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Bookmark, Plus, Loader2, X, Trash2 } from "lucide-react";

export interface TagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagsChange?: (tags: CaseStudyTagResource[]) => void;
}

export const TagManagerModal: React.FC<TagManagerModalProps> = ({
  isOpen,
  onClose,
  onTagsChange,
}) => {
  const { showToast } = useToast();
  const [tags, setTags] = useState<CaseStudyTagResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [savingTag, setSavingTag] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await caseStudyTagsApi.list();
      const list = res.data || [];
      setTags(list);
      onTagsChange?.(list);
    } catch (err: any) {
      showToast(err.message || "Failed to load tags", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, onTagsChange]);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
      setNewTagName("");
    }
  }, [isOpen, fetchTags]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setSavingTag(true);
    try {
      await caseStudyTagsApi.create({ name: newTagName.trim() });
      showToast("Tag created successfully", "success");
      setNewTagName("");
      fetchTags();
    } catch (err: any) {
      showToast(err.message || "Failed to create tag", "error");
    } finally {
      setSavingTag(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTagId) return;
    try {
      await caseStudyTagsApi.delete(deleteTagId);
      showToast("Tag deleted successfully", "success");
      setDeleteTagId(null);
      fetchTags();
    } catch (err: any) {
      showToast(err.message || "Failed to delete tag", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ maxWidth: 780, width: "95%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent)" }}>
              <Bookmark size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--admin-text-main)", margin: 0 }}>
                Manage Case Study Tags
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", margin: 0 }}>
                Add or delete project classification tags without leaving the page
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--admin-text-muted)",
              cursor: "pointer",
              fontSize: "1.25rem",
              padding: "0.25rem",
              lineHeight: 1,
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Left Column: Tags List */}
          <div style={{ borderRight: "1px solid var(--admin-border)", paddingRight: "1.25rem" }}>
            <div style={{ marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--admin-text-main)" }}>
              Existing Tags ({tags.length})
            </div>

            {loading ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
                <Loader2 size={24} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginBottom: "0.5rem" }} />
                <div style={{ fontSize: "0.85rem" }}>Loading tags...</div>
              </div>
            ) : tags.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>
                No tags created yet. Add one using the form on the right.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "380px", overflowY: "auto" }}>
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{
                      padding: "0.65rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid var(--admin-border)",
                      background: "var(--admin-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--admin-text-main)" }}>
                        #{tag.name}
                      </span>
                      <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.1rem" }}>
                        /{tag.slug}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteTagId(tag.id)}
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      title="Delete Tag"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Add Tag Form */}
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--admin-text-main)", margin: "0 0 0.25rem 0" }}>
              Create New Tag
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "1rem" }}>
              Enter a tag name to classify case studies (e.g. Fintech, Cloud Migration).
            </p>

            <form onSubmit={handleCreate}>
              <FormGroup label="Tag Name" required hint="e.g. AI & ML, FinTech, ERP">
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="Enter tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </FormGroup>

              <button
                type="submit"
                disabled={savingTag || !newTagName.trim()}
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.4rem" }}
              >
                {savingTag ? (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <Plus size={16} />
                )}
                <span>{savingTag ? "Saving Tag..." : "Add Tag"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer" style={{ justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">
            Done
          </button>
        </div>

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={!!deleteTagId}
          title="Delete Tag"
          message="Are you sure you want to delete this tag? It will be unlinked from any case studies."
          isDanger
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTagId(null)}
        />
      </div>
    </div>
  );
};
