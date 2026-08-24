"use client";

import React, { useState, useEffect, useCallback } from "react";
import { mediaApi } from "@/lib/admin-api/media";
import { MediaResource } from "@/types/admin";
import { useToast } from "./ToastNotification";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaResource) => void;
  selectedId?: number | null;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedId,
}) => {
  const { showToast } = useToast();
  const [mediaList, setMediaList] = useState<MediaResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaResource | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mediaApi.list({ search, per_page: 24 });
      setMediaList(res.data || []);
      if (selectedId) {
        const found = (res.data || []).find((m) => m.id === selectedId);
        if (found) setSelected(found);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to load media", "error");
    } finally {
      setLoading(false);
    }
  }, [search, selectedId, showToast]);

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen, fetchMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await mediaApi.upload(file, { title: file.name });
      showToast("Media uploaded successfully", "success");
      setMediaList((prev) => [uploaded, ...prev]);
      setSelected(uploaded);
    } catch (err: any) {
      showToast(err.message || "Failed to upload file", "error");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: 840, height: 600 }}>
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-card-title">Media Library</h3>
            <p className="admin-card-desc">Select an existing asset or upload a new one</p>
          </div>
          <button onClick={onClose} style={{ color: "#8b9baa", fontSize: "1.2rem" }}>✕</button>
        </div>

        <div style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--admin-border)", display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            type="text"
            className="admin-input"
            style={{ maxWidth: 300 }}
            placeholder="Search media files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="admin-btn admin-btn-primary" style={{ cursor: "pointer", marginLeft: "auto" }}>
            {uploading ? "Uploading..." : "+ Upload File"}
            <input type="file" style={{ display: "none" }} onChange={handleFileUpload} accept="image/*,application/pdf" />
          </label>
        </div>

        <div className="admin-modal-body" style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading media assets...</div>
          ) : mediaList.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
              No media assets found. Upload one to get started!
            </div>
          ) : (
            <div className="admin-media-grid">
              {mediaList.map((item) => {
                const isSelected = selected?.id === item.id || selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`admin-media-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelected(item)}
                  >
                    {item.mime_type.startsWith("image") ? (
                      <img src={item.url} alt={item.alt_text || item.file_name} className="admin-media-preview" />
                    ) : (
                      <div style={{ height: 90, display: "flex", alignItems: "center", justifyContent: "center", background: "#0d141b", color: "#8b9baa", fontSize: "0.8rem" }}>
                        📄 {item.file_name.split(".").pop()?.toUpperCase()}
                      </div>
                    )}
                    <div className="admin-media-info" title={item.file_name}>
                      {item.title || item.file_name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={!selected}
            onClick={() => {
              if (selected) {
                onSelect(selected);
                onClose();
              }
            }}
          >
            Select Media Asset
          </button>
        </div>
      </div>
    </div>
  );
};
