"use client";

import React, { useState, useEffect, useCallback } from "react";
import { leadershipApi, companyValuesApi, companyCapabilitiesApi, metricsApi } from "@/lib/admin-api/resources";
import { LeadershipMemberResource, CompanyValueResource, CompanyCapabilityResource, MetricResource } from "@/types/admin";
import { DataTable, Column } from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/ToastNotification";
import { FormGroup } from "@/components/admin/FormControls";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

export default function CompanyTeamAdminPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"leadership" | "values" | "capabilities" | "metrics">("leadership");
  const [loading, setLoading] = useState(true);

  // States for sub-resources
  const [leaders, setLeaders] = useState<LeadershipMemberResource[]>([]);
  const [values, setValues] = useState<CompanyValueResource[]>([]);
  const [caps, setCaps] = useState<CompanyCapabilityResource[]>([]);
  const [metrics, setMetrics] = useState<MetricResource[]>([]);

  // Simple Add Modals state
  const [addModal, setAddModal] = useState(false);
  const [leaderForm, setLeaderForm] = useState({ full_name: "", designation: "", short_bio: "" });
  const [valueForm, setValueForm] = useState({ title: "", description: "" });
  const [capForm, setCapForm] = useState({ title: "", description: "" });
  const [metricForm, setMetricForm] = useState({ label: "", value: "", suffix: "" });
  const [deleteData, setDeleteData] = useState<{ id: number; type: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "leadership") {
        const res = await leadershipApi.list();
        setLeaders(res.data || []);
      } else if (tab === "values") {
        const res = await companyValuesApi.list();
        setValues(res.data || []);
      } else if (tab === "capabilities") {
        const res = await companyCapabilitiesApi.list();
        setCaps(res.data || []);
      } else if (tab === "metrics") {
        const res = await metricsApi.list();
        setMetrics(res.data || []);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to load records", "error");
    } finally {
      setLoading(false);
    }
  }, [tab, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === "leadership") await leadershipApi.create(leaderForm);
      else if (tab === "values") await companyValuesApi.create(valueForm);
      else if (tab === "capabilities") await companyCapabilitiesApi.create(capForm);
      else if (tab === "metrics") {
        const key = metricForm.label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `metric-${Date.now()}`;
        await metricsApi.create({ ...metricForm, key });
      }

      showToast("Record added successfully", "success");
      setAddModal(false);
      setLeaderForm({ full_name: "", designation: "", short_bio: "" });
      setValueForm({ title: "", description: "" });
      setCapForm({ title: "", description: "" });
      setMetricForm({ label: "", value: "", suffix: "" });
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to add record", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      if (deleteData.type === "leadership") await leadershipApi.delete(deleteData.id);
      else if (deleteData.type === "values") await companyValuesApi.delete(deleteData.id);
      else if (deleteData.type === "capabilities") await companyCapabilitiesApi.delete(deleteData.id);
      else if (deleteData.type === "metrics") await metricsApi.delete(deleteData.id);

      showToast("Deleted successfully", "success");
      setDeleteData(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--admin-text-main)" }}>Company & Team</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>
            Leadership board, corporate values, technical capabilities, and impact metrics
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setAddModal(true)}>
          + Add New {tab.slice(0, -1).toUpperCase()}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--admin-border)", marginBottom: "1.5rem" }}>
        {[
          { key: "leadership", label: "Leadership Team" },
          { key: "values", label: "Core Values" },
          { key: "capabilities", label: "Capabilities" },
          { key: "metrics", label: "Proof Metrics" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            style={{
              padding: "0.75rem 1.25rem",
              background: "none",
              border: "none",
              borderBottom: tab === t.key ? "2px solid var(--admin-accent)" : "2px solid transparent",
              color: tab === t.key ? "var(--admin-accent)" : "var(--admin-text-muted)",
              fontWeight: tab === t.key ? 600 : 500,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "leadership" && (
        <DataTable
          columns={[
            { header: "Full Name", render: (item: any) => <span style={{ fontWeight: 600 }}>{item.full_name}</span> },
            { header: "Designation", accessor: "designation" },
            { header: "Bio Summary", accessor: "short_bio" },
            {
              header: "Actions",
              render: (item: any) => (
                <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteData({ id: item.id, type: "leadership" })}>
                  Delete
                </button>
              ),
              width: "100px",
            },
          ]}
          data={leaders}
          loading={loading}
        />
      )}

      {tab === "values" && (
        <DataTable
          columns={[
            { header: "Value Title", render: (item: any) => <span style={{ fontWeight: 600 }}>{item.title}</span> },
            { header: "Description", accessor: "description" },
            {
              header: "Actions",
              render: (item: any) => (
                <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteData({ id: item.id, type: "values" })}>
                  Delete
                </button>
              ),
              width: "100px",
            },
          ]}
          data={values}
          loading={loading}
        />
      )}

      {tab === "capabilities" && (
        <DataTable
          columns={[
            { header: "Capability", render: (item: any) => <span style={{ fontWeight: 600 }}>{item.title}</span> },
            { header: "Description", accessor: "description" },
            {
              header: "Actions",
              render: (item: any) => (
                <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteData({ id: item.id, type: "capabilities" })}>
                  Delete
                </button>
              ),
              width: "100px",
            },
          ]}
          data={caps}
          loading={loading}
        />
      )}

      {tab === "metrics" && (
        <DataTable
          columns={[
            { header: "Label", render: (item: any) => <span style={{ fontWeight: 600 }}>{item.label}</span> },
            { header: "Metric Value", render: (item: any) => `${item.value}${item.suffix || ""}` },
            {
              header: "Actions",
              render: (item: any) => (
                <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteData({ id: item.id, type: "metrics" })}>
                  Delete
                </button>
              ),
              width: "100px",
            },
          ]}
          data={metrics}
          loading={loading}
        />
      )}

      {/* Add Modal */}
      {addModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 480 }}>
            <div className="admin-modal-header">
              <h3 className="admin-card-title">Add {tab.toUpperCase()}</h3>
              <button onClick={() => setAddModal(false)} style={{ color: "#8b9baa", fontSize: "1.1rem" }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="admin-modal-body">
                {tab === "leadership" && (
                  <>
                    <FormGroup label="Full Name" required>
                      <input type="text" required className="admin-input" value={leaderForm.full_name} onChange={(e) => setLeaderForm({ ...leaderForm, full_name: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="Designation" required>
                      <input type="text" required className="admin-input" value={leaderForm.designation} onChange={(e) => setLeaderForm({ ...leaderForm, designation: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="Short Bio">
                      <textarea className="admin-textarea" value={leaderForm.short_bio} onChange={(e) => setLeaderForm({ ...leaderForm, short_bio: e.target.value })} />
                    </FormGroup>
                  </>
                )}
                {tab === "values" && (
                  <>
                    <FormGroup label="Title" required>
                      <input type="text" required className="admin-input" value={valueForm.title} onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="Description" required>
                      <textarea required className="admin-textarea" value={valueForm.description} onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })} />
                    </FormGroup>
                  </>
                )}
                {tab === "capabilities" && (
                  <>
                    <FormGroup label="Title" required>
                      <input type="text" required className="admin-input" value={capForm.title} onChange={(e) => setCapForm({ ...capForm, title: e.target.value })} />
                    </FormGroup>
                    <FormGroup label="Description" required>
                      <textarea required className="admin-textarea" value={capForm.description} onChange={(e) => setCapForm({ ...capForm, description: e.target.value })} />
                    </FormGroup>
                  </>
                )}
                {tab === "metrics" && (
                  <>
                    <FormGroup label="Label" required>
                      <input type="text" required className="admin-input" value={metricForm.label} onChange={(e) => setMetricForm({ ...metricForm, label: e.target.value })} placeholder="e.g. Completed Projects" />
                    </FormGroup>
                    <FormGroup label="Value" required>
                      <input type="text" required className="admin-input" value={metricForm.value} onChange={(e) => setMetricForm({ ...metricForm, value: e.target.value })} placeholder="e.g. 250" />
                    </FormGroup>
                    <FormGroup label="Suffix (e.g. + or %)">
                      <input type="text" className="admin-input" value={metricForm.suffix} onChange={(e) => setMetricForm({ ...metricForm, suffix: e.target.value })} placeholder="+" />
                    </FormGroup>
                  </>
                )}
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setAddModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteData}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record?"
        isDanger
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteData(null)}
      />
    </div>
  );
}
