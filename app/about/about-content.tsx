"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ContentImage, EmptyContent } from "@/components/public-content";
import { PageIntro } from "@/components/site-chrome";
import type { AboutPageData, LeadershipMember } from "@/types/public";

export type AboutTab = "mission" | "vision" | "values";

const tabLabels: Record<AboutTab, string> = {
  mission: "Our Mission",
  vision: "Our Vision",
  values: "Our Values",
};

function DirectorRow({ member, title, message, index }: {
  member: LeadershipMember;
  title?: string | null;
  message?: string | null;
  index: number;
}) {
  const imageLeft = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className={`director-row ${imageLeft ? "image-left" : "image-right"}`}
    >
      <div className="director-bio">
        {title && <h2>{title}</h2>}
        {(message || member.full_bio || member.short_bio) && <p>{message || member.full_bio || member.short_bio}</p>}
        <strong>{member.full_name}</strong>
        {member.designation && <small>{member.designation}</small>}
      </div>
      <div className="director-photo-wrap">
        <ContentImage
          media={member.profile_media && "url" in member.profile_media ? member.profile_media : null}
          width={590}
          height={590}
          alt={member.full_name}
          className="director-photo"
        />
      </div>
    </motion.div>
  );
}

export function AboutContent({ data, initialTab }: { data: AboutPageData; initialTab: AboutTab }) {
  const router = useRouter();
  const [tab, setTab] = useState<AboutTab>(initialTab);
  useEffect(() => setTab(initialTab), [initialTab]);

  const director = data.director_message?.director;
  const leaders = [director, ...(data.leadership || [])].filter((member): member is LeadershipMember => Boolean(member));
  const missionPoints = (data.mission_vision?.mission_points || []).flatMap((point) => point.description ? [point.description] : []);
  const visionPoints = data.mission_vision?.vision
    ? data.mission_vision.vision.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];
  const values = data.values || [];
  const testimonials = data.testimonials || [];
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

  const getValueIcon = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes("innovat")) return "🏆";
    if (t.includes("team") || t.includes("collab")) return "🧩";
    if (t.includes("integ") || t.includes("trust")) return "🛡️";
    if (t.includes("custom") || t.includes("client")) return "❤️";
    if (t.includes("excel") || t.includes("qual")) return "🏅";
    const fallbacks = ["🏆", "🧩", "🛡️", "❤️", "🏅"];
    return fallbacks[index % fallbacks.length];
  };

  const selectTab = (next: AboutTab) => {
    setTab(next);
    router.push(`/about?tab=${next}`, { scroll: false });
  };

  return (
    <>
      <PageIntro
        label={data.overview.eyebrow || ""}
        title={data.overview.title || ""}
        copy={data.overview.description || undefined}
      />

      <section className="about-hero container">
        <ContentImage media={data.overview.featured_media} fill sizes="(max-width: 900px) 100vw, 1240px" alt={data.overview.title || ""} priority />
      </section>

      <section className="directors-section container">
        {leaders.length ? leaders.map((member, index) => (
          <DirectorRow
            key={`${member.full_name}-${index}`}
            member={member}
            index={index}
            title={index === 0 ? data.director_message?.title : undefined}
            message={index === 0 ? data.director_message?.message : undefined}
          />
        )) : <EmptyContent message="Leadership information is not available from the API." />}
      </section>

      <section className="purpose-section section-glow">
        <div className="container">
          <div className="center-heading">
            {data.mission_vision?.title && <h2>{data.mission_vision.title}</h2>}
            {data.mission_vision?.description && <p className="purpose-subtext">{data.mission_vision.description}</p>}
          </div>

          <div className="tab-row">
            {(Object.keys(tabLabels) as AboutTab[]).map((key) => (
              <button type="button" className={tab === key ? "active" : ""} onClick={() => selectTab(key)} key={key}>
                {tabLabels[key]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "values" ? (
              <motion.div key="values" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="purpose-values-layout">
                <div className="values-intro-col">
                  <h3>{data.mission_vision?.mission_title || "Coding for a Better Future: Empowering Ideas, Inspiring Innovation"}</h3>
                  {data.mission_vision?.description && <p className="values-subtext">{data.mission_vision.description}</p>}
                  <div className="values-proof-card">
                    <div className="proof-avatars">
                      {testimonials.slice(0, 3).map((item, i) => (
                        <span key={i}>
                          <ContentImage media={item.avatar} width={30} height={30} alt={item.customer_name} />
                        </span>
                      ))}
                      <b>★★★★★</b>
                    </div>
                    <p>{testimonials[0]?.testimonial || "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour."}</p>
                    <div className="proof-stats">
                      <div>
                        <strong>10+</strong>
                        <span>Years in Operation</span>
                        <small>Leading IT Transformation</small>
                      </div>
                      <div>
                        <strong>100+</strong>
                        <span>Professionals</span>
                        <small>Expert Engineers & Staff</small>
                      </div>
                    </div>
                  </div>
                </div>

                {values.length ? (
                  <div className="value-grid">
                    {values.map((value, index) => (
                      <article key={`${value.title}-${index}`}>
                        <span className="value-icon" aria-hidden="true">{getValueIcon(value.title || "", index)}</span>
                        {value.title && <h4>{value.title}</h4>}
                        {value.description && <p>{value.description}</p>}
                      </article>
                    ))}
                  </div>
                ) : <EmptyContent message="Our values are not available from the API yet." />}
              </motion.div>
            ) : (
              <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="purpose-body">
                <div className="purpose-image-wrap">
                  <ContentImage media={data.mission_vision?.featured_media} width={520} height={360} alt={data.mission_vision?.mission_title || ""} className="purpose-image" />
                </div>
                <div className="purpose-text">
                  <h3>{tab === "mission" ? data.mission_vision?.mission_title : data.mission_vision?.vision_title}</h3>
                  {(tab === "mission" ? missionPoints : visionPoints).length ? (
                    <ul className="purpose-check-list">
                      {(tab === "mission" ? missionPoints : visionPoints).map((point) => (
                        <li key={point}><span className="check-icon">✔</span><span>{point}</span></li>
                      ))}
                    </ul>
                  ) : <EmptyContent message={`${tabLabels[tab]} content is not available from the API yet.`} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="testimonials-marquee-section section-glow">
          <div className="container center-heading">
            {data.testimonials_section?.title && <h2>{data.testimonials_section.title}</h2>}
            {data.testimonials_section?.description && <p className="section-subtext">{data.testimonials_section.description}</p>}
          </div>
          {[firstRow, secondRow].map((row, rowIndex) => row.length > 0 && (
            <div className="marquee-wrapper" key={rowIndex}>
              <div className={`marquee-track ${rowIndex ? "marquee-right" : "marquee-left"}`}>
                {[...row, ...row, ...row].map((item, index) => (
                  <article className={`feedback-card ${index === 0 ? "dark-card" : "light-card"}`} key={`${item.customer_name}-${index}`}>
                    <div className="feedback-user">
                      <ContentImage media={item.avatar} width={42} height={42} alt={item.customer_name} className="user-avatar" />
                      <div className="user-info"><strong>{item.customer_name}</strong><span>{item.customer_role}</span></div>
                    </div>
                    <p>{item.testimonial}</p>
                    <div className="stars-bottom">{"★".repeat(Math.max(0, Math.min(5, item.rating || 0)))}</div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
