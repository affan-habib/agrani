"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme";
import { SiteHeader, SiteFooter, Pill, GradientButton } from "@/components/site-chrome";

const A = "/assets/figma";

const services = [
  {
    title: "Software\nDevelopment",
    icon: `${A}/light/raw-01.png`,
    copy: "We build custom web and mobile applications, ERP systems, e-commerce platforms, and more, tailored to your specific business needs.",
  },
  {
    title: "IT\nConsultancy",
    icon: `${A}/light/raw-04.png`,
    copy: "We help organizations plan smarter technology strategies, navigate digital transformation, and optimize existing systems for better performance.",
  },
  {
    title: "System\nIntegration",
    icon: `${A}/light/raw-13.png`,
    copy: "We connect your existing platforms and infrastructure into a unified, seamless ecosystem, reducing friction and improving operational efficiency.",
  },
  {
    title: "Cloud &\nInfrastructure",
    icon: `${A}/light/raw-03.png`,
    copy: "We build scalable cloud architecture, manage secure deployments, and ensure high availability for mission-critical enterprise workloads.",
  },
];

const sectors = [
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

const reasons = [
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

// Apple/Linear smooth cubic bezier curve
const premiumEase = [0.16, 1, 0.3, 1] as const;

function Hero() {
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
    ? `M ${r} 0 H ${W - r} A ${r} ${r} 0 0 1 ${W} ${r} V ${H - r} A ${r} ${r} 0 0 1 ${W - r} ${H} H ${r} A ${r} ${r} 0 0 1 0 ${H - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`
    : `M ${r} 0 H ${notchX} A ${cr} ${cr} 0 0 1 ${notchX + cr} ${cr} A ${cr} ${cr} 0 0 0 ${notchX + cr * 2} ${shelfY} H ${W - r} A ${r} ${r} 0 0 1 ${W} ${shelfY + r} V ${H - r} A ${r} ${r} 0 0 1 ${W - r} ${H} H ${r} A ${r} ${r} 0 0 1 0 ${H - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;

  return (
    <div className="hero-outer-container container" id="top">
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <clipPath id="hero-cutout-clip" clipPathUnits="userSpaceOnUse">
            <path d={clipPathD} />
          </clipPath>
        </defs>
      </svg>

      {/* Floating pill in top-right notch */}
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
          src={`${A}/light/raw-11.jpeg`}
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
              <span>4.9 Reviews</span>
            </div>
            <h1>
              Innovative IT<br />
              Solutions for a<br />
              Smarter Bangladesh
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: premiumEase }}
            className="hero-side"
          >
            <p>
              Branding<br />
              Mobile &amp; Web App Agency<br />
              for Startups and Giants
            </p>
            <div className="hero-cta">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link className="hero-explore-btn" href="#services">
                  Explore Our Services
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

function Stats() {
  const stats = [
    ["10+", "Years of Experience"],
    ["100+", "Professionals"],
    ["4", "Sectors Served"],
    ["Nationwide", "Reach"],
  ];
  return (
    <section className="stats-section container">
      <div className="stats">
        {stats.map(([n, l], i) => (
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

function Services() {
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
          {services.map((service, i) => (
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: premiumEase }}
              whileHover={{ y: -5, transition: { duration: 0.25, ease: premiumEase } }}
              className="service-card"
              key={service.title}
            >
              <div className="service-icon">
                <Image src={service.icon} width={36} height={36} alt="" />
              </div>
              <h3>
                {service.title.split("\n").map((line) => (
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

function Sectors() {
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
        {sectors.map((sector, i) => (
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: premiumEase }}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: premiumEase } }}
            className={`sector-card sector-${i + 1}`}
            key={sector.title}
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

function WhyChoose() {
  const [active, setActive] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActive(active === index ? null : index);
  };

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
          {reasons.map((reason, i) => {
            const isOpen = active === i;
            return (
              <div className={`accordion-item ${isOpen ? "active" : ""}`} key={reason.title}>
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
        <Image className="quote-bg" src={`${A}/light/raw-02.png`} fill sizes="(max-width: 768px) 100vw, 710px" alt="" />
        <form className="quote-form" onSubmit={(e) => e.preventDefault()}>
          <h3>Request for Personal Quote</h3>
          <label>
            First name *
            <input type="text" placeholder="John" name="firstName" required />
          </label>
          <label>
            Last name *
            <input type="text" placeholder="Doe" name="lastName" required />
          </label>
          <label>
            Phone Number
            <div className="phone-input">
              <Image src={`${A}/light/raw-14.png`} width={34} height={20} alt="Country selector" />
              <input type="tel" placeholder="+880 1234 567890" />
            </div>
          </label>
          <label>
            City
            <select defaultValue="Dhaka">
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="message">
            Message *
            <textarea placeholder="Write your project requirements here..." name="message" required />
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="gradient-button form-submit-btn"
            type="submit"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="footer container">
      <div className="footer-left">
        <Link href="/" aria-label="Agrani home" className="footer-logo">
          <Image src={`${A}/icons/logo-light.svg`} width={164} height={46} alt="Agrani Technologies & Services Limited" />
        </Link>
        <p>
          Agrani Technologies &amp; Services Limited delivers transformative software and IT solutions for enterprises and government bodies across Bangladesh.
        </p>

        <nav className="footer-nav" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/services">Product and Services</Link>
          <Link href="/about">About Us</Link>
          <Link href="/career">Career</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/case-study">Case Studies</Link>
        </nav>

        <address>
          Head Office: House 43, Road 12, Sector 10, Uttara, Dhaka-1230, Bangladesh.
        </address>

        <div className="contact-line">
          <a href="mailto:info@agrani.com.bd" className="underlined">info@agrani.com.bd</a>
          <a href="tel:+88028991234">+880 2 8991234</a>
        </div>

        <div className="social-dots">
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z" />
            </svg>
          </a>
          <a href="https://twitter.com" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-right">
        <Image
          className="footer-photo"
          src={`${A}/light/raw-13.jpeg`}
          width={500}
          height={280}
          alt="Agrani office culture"
        />

        <h3>Newsletter</h3>
        <p>Stay updated with latest news and tech.</p>
        <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email" name="email" required />
          <button type="submit" aria-label="Subscribe to newsletter">
            ›
          </button>
        </form>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2024 Agrani Technologies. All rights reserved.</p>
        <nav aria-label="Footer legal links">
          <Link href="/about">Co-founder</Link>
          <Link href="/contact">Privacy &amp; Cookies</Link>
          <Link href="/terms">Terms Of Condition</Link>
        </nav>
      </div>
    </footer>
  );
}

export default function Home() {
  const { dark, toggleTheme } = useTheme();

  return (
    <main className={dark ? "site dark home-site" : "site light home-site"}>
      <SiteHeader dark={dark} toggleTheme={toggleTheme} active="Home" />
      <Hero />
      <Stats />
      <Services />
      <Sectors />
      <WhyChoose />
      <Contact />
      <SiteFooter />
    </main>
  );
}
