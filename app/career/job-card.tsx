"use client";

import { motion } from "framer-motion";
import type { CareerJob } from "@/types/public";

function salaryText(job: CareerJob) {
  if (!job.salary) return "";
  const min = job.salary.min == null ? "" : Number(job.salary.min).toLocaleString();
  const max = job.salary.max == null ? "" : Number(job.salary.max).toLocaleString();
  const range = min && max ? `${min} - ${max}` : min || max;
  return [range, job.salary.currency, job.salary.period ? `/${job.salary.period}` : ""].filter(Boolean).join(" ");
}

function departmentName(department: CareerJob["department"]) {
  if (typeof department === "string") return department;
  if (department && "name" in department && typeof department.name === "string") return department.name;
  return "";
}

export function JobCard({ job, onApply, index }: { job: CareerJob; onApply: (job: CareerJob) => void; index: number }) {
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}>
      {departmentName(job.department) && <small className="opening-badge">{departmentName(job.department)}</small>}
      <h3>{job.title}</h3>
      <div className="job-tags">{[job.work_mode, job.employment_type, job.experience_level].filter(Boolean).map((tag) => <span key={tag}>{tag}</span>)}</div>
      {salaryText(job) && <strong className="salary-text">{salaryText(job)}</strong>}
      <button type="button" className="job-btn" onClick={() => onApply(job)}>Apply Now</button>
    </motion.article>
  );
}
