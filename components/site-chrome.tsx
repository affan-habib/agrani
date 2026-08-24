"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme";

const A = "/assets/figma";

// Apple/Linear smooth cubic bezier curve
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
        <Image src={`${A}/icons/logo-light.svg`} width={164} height={46} alt="Agrani Technologies & Services Limited" priority />
      </Link>

      <button
        className={`mobile-menu ${open ? "menu-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        <span className="line-top" />
        <span className="line-bottom" />
      </button>

      <nav className="desktop-nav nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <Link className={active === label ? "active" : ""} href={href} key={label}>
            {active === label && <i />}
            {label}
            {label === "Others" && <b>⌄</b>}
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
          aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
        >
          <span className={!dark ? "selected" : ""}>
            <Image src={`${A}/light/raw-09.png`} width={18} height={18} alt="" />
          </span>
          <span className={dark ? "selected" : ""}>
            <Image src={`${A}/light/raw-12.png`} width={18} height={18} alt="" />
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
            {links.map(([label, href]) => (
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

export function PageIntro({ label, title, copy }: { label: string; title: React.ReactNode; copy?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: premiumEase }}
      className="page-intro container"
    >
      <Pill>{label}</Pill>
      <h1>{title}</h1>
      {copy && <p>{copy}</p>}
    </motion.section>
  );
}

export function ContactBlock() {
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
          Thorough and comprehensive cleaning of all rooms, including inside cabinets and closets details appliance cleaning, ensuring the entire space is absolutely spotless
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
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
            <textarea placeholder="Write your requirements here..." name="message" required />
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

export function SiteFooter() {
  return (
    <footer className="footer container" id="footer">
      <div className="footer-left">
        <Link href="/" aria-label="Agrani home">
          <Image className="footer-logo" src={`${A}/icons/logo-footer.svg`} width={205} height={57} alt="Agrani Technologies & Services Limited" />
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
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="#" aria-label="Facebook">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </motion.a>
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="#" aria-label="Twitter">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </motion.a>
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="#" aria-label="LinkedIn">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </motion.a>
          <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="#" aria-label="Instagram">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </motion.a>
        </div>
      </div>

      <div className="footer-right">
        <Image className="footer-photo" src={`${A}/light/raw-05.png`} width={710} height={390} alt="Agrani technology consultation" />
        <h3>Newsletter</h3>
        <p>Stay Updated with latest news and offers!</p>
        <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" aria-label="Email" required />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label="Subscribe">→</motion.button>
        </form>
        <div className="social-links">
          <a href="#" target="_blank" rel="noopener noreferrer">Facebook ↗</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Twitter ↗</a>
          <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Copyright © 2026 Agrani Technologies. All rights reserved.</span>
        <nav aria-label="Footer legal links">
          <Link href="#">Refund Policy</Link>
          <Link href="#">Terms &amp; Conditions</Link>
          <Link href="#">Privacy Policy</Link>
        </nav>
      </div>

      <div className="floating-actions">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Chat with us">
          <Image src={`${A}/light/raw-08.png`} width={36} height={36} alt="" />
        </motion.button>
        <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="tel:+8809610944449" aria-label="Call us">
          <Image src={`${A}/light/raw-07.png`} width={36} height={36} alt="" />
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
  const { dark, toggleTheme } = useTheme("light");
  return (
    <main className={dark ? "site dark inner-site" : "site light inner-site"}>
      <SiteHeader dark={dark} toggleTheme={toggleTheme} active={active} />
      {children}
      {includeContact && <ContactBlock />}
      <SiteFooter />
    </main>
  );
}

