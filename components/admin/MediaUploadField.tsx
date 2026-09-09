"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, Image as ImageIcon, X, RefreshCw } from "lucide-react";
import { mediaApi } from "@/lib/admin-api/media";
import { MediaResource } from "@/types/admin";
import { MediaPickerModal } from "./MediaPickerModal";
import { useToast } from "./ToastNotification";

interface MediaUploadFieldProps {
  label: string;
  value?: number | null;
  initialMedia?: MediaResource | null;
  onChange: (mediaId: number | null, media?: MediaResource | null) => void;
  description?: string;
  required?: boolean;
}

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  label,
  value,
  initialMedia,
  onChange,
  description,
  required = false,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaResource | null>(initialMedia || null);

  useEffect(() => {
    if (initialMedia) {
      setCurrentMedia(initialMedia);
    } else if (value && (!currentMedia || currentMedia.id !== value)) {
      mediaApi
        .get(value)
        .then((m) => setCurrentMedia(m))
        .catch(() => {
          // Keep current state on error
        });
    } else if (!value) {
      setCurrentMedia(null);
    }
  }, [value, initialMedia]);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";
    setUploading(true);
    try {
      const uploaded = await mediaApi.upload(file, { title: file.name });
      setCurrentMedia(uploaded);
      onChange(uploaded.id, uploaded);
      showToast("Image uploaded and assigned!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectFromLibrary = (selected: MediaResource) => {
    setCurrentMedia(selected);
    onChange(selected.id, selected);
    setModalOpen(false);
    showToast("Media assigned successfully", "success");
  };

  const handleRemove = () => {
    setCurrentMedia(null);
    onChange(null, null);
  };

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--admin-text-main)",
          marginBottom: "0.35rem",
        }}
      >
        {label} {required && <span style={{ color: "var(--admin-danger)" }}>*</span>}
      </label>

      {description && (
        <p style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", marginBottom: "0.5rem" }}>
          {description}
        </p>
      )}

      {/* Hidden native file input for direct upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleDirectUpload}
      />

      {currentMedia ? (
        /* Preview Card */
        <div
          style={{
            display: "flex",
            gap: "1rem",
            padding: "0.85rem",
            background: "var(--admin-card-bg, #131b26)",
            border: "1px solid var(--admin-border, #1e293b)",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 90,
              height: 70,
              borderRadius: "6px",
              overflow: "hidden",
              backgroundColor: "rgba(0,0,0,0.2)",
              flexShrink: 0,
            }}
          >
            {currentMedia.url ? (
              <Image
                src={currentMedia.url}
                alt={currentMedia.alt_text || currentMedia.title || "Selected media"}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  color: "var(--admin-text-muted)",
                }}
              >
                <ImageIcon size={24} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--admin-text-main)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentMedia.title || currentMedia.file_name || `Media #${currentMedia.id}`}
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "4px",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  fontWeight: 600,
                }}
              >
                ID: #{currentMedia.id}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
              {currentMedia.mime_type || "Image"} {currentMedia.size ? `• ${(currentMedia.size / 1024).toFixed(1)} KB` : ""}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Upload different image"
            >
              <RefreshCw size={13} style={{ marginRight: 4 }} />
              {uploading ? "Uploading..." : "Replace"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-secondary"
              onClick={() => setModalOpen(true)}
              title="Choose from media library"
            >
              <ImageIcon size={13} style={{ marginRight: 4 }} />
              Library
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-danger"
              onClick={handleRemove}
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty / Dropzone State */
        <div
          style={{
            border: "2px dashed var(--admin-border, #1e293b)",
            borderRadius: "8px",
            padding: "1.25rem 1rem",
            textAlign: "center",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(59, 130, 246, 0.1)",
                color: "var(--admin-accent, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {uploading ? (
                <div className="admin-spinner" style={{ width: 20, height: 20 }} />
              ) : (
                <Upload size={20} />
              )}
            </div>

            <div>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--admin-text-main)" }}>
                {uploading ? "Uploading image to server..." : "Upload or select an image"}
              </span>
              <p style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.15rem" }}>
                PNG, JPG, WEBP, or SVG up to 10MB
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.35rem" }}>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={14} style={{ marginRight: 6 }} />
                {uploading ? "Uploading..." : "Direct Upload"}
              </button>

              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setModalOpen(true)}
                disabled={uploading}
              >
                <ImageIcon size={14} style={{ marginRight: 6 }} />
                Browse Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {modalOpen && (
        <MediaPickerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleSelectFromLibrary}
          selectedId={value}
        />
      )}
    </div>
  );
};
