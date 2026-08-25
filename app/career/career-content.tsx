"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContentImage, EmptyContent } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { CareerJob, CareerPageData } from "@/types/public";
import { ApplicationModal } from "./application-modal";
import { JobCard } from "./job-card";

export function CareerContent({ data }: { data: CareerPageData }) {
  const [applyingJob, setApplyingJob] = useState<CareerJob | null>(null);
  const feedback = data.employee_feedback?.items || [];
  const currentJobs = data.current_openings?.items || [];
  const internships = data.internship_openings?.items || [];

  return (
    <>
      <PageIntro label={data.hero.eyebrow || ""} title={data.hero.title || ""} copy={data.hero.description || undefined} />
      <motion.section initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="career-hero container">
        <ContentImage media={data.hero.media} fill sizes="(max-width: 900px) 100vw, 1240px" alt={data.hero.title || ""} priority />
      </motion.section>

      <section className="employee-section"><div className="container">
        <h2>{data.employee_feedback?.title}</h2>
        {data.employee_feedback?.description && <p className="employee-intro-p">{data.employee_feedback.description}</p>}
        <div className="testimonials-wrapper">
          {feedback.length ? [feedback.slice(0, 2), feedback.slice(2)].map((row, rowIndex) => <div className={`testimonials-row ${rowIndex ? "offset-row" : ""}`} key={rowIndex}>{row.map((item, index) => <motion.article whileHover={{ y: -4 }} className={rowIndex === 0 && index === 0 ? "feedback-card dark-card" : "feedback-card light-card"} key={`${item.customer_name}-${index}`}><div className="feedback-user"><ContentImage media={item.avatar} width={40} height={40} alt={item.customer_name} className="user-avatar" /><strong>{item.customer_name}</strong><span className="stars">{"★".repeat(Math.max(0, Math.min(5, item.rating || 0)))}</span></div><p>{item.testimonial}</p><div className="card-footer-row"><span>{item.customer_role}</span><span>{item.department}</span></div></motion.article>)}</div>) : <EmptyContent message="Employee feedback is not available from the API." />}
        </div>
      </div></section>

      <section className="jobs container">
        <h2>{data.current_openings?.title}</h2>
        {data.current_openings?.description && <p className="section-subtext">{data.current_openings.description}</p>}
        <div className="job-grid">{currentJobs.length ? currentJobs.map((job, index) => <JobCard job={job} onApply={setApplyingJob} index={index} key={job.slug} />) : <EmptyContent message="No current openings are published by the API." />}</div>

        <h2 className="internship-heading">{data.internship_openings?.title}</h2>
        {data.internship_openings?.description && <p className="section-subtext">{data.internship_openings.description}</p>}
        <div className="job-grid">{internships.length ? internships.map((job, index) => <JobCard job={job} onApply={setApplyingJob} index={index} key={job.slug} />) : <EmptyContent message="No internship openings are published by the API." />}</div>
      </section>

      {applyingJob && <ApplicationModal job={applyingJob} onClose={() => setApplyingJob(null)} />}
    </>
  );
}
