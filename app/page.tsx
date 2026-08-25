"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme";
import { SiteHeader, SiteFooter, Pill, GradientButton } from "@/components/site-chrome";
import { publicApi } from "@/lib/public-api/services";
import { resolveMediaUrl } from "@/lib/public-api/media";
import { PublicHomePageResource } from "@/types/admin";

const A = "/assets/figma";

// Default Fallbacks for design integrity
const fallbackServices = [
  {
    title: "Software\nDevelopment",
    icon: A + "/light/raw-01.png",
    copy: "We build custom web and mobile applications, ERP systems, e-commerce platforms, and more, tailored to your specific business needs.",
  },
  {
    title: "IT\nConsultancy",
    icon: A + "/light/raw-04.png",
    copy: "We help organizations plan smarter technology strategies, navigate digital transformation, and optimize existing systems for better performance.",
  },
  {
    title: "System\nIntegration",
    icon: A + "/light/raw-13.png",
    copy: "We connect your existing platforms and infrastructure into a unified, seamless ecosystem, reducing friction and improving operational efficiency.",
  },
  {
    title: "Cloud &\nInfrastructure",
    icon: A + "/light/raw-03.png",
    copy: "We build scalable cloud architecture, manage secure deployments, and ensure high availability for mission-critical enterprise workloads.",
  },
];

const fallbackSectors = [
  {
    title: "Government",
    copy: "We build custom web and mobile applications, ERP systems, and secure e-governance platforms tailored to public sector workflows.",
    featured: true,
  },
  {
    title: "Private Sector",
    copy: "Future-ready software, high-performance web systems, and custom automation for fast-growing businesses.",
    featured: false,
  },
  {
    title: "NGOs",
    copy: "Document management, field tracking, and collaborative platforms designed for social impact organizations.",
    featured: false,
  },
  {
    title: "EDucation",
    copy: "Modern learning management systems (LMS) and institutional portals empowering students and educators.",
    featured: false,
  },
];

const fallbackReasons = [
  {
    title: "Experienced & Professional",
    desc: "Backed by 25+ years of leadership and 100+ vetted engineers delivering reliable enterprise systems nationwide.",
  },
  {
    title: "Trusted Technology",
    desc: "Modern architectures, cloud-native scalability, and industry-standard security certifications you can depend on.",
  },
  {
    title: "End-to-End Solutions",
    desc: "From UI/UX strategy and agile software engineering to ongoing cloud maintenance and 24/7 technical support.",
  },
  {
    title: "Software Development to Cybersecurity",
    desc: "Comprehensive solutions ensuring data integrity, compliance, zero-trust infrastructure, and peak uptime.",
  },
];

const premiumEase = [0.16, 1, 0.3, 1] as const;

