"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/components/theme";

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
    copy: "We connect your existing platforms and infrastructure into a unified, seamless ecosystem, reducing friction and improving operational efficiency.",
  },
];

const sectors = ["Government", "Private Sector", "NGOs", "EDucation"];

const reasons = [
  "Experienced & Professional",
  "Trusted technology",
  "End-to-end solutions",
  "Software development to cybersecurity",
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}

function GradientButton({ children, href = "#contact" }: { children: React.ReactNode; href?: string }) {
  return (
    <a className="gradient-button" href={href}>
      {children}
    </a>
  );
}

function Header({ dark, toggleTheme }: { dark: boolean; toggleTheme: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header container">
      <a href="#top" aria-label="Agrani home" className="logo-link">
        <Image src={`${A}/icons/logo-light.svg`} width={178} height={50} alt="Agrani Technologies & Services Limited" priority />
      </a>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
        <span /><span />
      </button>
      <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
        <a className="active" href="/"><i />Home</a>
        <a href="/about">About Us</a>
        <a href="/services">Product and Services</a>
        <a href="/blog">Others <b>⌄</b></a>
        <a href="/career">Career</a>
        <a href="/contact">Contact Us</a>
      </nav>
      <div className="header-actions">
        <GradientButton>Get In Touch</GradientButton>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
          <span className={!dark ? "selected" : ""}>
            <Image src={`${A}/light/raw-09.png`} width={20} height={20} alt="" />
          </span>
          <span className={dark ? "selected" : ""}>
            <Image src={`${A}/light/raw-12.png`} width={20} height={20} alt="" />
          </span>
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container" id="top">
      <Image className="hero-image" src={`${A}/light/raw-11.jpeg`} fill sizes="(max-width: 900px) 100vw, 1239px" alt="Professional working in a modern technology office" priority />
      <div className="hero-shade" />
      <div className="process-pill"><span>+Define</span><span>+Design</span><span>+Development</span></div>
      <div className="hero-copy">
        <div className="reviews"><Image src={`${A}/icons/star.svg`} width={24} height={24} alt="" />4.9 Reviews</div>
        <h1>Innovative IT<br />Solutions for a<br />Smarter Bangladesh</h1>
      </div>
      <div className="hero-side">
        <p>Branding<br />Mobile &amp; Web App Agency<br />for Startups and Giants</p>
        <div className="hero-cta">
          <GradientButton href="#services">Explore Our Services</GradientButton>
          <a className="search-button" href="#services" aria-label="Explore services">
            <Image src={`${A}/icons/search.svg`} width={24} height={24} alt="" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [["10+", "Years in Operation"], ["100+", "Professionals"], ["4", "Sectors Served"], ["Nationwide", "Reach"]];
  return (
    <section className="stats-wrap">
      <div className="stats container">
        {stats.map(([n, l]) => <div className="stat" key={l}><strong>{n}</strong><span>{l}</span></div>)}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services-section section-glow" id="services">
      <div className="container service-heading">
        <Pill>Our Product and Services</Pill>
        <div className="heading-row">
          <h2>Committed to Empower Your Vision</h2>
          <div className="round-arrows"><button aria-label="Previous">‹</button><button aria-label="Next">›</button></div>
        </div>
      </div>
      <div className="service-rail" aria-label="Services">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <div className="service-icon"><Image src={service.icon} width={38} height={38} alt="" /></div>
            <h3>{service.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h3>
            <p>{service.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Sectors() {
  const copy = "We build custom web and mobile applications, ERP systems.We build custom web and mobile applications, ERP systems.We build custom web and mobile applications.";
  return (
    <section className="sectors-section section-glow" id="about">
      <div className="center-heading container">
        <Pill>Who We Serve</Pill>
        <h2>Our Services:<br />Crafted to Empower Your Vision</h2>
      </div>
      <div className="sector-grid container">
        {sectors.map((sector, i) => (
          <article className={`sector-card sector-${i + 1}`} key={sector}>
            <h3>{sector}</h3>
            <p>{copy}</p>
            <div className="sector-placeholder" />
          </article>
        ))}
      </div>
    </section>
  );
}

function WhyChoose() {
  const [active, setActive] = useState(0);
  return (
    <section className="why-section section-glow" id="why">
      <div className="why-content">
        <Pill>Why Choose Agrani</Pill>
        <h2>Delivering trusted solutions with quality,<br />innovation, and customer-first service.</h2>
        <div className="accordion">
          {reasons.map((reason, i) => (
            <div className={active === i ? "accordion-item active" : "accordion-item"} key={reason}>
              <button onClick={() => setActive(i)} aria-expanded={active === i}>
                {reason}<span>{active === i ? "⌃" : "⌄"}</span>
              </button>
              {active === i && <p>Thorough and comprehensive cleaning of all rooms, including inside cabinets and closets details appliance cleaning, ensuring the entire space is absolutely spotless</p>}
            </div>
          ))}
        </div>
        <GradientButton>Contact Us</GradientButton>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section container" id="contact">
      <div className="contact-copy">
        <h2>We&apos;re just a<br />message away—<br />reach out and<br />let&apos;s discuss how<br />we can help.</h2>
        <p>Thorough and comprehensive cleaning of all rooms, including inside cabinets and closets details appliance cleaning, ensuring the entire space is absolutely spotless</p>
      </div>
      <div className="quote-wrap">
        <Image className="quote-bg" src={`${A}/light/raw-02.png`} fill sizes="710px" alt="" />
        <form className="quote-form" onSubmit={(e) => e.preventDefault()}>
          <h3>Request for Personal Quote</h3>
          <label>Fist name *<input name="firstName" /></label>
          <label>Last name *<input name="lastName" /></label>
          <label>Phone Number<div className="phone-input"><Image src={`${A}/light/raw-14.png`} width={38} height={22} alt="United Arab Emirates" /><span>⌄</span></div></label>
          <label>City<select defaultValue=""><option value="" /></select></label>
          <label className="message">Message *<textarea name="message" /></label>
          <button className="gradient-button" type="submit">Send</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer container" id="footer">
      <div className="footer-left">
        <Image className="footer-logo" src={`${A}/icons/logo-footer.svg`} width={205} height={57} alt="Agrani Technologies & Services Limited" />
        <p>Agrani Technology is the highest rated Software<br />soplution&nbsp; expert team in the world.</p>
        <h3>Navigations</h3>
        <div className="footer-nav">
          <a href="#">Legal</a><a href="#why">Others⌄</a><a href="#top">Home</a><a href="#">Blog</a>
          <a href="#about">About us</a><a href="#">Careers</a><a href="#services">Product &amp; Services⌄</a><a href="#contact">Contact Us</a>
        </div>
        <h3>Our Location</h3>
        <address>Plot-174/176, Road-02, Avenue-01, Mirpur DOHS,<br />Dhaka-1216, Bangladesh</address>
        <a className="underlined" href="https://www.agranitechbd.com">www.agranitechbd.com</a>
        <div className="contact-line"><a href="tel:+8809610944449">+880-9610944449</a><a href="mailto:info@agranitechbd.com">info@agranitechbd.com</a></div>
        <p>Mon-Fri 9am-6pm</p>
        <div className="social-dots"><span /><span /><span /><span /></div>
      </div>
      <div className="footer-right">
        <Image className="footer-photo" src={`${A}/light/raw-05.png`} width={710} height={390} alt="Agrani technology consultation" />
        <h3>Newsletter</h3>
        <p>Stay Updated with latest news and offers!</p>
        <form className="newsletter" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="Email" aria-label="Email" /><button aria-label="Subscribe">→</button></form>
        <div className="social-links"><a href="#">Facebook ↗</a><a href="#">Twitter ↗</a><a href="#">Linkedin ↗</a></div>
      </div>
      <div className="footer-bottom"><span>Copyright @2026 Agrani Technologies</span><nav><a href="#">Refund Policy</a><a href="#">Terms &amp; Conditions</a><a href="#">Privacy Policy</a></nav></div>
      <div className="floating-actions">
        <button aria-label="Chat with us"><Image src={`${A}/light/raw-08.png`} width={40} height={40} alt="" /></button>
        <a href="tel:+8809610944449" aria-label="Call us"><Image src={`${A}/light/raw-07.png`} width={40} height={40} alt="" /></a>
      </div>
    </footer>
  );
}

export default function Home() {
  const { dark, toggleTheme } = useTheme();

  return (
    <main className={dark ? "site dark" : "site light"}>
      <Header dark={dark} toggleTheme={toggleTheme} />
      <Hero />
      <Stats />
      <Services />
      <Sectors />
      <WhyChoose />
      <Contact />
      <Footer />
    </main>
  );
}
