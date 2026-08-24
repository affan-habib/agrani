"use client";

import React, { useState } from "react";
import { useToast } from "./ToastNotification";

interface StatusActionsProps {
  currentStatus: string;
  onPublish?: () => Promise<any>;
  onUnpublish?: () => Promise<any>;
  onArchive?: () => Promise<any>;
  onSuccess?: () => void;
}

export const StatusActions: React.FC<StatusActionsProps> = ({
  currentStatus,
  onPublish,
  onUnpublish,
  onArchive,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    setLoading(true);
    try {
      await actionFn();
      showToast(successMsg, "success");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      {onPublish && currentStatus !== "published" && (
        <button
          type="button"
          disabled={loading}
          className="admin-btn admin-btn-sm admin-btn-success"
          onClick={() => handleAction(onPublish, "Published successfully")}
          title="Publish resource"
        >
          Publish
        </button>
      )}

      {onUnpublish && currentStatus === "published" && (
        <button
          type="button"
          disabled={loading}
          className="admin-btn admin-btn-sm admin-btn-secondary"
          onClick={() => handleAction(onUnpublish, "Reverted to draft")}
          title="Revert to draft"
        >
          Unpublish
        </button>
      )}

      {onArchive && currentStatus !== "archived" && (
        <button
          type="button"
          disabled={loading}
          className="admin-btn admin-btn-sm admin-btn-danger"
          onClick={() => handleAction(onArchive, "Archived successfully")}
          title="Archive resource"
        >
          Archive
        </button>
      )}
    </div>
  );
};
