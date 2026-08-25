"use client";

import { useState } from "react";
import { publicApi } from "@/lib/public-api/services";
import type { CareerJob } from "@/types/public";

export function ApplicationModal({ job, onClose }: { job: CareerJob; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        {success ? <div className="form-success">Application submitted successfully.</div> : (
          <form onSubmit={submit}>
            {error && <div className="form-error">{error}</div>}
            <label>Full Name *<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label>Email *<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label>Phone Number *<input type="tel" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
            <label>Cover Letter<textarea value={form.coverLetter} onChange={(event) => setForm({ ...form, coverLetter: event.target.value })} /></label>
            <label>Attach Resume<input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} /></label>
            <div className="job-modal-actions"><button className="gradient-button" type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Application"}</button><button type="button" onClick={onClose}>Cancel</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
