"use client";

import React, { useState, useEffect, useCallback } from "react";
import { mediaApi } from "@/lib/admin-api/media";
import { MediaResource, PaginationMeta } from "@/types/admin";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

export default function MediaLibraryPage() {
  const { showToast } = useToast();
  const [mediaList, setMediaList] = useState<MediaResource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<MediaResource | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editMeta, setEditMeta] = useState({ alt_text: "", title: "", caption: "" });

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mediaApi.list({ search, page, per_page: 24 });
      setMediaList(res.data || []);
      setMeta(res.meta);
    } catch (err: any) {
      showToast(err.message || "Failed to load media", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, showToast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await mediaApi.upload(file, { title: file.name });
      showToast("Media uploaded successfully", "success");
      fetchMedia();
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMeta = async () => {
    if (!selectedMedia) return;
    try {
      const updated = await mediaApi.update(selectedMedia.id, editMeta);
      setSelectedMedia(updated);
      showToast("Metadata saved", "success");
      fetchMedia();
    } catch (err: any) {
      showToast(err.message || "Failed to update metadata", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await mediaApi.delete(deleteId);
      showToast("Media asset deleted", "success");
      setDeleteId(null);
      if (selectedMedia?.id === deleteId) setSelectedMedia(null);
      fetchMedia();
    } catch (err: any) {
      showToast(err.message || "Failed to delete", "error");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Media Library</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Upload, inspect, optimize, and organize company media assets
          </p>
        </div>
        <label className="admin-btn admin-btn-primary" style={{ cursor: "pointer" }}>
          {uploading ? "Uploading..." : "+ Upload New Media"}
          <input type="file" style={{ display: "none" }} onChange={handleUpload} accept="image/*,application/pdf" />
        </label>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <input
          type="text"
          className="admin-input"
          style={{ maxWidth: 360 }}
          placeholder="Search media by filename or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedMedia ? "1fr 340px" : "1fr", gap: "1.5rem" }}>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading media assets...</div>
          ) : mediaList.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No media assets found.</div>
          ) : (
            <div className="admin-media-grid">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  className={`admin-media-card ${selectedMedia?.id === item.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedMedia(item);
                    setEditMeta({ alt_text: item.alt_text || "", title: item.title || "", caption: item.caption || "" });
                  }}
                >
                  {item.mime_type.startsWith("image") ? (
                    <img src={item.url} alt={item.alt_text || item.file_name} className="admin-media-preview" />
                  ) : (
                    <div style={{ height: 90, display: "flex", alignItems: "center", justifyContent: "center", background: "#0d141b", color: "#8b9baa", fontSize: "0.85rem" }}>
                      📄 {item.file_name.split(".").pop()?.toUpperCase()}
                    </div>
                  )}
                  <div className="admin-media-info" title={item.file_name}>{item.title || item.file_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMedia && (
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className="admin-card-title">Asset Inspector</h2>
              <button onClick={() => setSelectedMedia(null)} style={{ color: "#8b9baa" }}>✕</button>
            </div>

            <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--admin-border)", marginBottom: "1rem", background: "var(--admin-sidebar-bg)" }}>
              {selectedMedia.mime_type.startsWith("image") ? (
                <img src={selectedMedia.url} alt={selectedMedia.file_name} style={{ width: "100%", maxHeight: 200, objectFit: "contain", display: "block" }} />
              ) : (
                <div style={{ padding: "2rem", textAlign: "center" }}>📄 Document</div>
              )}
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem" }}>
              <div><strong>File:</strong> {selectedMedia.file_name}</div>
              <div><strong>Size:</strong> {(selectedMedia.size / 1024).toFixed(1)} KB</div>
              <div><strong>Type:</strong> {selectedMedia.mime_type}</div>
              <div>
                <strong>URL:</strong>{" "}
                <a href={selectedMedia.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--admin-accent)" }}>
                  Open Link ↗
                </a>
              </div>
            </div>

            <FormGroup label="Alt Text">
              <input type="text" className="admin-input" value={editMeta.alt_text} onChange={(e) => setEditMeta({ ...editMeta, alt_text: e.target.value })} />
            </FormGroup>

            <FormGroup label="Title">
              <input type="text" className="admin-input" value={editMeta.title} onChange={(e) => setEditMeta({ ...editMeta, title: e.target.value })} />
            </FormGroup>

            <FormGroup label="Caption">
              <textarea className="admin-textarea" style={{ minHeight: 60 }} value={editMeta.caption} onChange={(e) => setEditMeta({ ...editMeta, caption: e.target.value })} />
            </FormGroup>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button type="button" className="admin-btn admin-btn-sm admin-btn-primary" onClick={handleSaveMeta} style={{ flex: 1 }}>
                Save Meta
              </button>
              <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(selectedMedia.id)}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Media Asset"
        message="Are you sure you want to delete this media file? Any articles referencing this image might display broken links."
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
