"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme";
import { publicApi } from "@/lib/public-api/services";

const A = "/assets/figma";

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="eyebrow"
    >
      <span />
      {children}
    </motion.div>
  );
}

export function GradientButton({ children, href = "/contact" }: { children: React.ReactNode; href?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ display: "inline-block" }}
    >
      <Link className="gradient-button" href={href}>
        {children}
      </Link>
    </motion.div>
  );
}

export function SiteHeader({ dark, toggleTheme, active }: { dark: boolean; toggleTheme: () => void; active?: string }) {
  const [open, setOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);
  const desktopOthersRef = useRef<HTMLDivElement>(null);
  const mobileOthersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!othersOpen) return;

    const closeWhenOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      const insideDesktop = desktopOthersRef.current?.contains(target);
      const insideMobile = mobileOthersRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) setOthersOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOthersOpen(false);
    };

    document.addEventListener("pointerdown", closeWhenOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeWhenOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [othersOpen]);

  const links = [
    ["Home", "/"],
    ["About Us", "/about"],
    ["Product and Services", "/services"],
    ["Others", "/blog"],
    ["Career", "/career"],
    ["Contact Us", "/contact"],
  ];

  return (
    <header className="site-header container inner-header">
      <Link href="/" aria-label="Agrani home" className="logo-link">
        <Image src={A + "/icons/logo-light.svg"} width={164} height={46} alt="Agrani Technologies & Services Limited" priority />
      </Link>

      <button
        className={"mobile-menu " + (open ? "menu-open" : "")}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        <span className="line-top" />
        <span className="line-bottom" />
      </button>

      <nav className="desktop-nav nav" aria-label="Main navigation">
        {links.map(([label, href]) => label === "Others" ? (
          <div className="nav-dropdown" key={label} ref={desktopOthersRef}>
            <button
              type="button"
              className={"nav-dropdown-trigger " + (active === label ? "active" : "")}
              aria-expanded={othersOpen}
              aria-haspopup="menu"
              onClick={() => setOthersOpen((value) => !value)}
            >
              {active === label && <i />}
              {label}
              <b className={othersOpen ? "open" : ""}>⌄</b>
            </button>
            <AnimatePresence>
              {othersOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: premiumEase }}
                  className="nav-dropdown-menu"
                  role="menu"
                >
                  <Link href="/case-studies" role="menuitem" onClick={() => setOthersOpen(false)}>Case Studies</Link>
                  <Link href="/blog" role="menuitem" onClick={() => setOthersOpen(false)}>Blogs</Link>
                  <Link href="/customer-experience" role="menuitem" onClick={() => setOthersOpen(false)}>Customer Experience</Link>
                  <Link href="/expertise" role="menuitem" onClick={() => setOthersOpen(false)}>Our Expertise</Link>
                  <Link href="/why-choose-us" role="menuitem" onClick={() => setOthersOpen(false)}>Why Choose Us</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link className={active === label ? "active" : ""} href={href} key={label}>
            {active === label && <i />}
            {label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <div className="header-cta-wrap">
          <GradientButton href="/contact">Get In Touch</GradientButton>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={"Switch to " + (dark ? "light" : "dark") + " mode"}
        >
          <span className={!dark ? "selected" : ""}>
            <Image src={A + "/light/raw-09.png"} width={18} height={18} alt="" />
          </span>
          <span className={dark ? "selected" : ""}>
            <Image src={A + "/light/raw-12.png"} width={18} height={18} alt="" />
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: premiumEase }}
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {links.map(([label, href]) => label === "Others" ? (
              <div className="mobile-nav-group" key={label} ref={mobileOthersRef}>
                <button
                  type="button"
                  className={"mobile-nav-parent " + (active === label ? "active" : "")}
                  aria-expanded={othersOpen}
                  onClick={() => setOthersOpen((value) => !value)}
                >
                  <span>{active === label && <i />}{label}</span>
                  <b className={othersOpen ? "open" : ""}>⌄</b>
                </button>
                <AnimatePresence>
                  {othersOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mobile-nav-submenu"
                    >
                      <Link href="/case-studies" onClick={() => { setOpen(false); setOthersOpen(false); }}>Case Studies</Link>
                      <Link href="/blog" onClick={() => { setOpen(false); setOthersOpen(false); }}>Blogs</Link>
                      <Link href="/customer-experience" onClick={() => { setOpen(false); setOthersOpen(false); }}>Customer Experience</Link>
                      <Link href="/expertise" onClick={() => { setOpen(false); setOthersOpen(false); }}>Our Expertise</Link>
                      <Link href="/why-choose-us" onClick={() => { setOpen(false); setOthersOpen(false); }}>Why Choose Us</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                className={active === label ? "active" : ""}
                href={href}
                key={label}
                onClick={() => setOpen(false)}
              >
                {active === label && <i />}
                {label}
              </Link>
            ))}
            <div className="mobile-nav-cta">
              <GradientButton href="/contact">Get In Touch</GradientButton>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function PageIntro({ label, title, copy, meta }: { label: string; title: React.ReactNode; copy?: string; meta?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: premiumEase }}
      className="page-intro container"
    >
      <Pill>{label}</Pill>
      {meta && <p className="page-intro-meta">{meta}</p>}
      <h1>{title}</h1>
      {copy && <p>{copy}</p>}
    </motion.section>
  );
}

export function ContactBlock() {
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
        service_type: "General Request",
        budget_range: "Flexible",
        project_details: "Location/City: " + form.city + "\n\nRequirements:\n" + form.message,
        source_page: typeof window !== "undefined" ? window.location.pathname : "Website",
      });
      setSubmitted(true);
      setForm({ firstName: "", lastName: "", phone: "", city: "Dhaka", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to submit quote request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section container shared-contact" id="contact">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="contact-copy"
      >
        <h2>
          We&apos;re just a<br />message away—<br />reach out and<br />let&apos;s discuss how<br />we can help.
        </h2>
        <p>
          Whether you&apos;re looking to develop custom software, modernize legacy systems, or need strategic technology consulting, our team is ready to turn your ideas into scalable solutions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="quote-wrap"
      >
        <Image className="quote-bg" src={A + "/light/raw-02.png"} fill sizes="(max-width: 768px) 100vw, 710px" alt="" loading="eager" />
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
              placeholder="Write your requirements here..."
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

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setSubscribeStatus(null);
    try {
      await publicApi.subscribeNewsletter({ email });
      setSubscribeStatus("✓ Subscribed!");
      setEmail("");
    } catch (err: any) {
      setSubscribeStatus(err.message || "Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer container" id="footer">
      <div className="footer-left">
        <Link href="/" aria-label="Agrani home">
          <Image className="footer-logo" src={A + "/icons/logo-footer.svg"} width={205} height={57} alt="Agrani Technologies & Services Limited" loading="eager" />
        </Link>
        <p>Agrani Technology is the highest rated Software<br />solution expert team in the world.</p>
        
        <h3>Navigations</h3>
        <div className="footer-nav">
          <Link href="#">Legal</Link>
          <Link href="/blog">Others ⌄</Link>
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About Us</Link>
          <Link href="/career">Careers</Link>
          <Link href="/services">Product &amp; Services ⌄</Link>
          <Link href="/contact">Contact Us</Link>
        </div>

        <h3>Our Location</h3>
        <address>Plot-174/176, Road-02, Avenue-01, Mirpur DOHS,<br />Dhaka-1216, Bangladesh</address>
        <a className="underlined" href="https://www.agranitechbd.com" target="_blank" rel="noopener noreferrer">www.agranitechbd.com</a>
        
        <div className="contact-line">
          <a href="tel:+8809610944449">+880-9610944449</a>
          <a href="mailto:info@agranitechbd.com">info@agranitechbd.com</a>
        </div>
        <p>Mon-Fri 9am-6pm</p>
        
        <div className="social-dots">
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </motion.a>
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </motion.a>
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </motion.a>
        </div>
      </div>

      <div className="footer-right">
        <Image className="footer-photo" src={A + "/light/raw-05.png"} width={710} height={390} alt="Agrani technology consultation" loading="eager" />
        <h3>Newsletter</h3>
        <p>Stay Updated with latest news and offers!</p>
        <form className="newsletter" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Subscribe"
            disabled={subscribing}
          >
            {subscribing ? "..." : "→"}
          </motion.button>
        </form>
        {subscribeStatus && (
          <p style={{ fontSize: "0.8rem", color: subscribeStatus.startsWith("✓") ? "#10b981" : "#ef4444", marginTop: "0.4rem" }}>
            {subscribeStatus}
          </p>
        )}
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook ↗</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter ↗</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Copyright © 2026 Agrani Technologies. All rights reserved.</span>
        <nav aria-label="Footer legal links">
          <Link href="/terms">Refund Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/terms">Privacy Policy</Link>
        </nav>
      </div>

      <div className="floating-actions">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Chat with us">
          <Image src={A + "/light/raw-08.png"} width={36} height={36} alt="" />
        </motion.button>
        <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="tel:+8809610944449" aria-label="Call us">
          <Image src={A + "/light/raw-07.png"} width={36} height={36} alt="" />
        </motion.a>
      </div>
    </footer>
  );
}

export function ThemePage({
  children,
  active,
  includeContact = true,
}: {
  children: React.ReactNode;
  active?: string;
  includeContact?: boolean;
}) {
  const { dark, toggleTheme } = useTheme("dark");
  const pathname = usePathname();
  const routeClass = "route-" + (pathname.split("/").filter(Boolean).join("-") || "home");
  return (
    <main className={(dark ? "site dark" : "site light") + " inner-site " + routeClass}>
      <SiteHeader dark={dark} toggleTheme={toggleTheme} active={active} />
      {children}
      {includeContact && <ContactBlock />}
      <SiteFooter />
    </main>
  );
}
