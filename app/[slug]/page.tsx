"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientButton, PageIntro, Pill, ThemePage } from "@/components/site-chrome";

const A = "/assets/figma";
const pageCopy =
  "Stories & insights that spark ideas from niche updates to business tips, explore our latest blogs that are sure to spark new ideas and fuel your growth.";

const blogCards = [
  ["UX review presentation", "Olivia Rhye", "02.png"],
  ["Best books on scaling your startup", "Olivia Rhye", "04.png"],
  ["Building your API Stack", "Olivia Rhye", "11.png"],
  ["Best books on scaling your startup", "Olivia Rhye", "04.png"],
  ["PM mental models", "Olivia Rhye", "06.png"],
  ["What is Wireframing?", "Olivia Rhye", "08.png"],
  ["How collaboration makes us better designers", "Olivia Rhye", "02.png"],
  ["Our top javascrips frameworks to use", "Olivia Rhye", "08.png"],
];

// Apple/Linear smooth cubic bezier curve
const premiumEase = [0.16, 1, 0.3, 1] as const;

function AboutPage() {
  const [tab, setTab] = useState("Our Mission");

  const directors = [
    {
      name: "Kamrul Islam",
      role: "Managing Director (25+ yrs experience)",
      title: "A word from the Director",
      bio: "Driven by integrity, innovation, and a commitment to quality, our leadership team brings decades of experience to every partnership. We focus on building enduring relationships, empowering businesses, and fostering an environment where talent and technology thrive together.",
      image: `${A}/about/04.png`,
      align: "right", // image on right
    },
    {
      name: "Tanvir Mosaddaque",
      role: "Executive Director (25+ yrs experience)",
      title: "",
      bio: "Tanvir Mosaddaque serves as the Executive Director of Agrani Technologies and Services Limited. With over 25+ years of leadership in IT infrastructure, enterprise systems, and strategic delivery, he plays a key role in driving Agrani's technological growth and expanding our services footprint across Bangladesh and beyond.",
      image: `${A}/about/02.jpeg`,
      align: "left", // image on left
    },
    {
      name: "Hasan Shahid Sarwar, FCA",
      role: "Director (Finance & Operations)",
      title: "",
      bio: "Hasan Shahid Sarwar, FCA brings extensive financial expertise, corporate governance, and operational excellence to Agrani Technologies. As Director of Finance & Operations, he oversees fiscal planning, compliance, and institutional sustainability, ensuring Agrani delivers dependable value to all clients and stakeholders.",
      image: `${A}/about/10.png`,
      align: "right", // image on right
    },
  ];

  const missionBullets = [
    "Deliver innovative, scalable and sustainable technology solutions tailored to your needs.",
    "Bridge the digital divide through accessible and inclusive technology for businesses and government.",
    "Accelerate digital transformation across key sectors including fintech, education, and transport.",
    "Foster talent, nurture continuous learning, and promote ethical, high-standard software practices.",
    "Drive socio-economic development and technological sovereignty across Bangladesh.",
  ];

  const visionBullets = [
    "To be the foremost technological innovator and trusted transformation partner in South Asia.",
    "Empowering enterprises and public institutions with world-class, human-centric software solutions.",
    "Pioneering AI-driven automation, smart governance, and resilient digital infrastructure nationwide.",
  ];

  const valuesBullets = [
    "Integrity: Upholding transparent, ethical, and accountable standards in every client engagement.",
    "Innovation: Constantly exploring cutting-edge technology stacks to solve real-world problems.",
    "Customer Centricity: Prioritizing tangible outcomes, responsiveness, and long-term client success.",
    "Excellence: Delivering robust, high-performance, and secure software architectures that stand the test of time.",
  ];

  const testimonialsRow1 = [
    {
      name: "Steve Smith",
      role: "Director",
      avatar: `${A}/career/01.png`,
      dark: true,
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    },
    {
      name: "Albert Flores",
      role: "CEO",
      avatar: `${A}/career/02.png`,
      dark: false,
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    },
    {
      name: "Robert Fox",
      role: "Businessman",
      avatar: `${A}/career/03.png`,
      dark: false,
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    },
  ];

  const testimonialsRow2 = [
    {
      name: "Darlene Robertson",
      role: "President of Sales",
      avatar: `${A}/career/04.png`,
      dark: false,
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    },
    {
      name: "Kathryn Murphy",
      role: "Enterprise Lead",
      avatar: `${A}/career/06.png`,
      dark: false,
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    },
    {
      name: "Marvin McKinney",
      role: "Global Director",
      avatar: `${A}/career/07.jpeg`,
      dark: false,
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    },
  ];

  return (
    <>
      <PageIntro
        label="About Us"
        title="Company Overview"
        copy="Agrani Technologies and Services Limited (ATSL) is a dynamic and forward-thinking IT company based in Bangladesh, committed to providing innovative solutions that solve real-world challenges."
      />

      <motion.section
        initial={{ opacity: 0, scale: 0.99 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: premiumEase }}
        className="about-hero container"
      >
        <Image src={`${A}/about/09.jpeg`} fill sizes="(max-width: 900px) 100vw, 1240px" alt="Agrani team collaborating" priority />
      </motion.section>

      {/* 3 Alternating Directors */}
      <section className="directors-section container">
        {directors.map((director, i) => (
          <motion.div
            key={director.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: premiumEase }}
            className={`director-row ${director.align === "left" ? "image-left" : "image-right"}`}
          >
            <div className="director-bio">
              {director.title && <h2>{director.title}</h2>}
              <p>{director.bio}</p>
              <strong>{director.name}</strong>
              <small>{director.role}</small>
            </div>
            <div className="director-photo-wrap">
              <Image
                src={director.image}
                width={590}
                height={590}
                alt={director.name}
                className="director-photo"
              />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Purpose & Mission Tabs */}
      <section className="purpose-section section-glow">
        <div className="container">
          <div className="center-heading">
            <h2>
              Driven by purpose, guided by<br />
              Mission, vision, defined by values
            </h2>
            <p className="purpose-subtext">Through a commitment to innovation, integrity and excellence, we shape every solution.</p>
          </div>

          <div className="tab-row">
            {["Our Mission", "Our Vision", "Our Values"].map((x) => (
              <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>
                {x}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "Our Values" ? (
              <motion.div
                key="values"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: premiumEase }}
                className="purpose-values-layout"
              >
                <div className="values-proof-card">
                  <div className="proof-avatars" aria-hidden="true">
                    <span>👨🏻</span><span>👩🏻</span><span>👨🏽</span>
                    <b>★★★★★</b>
                  </div>
                  <p>
                    &quot;We create this platform with a simple goal: to help creation teams feel more productive so they can focus more on bringing their ideas to life. We welcome to our creative journey production.&quot;
                  </p>
                  <div className="proof-stats">
                    <div><strong>10+</strong><span>Years in Operation</span><small>Building development everyday</small></div>
                    <div><strong>100+</strong><span>Professionals</span><small>Building development everyday</small></div>
                  </div>
                </div>
                <div className="value-grid">
                  {[
                    ["💡", "Innovation", "We embrace change and strive to introduce next-generation technology."],
                    ["🌟", "Teamwork", "We collaborate internally and externally to achieve common goals."],
                    ["🎨", "Integrity", "We act with steadfast honesty and uphold professional standards."],
                    ["🧩", "Customer Centricity", "We listen, understand, and deliver solutions that meet real-world challenges."],
                    ["🏅", "Excellence", "We pursue quality in everything we do—from code to customer service."],
                  ].map(([icon, title, copy]) => (
                    <article key={title}>
                      <span className="value-icon" aria-hidden="true">{icon}</span>
                      <h4>{title}</h4>
                      <p>{copy}</p>
                    </article>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: premiumEase }}
                className="purpose-body"
              >
                <div className="purpose-image-wrap">
                  <Image src={`${A}/career/05.jpeg`} width={520} height={360} alt="Coding for a better future" className="purpose-image" />
                </div>
                <div className="purpose-text">
                  <h3>Coding for a Better Future: Empowering Ideas, Inspiring Innovation</h3>
                  <ul className="purpose-check-list">
                    {(tab === "Our Mission" ? missionBullets : visionBullets).map((bullet) => (
                      <li key={bullet}>
                        <span className="check-icon">✔</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Full-Width Auto-Moving Testimonials Marquee */}
      <section className="testimonials-marquee-section section-glow">
        <div className="container center-heading">
          <h2>
            Trusted by the best<br />
            in our industry
          </h2>
          <p className="section-subtext">Trusted by the top enterprises and growing startups across Bangladesh and beyond.</p>
        </div>

        <div className="marquee-wrapper">
          {/* Row 1 - Moves Left */}
          <div className="marquee-track marquee-left">
            {[...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1].map((item, i) => (
              <article
                key={`${item.name}-${i}`}
                className={`feedback-card ${item.dark ? "dark-card" : "light-card"}`}
              >
                <div className="feedback-user">
                  <Image src={item.avatar} width={42} height={42} alt={item.name} className="user-avatar" />
                  <div className="user-info">
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
                <p>{item.text}</p>
                <div className="stars-bottom">★★★★★</div>
              </article>
            ))}
          </div>

          {/* Row 2 - Moves Right */}
          <div className="marquee-track marquee-right">
            {[...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2].map((item, i) => (
              <article
                key={`${item.name}-${i}`}
                className={`feedback-card ${item.dark ? "dark-card" : "light-card"}`}
              >
                <div className="feedback-user">
                  <Image src={item.avatar} width={42} height={42} alt={item.name} className="user-avatar" />
                  <div className="user-info">
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
                <p>{item.text}</p>
                <div className="stars-bottom">★★★★★</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CatalogPage({ products = false }: { products?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const services = products
    ? ["Portfolio", "Industries Served"]
    : [
        "Software Development",
        "Tech Consultancy",
        "System Integration & Interoperability",
        "Comprehensive Cloud & Infrastructure Services",
        "Cybersecurity Solutions",
        "Managed ICT Services",
        "E-Governance Solutions",
        "AI-Powered Government Services",
        "Smart Transportation Ecosystem",
        "IT Training",
        "Offshore IT Services",
      ];
  const details = products
    ? [
        "Revenue & Fees Collection System",
        "Enterprise Resource Planning System",
        "Management Information System",
        "Document Digitization System",
        "Transport Automation System",
        "Payment Gateway Solution",
        "Port Automation System",
        "Sales Process Solution",
        "Biometrics Solution",
        "Internet of Things",
      ]
    : [
        "Enterprise Resource Planning (ERP) System",
        "Management Information System (MIS)",
        "Document Management System",
        "Learning Management System (LMS)",
        "E-commerce Platform",
        "Payment Integration Solution",
        "Multimodal biometric solutions",
      ];

  return (
    <>
      <PageIntro label="Product and Services" title="Real-World Products" copy={pageCopy} />
      <section className="catalog container">
        <div className="tab-row">
          <Link className={!products ? "active" : ""} href="/services">Services</Link>
          <Link className={products ? "active" : ""} href="/products">Products</Link>
        </div>
        <p className="catalog-intro-p">
          Agrani Technologies is backed by a team of highly skilled and experienced professionals, delivering future-ready products customized for specific requirements.
        </p>

        <div className="catalog-list">
          {services.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.article
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className={isOpen ? "open" : ""}
                key={item}
              >
                <button onClick={() => setOpen(isOpen ? null : i)}>
                  <span>{String.fromCharCode(65 + i)}</span>
                  <strong>{item}</strong>
                  <span className="accordion-indicator">{isOpen ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="catalog-details"
                    >
                      <div className="details-tags">
                        {details.map((x) => (
                          <span key={x}>◉ {x}</span>
                        ))}
                      </div>
                      <GradientButton href="/contact">Let&apos;s Discuss Project</GradientButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function BlogGrid({ cases = false }: { cases?: boolean }) {
  const blogImages = [
    `${A}/career/05.jpeg`,
    `${A}/light/raw-15.jpeg`,
    `${A}/blog/10.png`,
    `${A}/blog/04.png`,
    `${A}/blog/06.png`,
    `${A}/blog/08.png`,
    `${A}/blog/02.png`,
    `${A}/career/07.jpeg`,
  ];

  return (
    <>
      <PageIntro
        label={cases ? "CaseStudies" : "Blog"}
        title={cases ? "Real-World Solutions" : "Recent Highlights"}
        copy={pageCopy}
      />
      <section className="blog-listing container">
        {!cases && (
          <nav className="blog-category-tabs" aria-label="Blog categories">
            {["IT trends", "AI and automation", "Cybersecurity", "Digital transformation", "Industry best practices"].map((category, index) => (
              <button className={index === 0 ? "active" : ""} type="button" key={category}>{category}</button>
            ))}
          </nav>
        )}

        <div className="blog-grid">
          {blogCards.map(([title, author], i) => (
            <motion.div
              key={`${title}-${i}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Link href={cases ? "/case-study-details" : "/blog-details"} className="blog-card">
                <div className="blog-img-wrap">
                  <Image src={blogImages[i]} fill sizes="(max-width: 768px) 100vw, 608px" alt={title} />
                  <div className="blog-image-meta">
                    <strong>{author}</strong>
                    <span>27, march 2026</span>
                  </div>
                </div>
                <h2>{cases && i === 0 ? "A Salon Booking UX review" : title}</h2>
                <p>Stories &amp; Insights That Sparks Ideas: From tech updates to business tips, explore our latest blogs that are sure to spark new ideas and fuel your growth.</p>
                <span className="read-link">{cases ? "Read Case Study" : "Read Post"} <b>↗</b></span>
              </Link>
            </motion.div>
          ))}
        </div>

        {!cases && (
          <nav className="blog-pagination" aria-label="Blog pagination">
            <button type="button">← <span>Previous Page</span></button>
            <div><b>1</b><button type="button">2</button><button type="button">3</button><span>………</span><button type="button">10</button></div>
            <button type="button"><span>Next Page</span> →</button>
          </nav>
        )}
      </section>
    </>
  );
}

function BlogDetails() {
  return (
    <>
      <PageIntro label="Blog Details" title="Digital payments revolution" />
      <article className="article-page container">
        <div className="article-hero-wrap">
          <Image src={`${A}/blog/04.png`} fill sizes="(max-width: 900px) 100vw, 1240px" alt="Digital payments revolution" priority />
        </div>
        <aside>
          <strong>Andrew Jonson</strong>
          <span>Content Manager</span>
          <p>Share this post</p>
          <div className="share-links">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
          </div>
        </aside>
        <div className="article-copy">
          <h2>Introductions</h2>
          <p>
            Artificial intelligence is transforming payment by improving fraud detection, automating risk assessment and personalizing customer experience. AI systems analyze transaction patterns in real time to flag unusual activity, helping businesses operate securely and efficiently.
          </p>
          <p>
            Machine learning makes payment experiences faster and more intelligent while maintaining the trust customers expect.
          </p>
          <div className="article-inline-img">
            <Image src={`${A}/blog/06.png`} fill sizes="(max-width: 768px) 100vw, 600px" alt="Customer using digital payments" />
          </div>
          <blockquote>
            Digital transformation provides a secure way to handle transactions for all users, simplifying routine tasks and making services more accessible.
          </blockquote>
          <h2>Conclusion</h2>
          <p>
            With smart tools, secure infrastructure and thoughtful customer experiences, modern payment platforms can create more value for everyone.
          </p>
        </div>
      </article>

      <section className="similar container">
        <h2>Few more similar blogs</h2>
        <div className="blog-grid compact">
          {blogCards.slice(6).map(([t, a, img]) => (
            <motion.div key={t} whileHover={{ y: -4 }}>
              <Link className="blog-card" href="/blog-details">
                <div className="blog-img-wrap">
                  <Image src={`${A}/blog/${img}`} fill sizes="(max-width: 768px) 100vw, 590px" alt={t} />
                </div>
                <small>{a}</small>
                <h3>{t}</h3>
                <span className="read-link">Read Post ↗</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

function CaseStudyDetails() {
  return (
    <>
      <PageIntro
        label="Project Overview"
        title={<>Finding and booking<br />salon services shouldn&apos;t be stressful</>}
        copy="Stylii makes it seamless for both customers and salon owners."
      />
      <section className="case-story container">
        <div className="case-lead">
          <h2>Problem &amp;<br />Solutions</h2>
          <p>
            In today&apos;s fast-moving beauty industry, customers face delays and confusion during salon booking while many owners still rely on manual record-keeping and phone calls.
          </p>
        </div>
        <div className="problem-flow">
          <motion.article whileHover={{ y: -4 }}>
            <b>Problem</b>
            <p>Manual booking and service management cause missed appointments, long wait times and frustrated clients.</p>
          </motion.article>
          <motion.article whileHover={{ y: -4 }}>
            <b>Solution 01</b>
            <p>Clients book easily while staff manage appointments and availability in one place.</p>
          </motion.article>
          <motion.article whileHover={{ y: -4 }}>
            <b>Solution 02</b>
            <p>Clear tracking improves service quality and customer satisfaction.</p>
          </motion.article>
        </div>
      </section>

      <section className="research-section">
        <div className="container">
          <h2>Researching Users To<br />Validate Design Choices</h2>
          <div className="research-stats">
            {[
              ["80%", "Effortless booking flow"],
              ["65%", "Clear service details"],
              ["47%", "Helpful stylist selection"],
            ].map(([n, l]) => (
              <article key={n}>
                <strong>{n}</strong>
                <span>{l}</span>
              </article>
            ))}
          </div>
          <div className="research-image-wrap">
            <Image src={`${A}/blog/02.png`} fill sizes="(max-width: 900px) 100vw, 800px" alt="User research" />
          </div>
        </div>
      </section>

      <section className="case-finale container">
        <div className="case-mockups">
          <span />
          <span />
          <span />
        </div>
        <div className="finale-copy">
          <div className="finale-img-wrap">
            <Image src={`${A}/blog/02.png`} fill sizes="430px" alt="Final solution" />
          </div>
          <h2>From Vision to Final Execution</h2>
          <p>With Stylii, insights turn into an adaptive salon experience that empowers customers and helps owners grow.</p>
        </div>
        <div className="thanks-block">
          <h2>THANKS<br /><small>For Scrolling Along</small></h2>
        </div>
      </section>
    </>
  );
}

const testimonials = ["Mashreef Ahamed", "Zinia Sultana", "Jehana Mowla", "Adam Gwadar"];

function TestimonialsPage() {
  return (
    <>
      <PageIntro label="Customer Experience" title="More critics from our clients" copy={pageCopy} />
      <section className="testimonials container">
        {[...Array(3)]
          .flatMap(() => testimonials)
          .map((name, i) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
              whileHover={{ y: -4 }}
              key={`${name}-${i}`}
            >
              <div>
                <span className="avatar">{name[0]}</span>
                <strong>{name}</strong>
                <b>★★★★★</b>
              </div>
              <p>
                Working with Agrani has been an incredible experience, marked by an innovative work culture and a supportive team that inspires growth.
              </p>
              <small>
                Executive <i>Finance &amp; Admin</i>
              </small>
            </motion.article>
          ))}
      </section>
    </>
  );
}

function ExpertisePage() {
  const team = [
    "Software Engineers",
    "System Architects",
    "Database Experts",
    "UI/UX Designer",
    "QA & Test Engineers",
    "Security Experts",
    "Business Analysts",
    "Project Managers",
    "Support Engineers",
  ];
  return (
    <>
      <PageIntro label="Our Expertise" title="Real-World Solutions" copy={pageCopy} />
      <section className="expertise container">
        <h2>Technical Team</h2>
        <p>Agrani&apos;s greatest asset is its people. The company employs over 100 professionals including:</p>
        <div className="feature-grid">
          {team.map((x, i) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              key={x}
            >
              <div className="round-icon">
                <Image src={`${A}/light/raw-${String((i % 4) + 1).padStart(2, "0")}.png`} width={32} height={32} alt="" />
              </div>
              <h3>{x}</h3>
              <p>We build custom web and mobile applications, platforms, and future-ready systems.</p>
              <small>Details Full Stack</small>
            </motion.article>
          ))}
        </div>

        <h2>Technological Expertise</h2>
        <div className="technology-grid">
          {["Language", "Frameworks", "Database", "Cloud", "DevOps", "Security", "Others"].map((x) => (
            <motion.article whileHover={{ y: -3 }} key={x}>
              <h3>{x}</h3>
              <div>
                <span>Java</span>
                <span>Python</span>
                <span>React</span>
                <span>AWS</span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="csr">
          <h2>Our Infrastructure &amp; Facilities, Security &amp; Compliance, Partnership &amp; Affiliations</h2>
          <div>
            {[
              "Infrastructure & Facilities",
              "Security & Compliance",
              "Partnership Affiliations",
              "Corporate Social Responsibility (CSR)",
            ].map((x) => (
              <motion.button whileHover={{ x: 4 }} key={x}>
                {x}
                <span>⌄</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WhyPage() {
  const cards = [
    "12+ years experience",
    "100+ Professionals",
    "24/7 Support available",
    "Highly Experienced and Professionals",
    "Maintain Security",
    "Cost Efficient Product and Services",
    "Cloud Infrastructure",
    "High-Quality Product",
    "Deliver On-time",
  ];
  return (
    <>
      <PageIntro label="Why Choose Us" title="Real-World Solutions" copy={pageCopy} />
      <section className="why-cards container">
        {cards.map((x, i) => (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className={i === 2 ? "accent" : ""}
            key={x}
          >
            <div className="round-icon">✦</div>
            <h2>{x}</h2>
            <p>We build custom web and mobile applications, ERP systems, e-commerce platforms, and more, tailored to your specific business needs.</p>
            {i === 2 && <GradientButton href="/contact">Contact Us</GradientButton>}
          </motion.article>
        ))}
      </section>
    </>
  );
}

function CareerPage() {
  const jobs = [
    { title: "Artist/Designer", tags: ["Design", "Fulltime", "Entry Level"], salary: "25,000 - 60,000" },
    { title: "UI/UX Designer", tags: ["Design", "Fulltime", "Entry Level"], salary: "25,000 - 60,000" },
    { title: "PHP Developer", tags: ["Design", "Fulltime", "Entry Level"], salary: "25,000 - 60,000" },
    { title: "Full-Stack Developer", tags: ["Design", "Fulltime", "Entry Level"], salary: "25,000 - 60,000" },
  ];
  const internships = [
    { title: "Artist/Designer", tags: ["Design", "Ontime", "Entry Level"], salary: "5,000 - 10,000" },
    { title: "UI/UX Designer", tags: ["Design", "Ontime", "Entry Level"], salary: "5,000 - 10,000" },
    { title: "PHP Developer", tags: ["Design", "Ontime", "Entry Level"], salary: "5,000 - 10,000" },
    { title: "Full-Stack Developer", tags: ["Design", "Ontime", "Entry Level"], salary: "5,000 - 10,000" },
  ];
  const feedbacks = [
    {
      name: "Mashreef Ahamed",
      avatar: `${A}/career/01.png`,
      dark: true,
      quote: "This calendar app has been a lifesaver! I used to forget important events, but now I'm always on top of my schedule.",
      roleLeft: "Executive",
      roleRight: "Product & Marketing",
    },
    {
      name: "Zinia Sultana",
      avatar: `${A}/career/02.png`,
      dark: false,
      quote: "Working at Nagorik has been an incredible experience, marked by an innovative work culture and a supportive team that inspires growth...",
      roleLeft: "",
      roleRight: "Finance & Admin",
    },
    {
      name: "Jehana Mowla",
      avatar: `${A}/career/03.png`,
      dark: false,
      quote: "Working at Nagorik Technologies Limited has been an incredibly rewarding experience. An Inspiring and Supportive Work Environment - Truly a Great Place to Grow!",
      roleLeft: "",
      roleRight: "Tech team",
    },
    {
      name: "Adam Gwadar",
      avatar: `${A}/career/04.png`,
      dark: false,
      quote: "Working at Nagorik Technologies Limited has been an incredibly rewarding experience. An Inspiring and Supportive Work Environment - Truly a Great Place to Grow!",
      roleLeft: "",
      roleRight: "Marketing team",
    },
  ];

  return (
    <>
      <PageIntro
        label="Career"
        title="Where technology meets opportunity"
        copy="Through our comprehensive training, recruitment practices and vibrant work environment, Agrani empowers talent to build meaningful careers."
      />
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="career-hero container"
      >
        <Image src={`${A}/career/05.jpeg`} fill sizes="(max-width: 900px) 100vw, 1240px" alt="Agrani career opportunity" priority />
      </motion.section>

      <section className="employee-section">
        <div className="container">
          <h2>Employees Feedback</h2>
          <p className="employee-intro-p">
            Thorough and comprehensive cleaning of all rooms, including inside cabinets and closets details appliance cleaning, ensuring the entire space is absolutely spotless
          </p>
          <div className="testimonials-wrapper">
            <div className="testimonials-row">
              {feedbacks.slice(0, 2).map((f, i) => (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  key={i}
                  className={f.dark ? "feedback-card dark-card" : "feedback-card light-card"}
                >
                  <div className="feedback-user">
                    <Image src={f.avatar} width={40} height={40} alt={f.name} className="user-avatar" />
                    <strong>{f.name}</strong>
                    <span className="stars">★★★★★</span>
                  </div>
                  <p>{f.quote}</p>
                  <div className="card-footer-row">
                    <span>{f.roleLeft}</span>
                    <span>{f.roleRight}</span>
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="testimonials-row offset-row">
              {feedbacks.slice(2, 4).map((f, i) => (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i + 2) * 0.1 }}
                  whileHover={{ y: -4 }}
                  key={i}
                  className={f.dark ? "feedback-card dark-card" : "feedback-card light-card"}
                >
                  <div className="feedback-user">
                    <Image src={f.avatar} width={40} height={40} alt={f.name} className="user-avatar" />
                    <strong>{f.name}</strong>
                    <span className="stars">★★★★★</span>
                  </div>
                  <p>{f.quote}</p>
                  <div className="card-footer-row">
                    <span>{f.roleLeft}</span>
                    <span>{f.roleRight}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="jobs container">
        <h2>Current Openings</h2>
        <p className="section-subtext">Through our comprehensive training practices and vibrant work environment, Agrani empowers talent to build meaningful careers.</p>
        <div className="job-grid">
          {jobs.map((j, i) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              key={j.title}
            >
              <small className="opening-badge">Opening</small>
              <h3>{j.title}</h3>
              <div className="job-tags">
                {j.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <strong className="salary-text">
                {j.salary} <i>BDT/Month</i>
              </strong>
              <Link className="job-btn" href="/contact">Apply Now</Link>
            </motion.article>
          ))}
        </div>

        <h2 className="internship-heading">Internship Openings</h2>
        <p className="section-subtext">Through our comprehensive training practices and vibrant work environment, Agrani empowers talent to build meaningful careers.</p>
        <div className="job-grid">
          {internships.map((j, i) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              key={j.title}
            >
              <small className="opening-badge red-badge">Opening</small>
              <h3>{j.title}</h3>
              <div className="job-tags">
                {j.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <strong className="salary-text">
                {j.salary} <i>BDT/Month</i>
              </strong>
              <Link className="job-btn" href="/contact">Apply Now</Link>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}

function ContactPage() {
  const info = [
    ["Address", "Plot-174/176, Road-02, Avenue-01, Mirpur DOHS, Dhaka-1216, Bangladesh"],
    ["Phone", "+880-9610944449"],
    ["Email", "info@agranitechbd.com"],
    ["Website", "www.agranitechbd.com"],
  ];
  return (
    <>
      <PageIntro
        label="Contact Us"
        title={<>Need expert guidance? Reach out to<br />our team—we&apos;d love to hear from you</>}
        copy="Through a comprehensive range of services, our experts are ready to help."
      />
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="map container"
      >
        <Image src={`${A}/contact/03.png`} fill sizes="(max-width: 900px) 100vw, 1240px" alt="Agrani Technologies office location map" priority />
      </motion.section>

      <section className="info-grid container">
        {info.map(([x, y], i) => (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            key={x}
          >
            <div className="round-icon">{["⌂", "☎", "✉", "⊕"][i]}</div>
            <h3>{x}</h3>
            <p>{y}</p>
          </motion.article>
        ))}
      </section>
    </>
  );
}

export default function RoutedPage() {
  const { slug } = useParams<{ slug: string }>();
  const map: Record<string, [React.ReactNode, string]> = {
    about: [<AboutPage key="about" />, "About Us"],
    services: [<CatalogPage key="services" />, "Product and Services"],
    products: [<CatalogPage products key="products" />, "Product and Services"],
    blog: [<BlogGrid key="blog" />, "Others"],
    "blog-details": [<BlogDetails key="blog-details" />, "Others"],
    "case-studies": [<BlogGrid cases key="cases" />, "Others"],
    "case-study-details": [<CaseStudyDetails key="case" />, "Others"],
    "customer-experience": [<TestimonialsPage key="customers" />, "Others"],
    expertise: [<ExpertisePage key="expertise" />, "Others"],
    "why-choose-us": [<WhyPage key="why" />, "Others"],
    career: [<CareerPage key="career" />, "Career"],
    contact: [<ContactPage key="contact" />, "Contact Us"],
  };
  const selected = map[slug] || [<PageIntro key="missing" label="Agrani" title="Page not found" />, ""];
  return <ThemePage active={selected[1]}>{selected[0]}</ThemePage>;
}