function Hero({ data }: { data?: PublicHomePageResource["hero"] }) {
  const [dimensions, setDimensions] = useState({ width: 1240, height: 600 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const update = () => {
      if (heroRef.current) {
        setDimensions({
          width: heroRef.current.offsetWidth,
          height: heroRef.current.offsetHeight,
        });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const { width: W, height: H } = dimensions;
  const isMobile = W <= 768;
  const notchW = Math.min(380, W * 0.42);
  const notchX = W - notchW;
  const shelfY = 56;
  const r = 32;
  const cr = 28;

  const clipPathD = isMobile
    ? "M " + r + " 0 H " + (W - r) + " A " + r + " " + r + " 0 0 1 " + W + " " + r + " V " + (H - r) + " A " + r + " " + r + " 0 0 1 " + (W - r) + " " + H + " H " + r + " A " + r + " " + r + " 0 0 1 0 " + (H - r) + " V " + r + " A " + r + " " + r + " 0 0 1 " + r + " 0 Z"
    : "M " + r + " 0 H " + notchX + " A " + cr + " " + cr + " 0 0 1 " + (notchX + cr) + " " + cr + " A " + cr + " " + cr + " 0 0 0 " + (notchX + cr * 2) + " " + shelfY + " H " + (W - r) + " A " + r + " " + r + " 0 0 1 " + W + " " + (shelfY + r) + " V " + (H - r) + " A " + r + " " + r + " 0 0 1 " + (W - r) + " " + H + " H " + r + " A " + r + " " + r + " 0 0 1 0 " + (H - r) + " V " + r + " A " + r + " " + r + " 0 0 1 " + r + " 0 Z";

  const heroImageSrc = resolveMediaUrl(data?.background_media, A + "/light/raw-11.jpeg");

  return (
    <div className="hero-outer-container container" id="top">
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <clipPath id="hero-cutout-clip" clipPathUnits="userSpaceOnUse">
            <path d={clipPathD} />
          </clipPath>
        </defs>
      </svg>

      {!isMobile && (
        <div className="hero-floating-pill">
          <span>About us</span>
          <span>Strategy</span>
          <span>Achievement</span>
        </div>
      )}

      <section className="hero" ref={heroRef} style={{ clipPath: "url(#hero-cutout-clip)" }}>
        <Image
          className="hero-image"
          src={heroImageSrc}
          fill
          sizes="(max-width: 900px) 100vw, 1240px"
          alt="Professional working in a modern technology office"
          priority
        />
        <div className="hero-shade" />

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: premiumEase }}
            className="hero-copy"
          >
            <div className="rating-badge">
              <svg className="star-icon" width="15" height="15" viewBox="0 0 24 24" fill="#f15827">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{data?.tagline || "4.9 Reviews"}</span>
            </div>
            <h1>
              {data?.title ? (
                data.title.includes("\n") ? (
                  data.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))
                ) : (
                  data.title
                )
              ) : (
                <>
                  Innovative IT<br />
                  Solutions for a<br />
                  Smarter Bangladesh
                </>
              )}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: premiumEase }}
            className="hero-side"
          >
            <p style={{ whiteSpace: "pre-line" }}>
              {data?.subtitle || "Branding\nMobile & Web App Agency\nfor Startups and Giants"}
            </p>
            <div className="hero-cta">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link className="hero-explore-btn" href={data?.primary_cta?.url || "#services"}>
                  {data?.primary_cta?.label || "Explore Our Services"}
                </Link>
              </motion.div>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="search-button"
                href="#services"
                aria-label="Explore our services"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Stats({ data }: { data?: any }) {
  const statsList = [
    [data?.experience_years ? String(data.experience_years) + "+" : "10+", "Years of Experience"],
    [data?.professionals_count || "100+", "Professionals"],
    [String(data?.sectors_count || "4"), "Sectors Served"],
    [data?.reach_label || "Nationwide", "Reach"],
  ];

  return (
    <section className="stats-section container">
      <div className="stats">
        {statsList.map(([n, l], i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: premiumEase }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="stat"
          >
            <strong>{n}</strong>
            <span>{l}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Services({ data }: { data?: any[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: "left" | "right") => {
    if (railRef.current) {
      const scrollAmount = 400;
      railRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const serviceItems = (data && data.length > 0)
    ? data.map((item, i) => ({
        title: item.title,
        icon: resolveMediaUrl(item.icon, A + "/light/raw-0" + ((i % 4) + 1) + ".png"),
        copy: item.short_description || item.copy || "",
      }))
    : fallbackServices;

  return (
    <section className="services-section section-glow" id="services">
      <div className="container service-heading">
        <Pill>Our Product and Services</Pill>
        <div className="heading-row">
          <h2>Committed to Empower Your Vision</h2>
          <div className="round-arrows">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollRail("left")}
              aria-label="Previous service"
            >
              ‹
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollRail("right")}
              aria-label="Next service"
            >
              ›
            </motion.button>
          </div>
        </div>
      </div>

      <div className="service-rail-container container">
        <div className="service-rail" ref={railRef} aria-label="Services">
          {serviceItems.map((service, i) => (
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: premiumEase }}
              whileHover={{ y: -5, transition: { duration: 0.25, ease: premiumEase } }}
              className="service-card"
              key={service.title + i}
            >
              <div className="service-icon">
                <Image src={service.icon} width={36} height={36} alt="" unoptimized={service.icon.startsWith("http")} />
              </div>
              <h3>
                {service.title.split("\n").map((line: string) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </h3>
              <p>{service.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sectors({ data }: { data?: any[] }) {
  const sectorItems = (data && data.length > 0)
    ? data.map((s, i) => ({
        title: s.title,
        copy: s.short_description || s.copy || "",
        featured: i === 0,
      }))
    : fallbackSectors;

  return (
    <section className="sectors-section section-glow" id="about">
      <div className="center-heading container">
        <Pill>Who We Serve</Pill>
        <h2>
          Our Services:<br />
          Crafted to Empower Your Vision
        </h2>
      </div>

      <div className="sector-grid container">
        {sectorItems.map((sector, i) => (
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: premiumEase }}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: premiumEase } }}
            className={"sector-card sector-" + (i + 1)}
            key={sector.title + i}
          >
            <h3>{sector.title}</h3>
            <p>{sector.copy}</p>
            <div className="sector-placeholder" />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function WhyChoose({ data }: { data?: any[] }) {
  const [active, setActive] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActive(active === index ? null : index);
  };

  const reasonItems = (data && data.length > 0)
    ? data.map((r) => ({
        title: r.title,
        desc: r.description || r.desc || "",
      }))
    : fallbackReasons;

  return (
    <section className="why-section section-glow" id="why">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: premiumEase }}
        className="why-content"
      >
        <Pill>Why Choose Agrani</Pill>
        <h2>
          Delivering trusted solutions with quality,<br />
          innovation, and customer-first service.
        </h2>

        <div className="accordion">
          {reasonItems.map((reason, i) => {
            const isOpen = active === i;
            return (
              <div className={"accordion-item " + (isOpen ? "active" : "")} key={reason.title + i}>
                <button
                  onClick={() => toggleAccordion(i)}
                  aria-expanded={isOpen}
                  className="accordion-trigger"
                >
                  <span>{reason.title}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: premiumEase }}
                    className="accordion-arrow"
                  >
                    ⌄
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: premiumEase }}
                      className="accordion-body"
                    >
                      <p>{reason.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <GradientButton href="/contact">Contact Us</GradientButton>
      </motion.div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "Dhaka",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await publicApi.submitQuoteRequest({
        name: (form.firstName + " " + form.lastName).trim(),
        email: form.firstName.toLowerCase() + "." + form.lastName.toLowerCase() + "@client.com",
        phone: form.phone,
        service_type: "General Project",
        budget_range: "Flexible",
        project_details: "Location/City: " + form.city + "\n\nMessage:\n" + form.message,
        source_page: "Homepage",
      });
      setSubmitted(true);
      setForm({ firstName: "", lastName: "", phone: "", city: "Dhaka", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to submit quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section container" id="contact">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: premiumEase }}
        className="contact-copy"
      >
        <h2>
          We&apos;re just a<br />
          message away—<br />
          reach out and<br />
          let&apos;s discuss how<br />
          we can help.
        </h2>
        <p>
          Whether you&apos;re looking to develop custom software, modernize legacy
          systems, or need strategic technology consulting, our team is ready to
          turn your ideas into scalable solutions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: premiumEase }}
        className="quote-wrap"
      >
        <Image className="quote-bg" src={A + "/light/raw-02.png"} fill sizes="(max-width: 768px) 100vw, 710px" alt="" />
        <form className="quote-form" onSubmit={handleSubmit}>
          <h3>Request for Personal Quote</h3>

          {submitted && (
            <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#10b981", padding: "0.75rem 1rem", borderRadius: 8, fontSize: "0.85rem", marginBottom: "1rem" }}>
              ✓ Thank you! Your quote request has been received. Our team will contact you shortly.
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: 8, fontSize: "0.85rem", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <label>
            First name *
            <input
              type="text"
              placeholder="John"
              name="firstName"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </label>
          <label>
            Last name *
            <input
              type="text"
              placeholder="Doe"
              name="lastName"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </label>
          <label>
            Phone Number
            <div className="phone-input">
              <Image src={A + "/light/raw-14.png"} width={34} height={20} alt="Country selector" />
              <input
                type="tel"
                placeholder="+880 1234 567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </label>
          <label>
            City
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            >
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="message">
            Message *
            <textarea
              placeholder="Write your project requirements here..."
              name="message"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="gradient-button form-submit-btn"
            type="submit"
          >
            {loading ? "Submitting..." : "Send Message"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

export default function Home() {
  const { dark, toggleTheme } = useTheme();
  const [homeData, setHomeData] = useState<PublicHomePageResource | null>(null);

  useEffect(() => {
    publicApi.getHome()
      .then((data) => setHomeData(data))
      .catch((err) => console.warn("Using fallback homepage design data:", err.message));
  }, []);

  return (
    <main className={dark ? "site dark home-site" : "site light home-site"}>
      <SiteHeader dark={dark} toggleTheme={toggleTheme} active="Home" />
      <Hero data={homeData?.hero} />
      <Stats data={homeData?.statistics} />
      <Services data={homeData?.services} />
      <Sectors data={homeData?.sectors} />
      <WhyChoose data={homeData?.why_choose_us} />
      <Contact />
      <SiteFooter />
    </main>
  );
}
