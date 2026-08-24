"use client";

import React from "react";

export interface StatusBadgeProps {
  status?: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return null;
  const s = String(status).toLowerCase();
  
  let badgeClass = "admin-badge admin-badge-info";
  if (["published", "active", "subscribed", "shortlisted", "resolved"].includes(s)) {
    badgeClass = "admin-badge admin-badge-published";
  } else if (["draft", "pending", "reviewed"].includes(s)) {
    badgeClass = "admin-badge admin-badge-draft";
  } else if (["archived", "unsubscribed", "rejected"].includes(s)) {
    badgeClass = "admin-badge admin-badge-archived";
  }

  return (
    <span className={badgeClass}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
      {status}
    </span>
  );
};
