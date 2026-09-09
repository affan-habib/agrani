"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme";
import { publicApi } from "@/lib/public-api/services";
import { resolveMediaUrl } from "@/lib/public-api/media";
import type { QuoteContent, SiteSettings } from "@/types/public";

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

export function SiteHeader({
  dark,
  toggleTheme,
  active,
  branding,
  companyName,
}: {
  dark: boolean;
  toggleTheme: () => void;
  active?: string;
  branding?: SiteSettings["branding"];
  companyName?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);
  const desktopOthersRef = useRef<HTMLDivElement>(null);
  const mobileOthersRef = useRef<HTMLDivElement>(null);

  const logoUrl = resolveMediaUrl(branding?.logo, A + "/icons/logo-light.svg");
  const brandName = companyName || branding?.logo?.alt_text || "Agrani Technologies & Services Limited";

  const otherSubmenuLinks = [
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blogs", href: "/blog" },
    { label: "Customer Experience", href: "/customer-experience" },
    { label: "Our Expertise", href: "/expertise" },
    { label: "Why Choose Us", href: "/why-choose-us" },
  ];

  const isSubmenuActive = (subHref: string) => {
    if (!pathname) return false;
    if (pathname === subHref) return true;
    if (pathname.startsWith(`${subHref}/`)) return true;
    if (subHref === "/blog" && pathname.startsWith("/blog-details")) return true;
    if (subHref === "/case-studies" && pathname.startsWith("/case-study-details")) return true;
    return false;
  };

  const isOthersActive = active === "Others" || otherSubmenuLinks.some((item) => isSubmenuActive(item.href));

  const isMainLinkActive = (label: string, href: string) => {
    if (label === "Others") {
      return isOthersActive;
    }
    if (active) {
      return active === label;
    }
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

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
      <Link href="/" aria-label={`${brandName} home`} className="logo-link">
        <Image
          src={logoUrl}
          width={164}
          height={46}
          alt={brandName}
          priority
          unoptimized={logoUrl.startsWith("http")}
          style={{ objectFit: "contain", maxHeight: 46, width: "auto" }}
        />
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
              className={"nav-dropdown-trigger " + (isOthersActive ? "active" : "")}
              aria-expanded={othersOpen}
              aria-haspopup="menu"
              onClick={() => setOthersOpen((value) => !value)}
            >
              {isOthersActive && <i />}
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
                  {otherSubmenuLinks.map((item) => {
                    const isSelected = isSubmenuActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={isSelected ? "active selected" : ""}
                        onClick={() => setOthersOpen(false)}
                      >
                        <span>{item.label}</span>
                        {isSelected && <i className="submenu-active-indicator" />}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link className={isMainLinkActive(label, href) ? "active" : ""} href={href} key={label}>
            {isMainLinkActive(label, href) && <i />}
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
                  className={"mobile-nav-parent " + (isOthersActive ? "active" : "")}
                  aria-expanded={othersOpen}
                  onClick={() => setOthersOpen((value) => !value)}
                >
                  <span>{isOthersActive && <i />}{label}</span>
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
                      {otherSubmenuLinks.map((item) => {
                        const isSelected = isSubmenuActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={isSelected ? "active selected" : ""}
                            onClick={() => {
                              setOpen(false);
                              setOthersOpen(false);
                            }}
                          >
                            {isSelected && <i />}
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                className={isMainLinkActive(label, href) ? "active" : ""}
                href={href}
                key={label}
                onClick={() => setOpen(false)}
              >
                {isMainLinkActive(label, href) && <i />}
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
      initial={{ opacity: 0.9, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: premiumEase }}
      className="page-intro container"
    >
      <Pill>{label}</Pill>
      {meta && <p className="page-intro-meta">{meta}</p>}
      <h1>{title}</h1>
      {copy && <p>{copy}</p>}
    </motion.section>
  );
}

export function ContactBlock({ quote }: { quote?: QuoteContent }) {
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
    setError(null);

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const message = form.message.trim();
    const phoneClean = form.phone.replace(/[\s\-().]/g, "");

    if (!firstName || !lastName) {
      setError("Please provide both your first and last name.");
      return;
    }

    if (phoneClean.length < 7 || !/^\+?[0-9]+$/.test(phoneClean)) {
      setError("Please enter a valid phone number (e.g. +880 1712 345678).");
      return;
    }

    if (message.length < 5) {
      setError("Please provide a brief message describing your requirement.");
      return;
    }

    setLoading(true);
    try {
      await publicApi.submitQuoteRequest({
        first_name: firstName,
        last_name: lastName,
        phone: form.phone.trim(),
        city: form.city,
        message,
        source_page: quote?.source_page || (typeof window !== "undefined" ? window.location.pathname : undefined),
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
        {quote?.title && <h2>{quote.title}</h2>}
        {quote?.description && <p>{quote.description}</p>}
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
          <h3>{quote?.form_title}</h3>

          {submitted && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid #10b981",
                color: "#10b981",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <span>✓ Thank you! Your quote request has been received. Our team will contact you shortly.</span>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{ color: "#10b981", fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                style={{ color: "#ef4444", fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}
                aria-label="Dismiss error"
              >
                ×
              </button>
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
                required
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

export function SiteFooter({ settings }: { settings?: SiteSettings }) {
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

  const contact = settings?.contact;
  const company = settings?.company;
  const socialLinks = settings?.social?.links || [];

  const addressLine = contact?.address?.line_1
    ? `${contact.address.line_1}, ${contact.address.city || ""}-${contact.address.postal_code || ""}, ${contact.address.country || "Bangladesh"}`
    : "";

  const phone = contact?.primary_phone || "";
  const emailAddr = contact?.primary_email || "";
  const websiteUrl = company?.website_url || "";
  const hours = contact?.business_hours || "";
  const copyrightText = settings?.footer?.copyright || "";
  const footerImage = resolveMediaUrl(settings?.branding?.footer_image, A + "/light/raw-05.png");
  const footerLogoUrl = resolveMediaUrl(settings?.branding?.logo, A + "/icons/logo-footer.svg");
  const companyAlt = company?.name || "Agrani Technologies & Services Limited";

  return (
    <footer className="footer container" id="footer">
      <div className="footer-left">
        <Link href="/" aria-label={`${companyAlt} home`}>
          <Image
            className="footer-logo"
            src={footerLogoUrl}
            width={205}
            height={57}
            alt={companyAlt}
            loading="eager"
            unoptimized={footerLogoUrl.startsWith("http")}
            style={{ objectFit: "contain", maxHeight: 57, width: "auto" }}
          />
        </Link>
        {settings?.footer?.description && <p>{settings.footer.description}</p>}
        
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
        {addressLine && <address>{addressLine}</address>}
        {websiteUrl && <a className="underlined" href={websiteUrl} target="_blank" rel="noopener noreferrer">
          {websiteUrl.replace(/^https?:\/\//, "")}
        </a>}
        
        <div className="contact-line">
          {phone && <a href={`tel:${phone}`}>{phone}</a>}
          {emailAddr && <a href={`mailto:${emailAddr}`}>{emailAddr}</a>}
        </div>
        {hours && <p>{hours}</p>}
        
        <div className="social-dots">
          {socialLinks.map((s: any) => (
            <motion.a
              key={s.label || s.url || s.channel}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={s.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label || s.channel || "Social"}
            >
              {s.label === "Facebook" && (
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              )}
              {s.label === "Twitter" && (
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              )}
              {s.label !== "Facebook" && s.label !== "Twitter" && (
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              )}
            </motion.a>
          ))}
        </div>
      </div>

      <div className="footer-right">
        {footerImage && <Image className="footer-photo" src={footerImage} width={710} height={390} alt={settings?.branding?.footer_image?.alt_text || ""} loading="eager" unoptimized={footerImage.startsWith("http")} />}
        {settings?.footer?.newsletter?.title && <h3>{settings.footer.newsletter.title}</h3>}
        {settings?.footer?.newsletter?.description && <p>{settings.footer.newsletter.description}</p>}
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
          {socialLinks.map((s: any) => (
            <a key={s.label || s.url || s.channel} href={s.url || "#"} target="_blank" rel="noopener noreferrer">
              {s.label || s.channel} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>{copyrightText}</span>
        <nav aria-label="Footer legal links">
          <Link href="/terms">Refund Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/terms">Privacy Policy</Link>
        </nav>
      </div>

      <div className="floating-actions">
        {contact?.whatsapp_phone ? (
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href={`https://wa.me/${contact.whatsapp_phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp chat"
          >
            <Image src={A + "/light/raw-08.png"} width={36} height={36} alt="WhatsApp" />
          </motion.a>
        ) : (
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Chat with us">
            <Image src={A + "/light/raw-08.png"} width={36} height={36} alt="" />
          </motion.button>
        )}
        {phone && <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={`tel:${phone}`} aria-label="Call us">
          <Image src={A + "/light/raw-07.png"} width={36} height={36} alt="" />
        </motion.a>}
      </div>
    </footer>
  );
}

export function ThemePage({
  children,
  active,
  includeContact = true,
  quote,
  siteSettings,
}: {
  children: React.ReactNode;
  active?: string;
  includeContact?: boolean;
  quote?: QuoteContent;
  siteSettings?: SiteSettings;
}) {
  const { dark, toggleTheme } = useTheme();
  const pathname = usePathname();
  const routeClass = "route-" + (pathname.split("/").filter(Boolean).join("-") || "home");
  return (
    <main className={(dark ? "site dark" : "site light") + " inner-site " + routeClass}>
      <SiteHeader
        dark={dark}
        toggleTheme={toggleTheme}
        active={active}
        branding={siteSettings?.branding}
        companyName={siteSettings?.company?.name}
      />
      {children}
      {includeContact && <ContactBlock quote={quote} />}
      <SiteFooter settings={siteSettings} />
    </main>
  );
}
