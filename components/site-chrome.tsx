"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/theme";

const A = "/assets/figma";

export function Pill({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow"><span />{children}</div>;
}

export function GradientButton({ children, href = "/contact" }: { children: React.ReactNode; href?: string }) {
  return <Link className="gradient-button" href={href}>{children}</Link>;
}

export function SiteHeader({ dark, toggleTheme, active }: { dark: boolean; toggleTheme: () => void; active?: string }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "/"], ["About Us", "/about"], ["Product and Services", "/services"],
    ["Others", "/blog"], ["Career", "/career"], ["Contact Us", "/contact"],
  ];
  return (
    <header className="site-header container inner-header">
      <Link href="/" aria-label="Agrani home" className="logo-link"><Image src={`${A}/icons/logo-light.svg`} width={178} height={50} alt="Agrani Technologies & Services Limited" priority /></Link>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span /><span /></button>
      <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
        {links.map(([label, href]) => <Link className={active === label ? "active" : ""} href={href} key={label}>{active === label && <i />}{label}{label === "Others" && <b>⌄</b>}</Link>)}
      </nav>
      <div className="header-actions">
        <GradientButton>Get In Touch</GradientButton>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
          <span className={!dark ? "selected" : ""}><Image src={`${A}/light/raw-09.png`} width={20} height={20} alt="" /></span>
          <span className={dark ? "selected" : ""}><Image src={`${A}/light/raw-12.png`} width={20} height={20} alt="" /></span>
        </button>
      </div>
    </header>
  );
}

export function PageIntro({ label, title, copy }: { label: string; title: React.ReactNode; copy?: string }) {
  return <section className="page-intro container"><Pill>{label}</Pill><h1>{title}</h1>{copy && <p>{copy}</p>}</section>;
}

export function ContactBlock() {
  return (
    <section className="contact-section container shared-contact" id="contact">
      <div className="contact-copy"><h2>We&apos;re just a<br />message away—<br />reach out and<br />let&apos;s discuss how<br />we can help.</h2><p>Thorough and comprehensive cleaning of all rooms, including inside cabinets and closets details appliance cleaning, ensuring the entire space is absolutely spotless</p></div>
      <div className="quote-wrap"><Image className="quote-bg" src={`${A}/light/raw-02.png`} fill sizes="710px" alt="" /><form className="quote-form" onSubmit={(e) => e.preventDefault()}><h3>Request for Personal Quote</h3><label>Fist name *<input name="firstName" /></label><label>Last name *<input name="lastName" /></label><label>Phone Number<div className="phone-input"><Image src={`${A}/light/raw-14.png`} width={38} height={22} alt="United Arab Emirates" /><span>⌄</span></div></label><label>City<select defaultValue=""><option value="" /></select></label><label className="message">Message *<textarea name="message" /></label><button className="gradient-button" type="submit">Send</button></form></div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer container" id="footer">
      <div className="footer-left"><Image className="footer-logo" src={`${A}/icons/logo-footer.svg`} width={205} height={57} alt="Agrani Technologies & Services Limited" /><p>Agrani Technology is the highest rated Software<br />soplution&nbsp; expert team in the world.</p><h3>Navigations</h3><div className="footer-nav"><Link href="#">Legal</Link><Link href="/blog">Others⌄</Link><Link href="/">Home</Link><Link href="/blog">Blog</Link><Link href="/about">About us</Link><Link href="/career">Careers</Link><Link href="/services">Product &amp; Services⌄</Link><Link href="/contact">Contact Us</Link></div><h3>Our Location</h3><address>Plot-174/176, Road-02, Avenue-01, Mirpur DOHS,<br />Dhaka-1216, Bangladesh</address><a className="underlined" href="https://www.agranitechbd.com">www.agranitechbd.com</a><div className="contact-line"><a href="tel:+8809610944449">+880-9610944449</a><a href="mailto:info@agranitechbd.com">info@agranitechbd.com</a></div><p>Mon-Fri 9am-6pm</p><div className="social-dots"><span /><span /><span /><span /></div></div>
      <div className="footer-right"><Image className="footer-photo" src={`${A}/light/raw-05.png`} width={710} height={390} alt="Agrani technology consultation" /><h3>Newsletter</h3><p>Stay Updated with latest news and offers!</p><form className="newsletter" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="Email" aria-label="Email" /><button aria-label="Subscribe">→</button></form><div className="social-links"><a href="#">Facebook ↗</a><a href="#">Twitter ↗</a><a href="#">Linkedin ↗</a></div></div>
      <div className="footer-bottom"><span>Copyright @2026 Agrani Technologies</span><nav><a href="#">Refund Policy</a><a href="#">Terms &amp; Conditions</a><a href="#">Privacy Policy</a></nav></div>
      <div className="floating-actions"><button aria-label="Chat with us"><Image src={`${A}/light/raw-08.png`} width={40} height={40} alt="" /></button><a href="tel:+8809610944449" aria-label="Call us"><Image src={`${A}/light/raw-07.png`} width={40} height={40} alt="" /></a></div>
    </footer>
  );
}

export function ThemePage({ children, active, includeContact = true }: { children: React.ReactNode; active?: string; includeContact?: boolean }) {
  const { dark, toggleTheme } = useTheme("dark");
  return <main className={dark ? "site dark inner-site" : "site light inner-site"}><SiteHeader dark={dark} toggleTheme={toggleTheme} active={active} />{children}{includeContact && <ContactBlock />}<SiteFooter /></main>;
}
