"use client";

import { useEffect, useRef, useState } from "react";
import { publicApi } from "@/lib/public-api/services";
import type { CareerJob } from "@/types/public";

const MAX_RESUME_SIZE_MB = 5;

export function ApplicationModal({ job, onClose }: { job: CareerJob; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);
    if (file) {
      if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
        setError(`Resume file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a document under ${MAX_RESUME_SIZE_MB}MB.`);
        e.target.value = "";
        setResume(null);
        return;
      }
      setResume(file);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("applicant_name", form.name);
      body.append("email", form.email);
      body.append("phone", form.phone);
      if (form.coverLetter) body.append("cover_letter", form.coverLetter);
      if (resume) body.append("resume", resume);
      await publicApi.applyForJob(job.slug, body);
      setSuccess(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-modal-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="job-modal" role="dialog" aria-modal="true" aria-labelledby="job-application-title">
        <button type="button" className="job-modal-close" onClick={onClose} aria-label="Close application form">✕</button>
        <h3 id="job-application-title">Apply for {job.title}</h3>
        {success ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", color: "#10b981" }}>✓</div>
            <div className="form-success" style={{ marginBottom: "1.5rem" }}>
              Your application for <strong>{job.title}</strong> has been submitted successfully!
            </div>
            <button type="button" className="gradient-button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            {error && <div className="form-error">{error}</div>}
            <label>
              Full Name *
              <input
                ref={nameInputRef}
                required
                placeholder="e.g. Jane Doe"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <label>
              Email *
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label>
              Phone Number *
              <input
                type="tel"
                required
                placeholder="+880 1700 000000"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </label>
            <label>
              Cover Letter
              <textarea
                rows={3}
                placeholder="Briefly introduce yourself and relevant experience..."
                value={form.coverLetter}
                onChange={(event) => setForm({ ...form, coverLetter: event.target.value })}
              />
            </label>
            <label>
              Attach Resume (.pdf, .doc, .docx — Max 5MB)
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              {resume && (
                <span style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.25rem", display: "block" }}>
                  Selected: {resume.name} ({(resume.size / 1024).toFixed(0)} KB)
                </span>
              )}
            </label>
            <div className="job-modal-actions">
              <button className="gradient-button" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
              <button type="button" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
