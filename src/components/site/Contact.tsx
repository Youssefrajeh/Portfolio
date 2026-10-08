'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { m, AnimatePresence } from "motion/react";
import { CONTACT_FORM_ENDPOINT } from "@/lib/site";
import { fadeInUp, staggerContainer, staggerItem, modalBackdrop, modalContent, viewportConfig } from "@/lib/motionVariants";

const contactItems = [
  { icon: "fas fa-envelope", text: "youssefrrajeh@gmail.com", link: "mailto:youssefrrajeh@gmail.com", label: "Email" },
  { icon: "fas fa-phone", text: "+1 (548) 388-4360", link: "tel:+15483884360", label: "Phone" },
  { icon: "fab fa-whatsapp", text: "WhatsApp", link: "https://wa.me/15483884360", label: "WhatsApp" },
  { icon: "fas fa-map-marker-alt", text: "London, ON, Canada", link: "https://www.google.com/maps/place/London,+ON,+Canada", label: "Location" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("success");
        setShowModal(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      setStatus("error");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setStatus("idle"), 300);
  };

  useEffect(() => {
    if (status === "success" && showModal) {
      const timer = setTimeout(closeModal, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, showModal]);

  return (
    <section id="contact">
      <style>{`
        #contact {
          padding: 90px 20px;
          background: var(--bg);
          position: relative;
        }
        .contact-wrapper {
          max-width: 1100px;
          margin: 0 auto;
        }
        .contact-title {
          font-family: var(--font-space), sans-serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          color: var(--text);
          text-align: center;
          margin-bottom: 50px;
          font-weight: 600;
        }
        .contact-title::after {
          content: "";
          display: block;
          width: 32px;
          height: 2px;
          background: #6e7cff;
          border-radius: 2px;
          margin: 14px auto 0;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 36px;
          align-items: start;
        }
        .contact-form-card {
          background: var(--surface);
          padding: 36px;
          border-radius: 16px;
          border: 1px solid var(--border);
        }
        .contact-label {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
          display: block;
          text-align: left;
        }
        .contact-input {
          width: 100%;
          padding: 13px 16px;
          margin-bottom: 18px;
          border: 1px solid #2a2a30;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: var(--font-hanken), sans-serif;
          outline: none;
          box-sizing: border-box;
          background: var(--bg);
          color: var(--text);
          transition: border-color 0.3s ease;
        }
        .contact-input:focus {
          border-color: #6e7cff;
        }
        .contact-submit-btn {
          width: 100%;
          padding: 14px 30px;
          background: #6e7cff;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .contact-submit-btn:hover:not(:disabled) {
          background: #5a66e5;
          transform: translateY(-1px);
        }
        .contact-submit-btn:disabled {
          background: var(--border-strong);
          color: var(--text-faint);
          cursor: not-allowed;
        }
        .contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .contact-info-card {
          background: var(--surface);
          padding: 18px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 18px;
          border: 1px solid var(--border);
          text-decoration: none;
          transition: border-color 0.3s ease;
        }
        .contact-info-card:hover {
          border-color: var(--border-strong);
        }
        .contact-info-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(110, 124, 255, 0.06);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6e7cff;
          font-size: 1.05rem;
          flex-shrink: 0;
        }
        .contact-info-label {
          font-family: var(--font-jetbrains), monospace;
          color: var(--text-faint);
          font-size: 0.7rem;
          margin: 0 0 3px 0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: left;
        }
        .contact-info-text {
          font-family: var(--font-hanken), sans-serif;
          color: var(--text);
          font-size: 0.93rem;
          font-weight: 500;
          text-align: left;
          margin: 0;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 30px;
          max-width: 340px;
          width: 85%;
          text-align: center;
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .contact-info-list {
            flex-direction: row;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .contact-info-card {
            width: 50px;
            height: 50px;
            padding: 0;
            border-radius: 50%;
            justify-content: center;
          }
          .contact-info-card .contact-text-container {
            display: none;
          }
          .contact-info-icon {
            width: 100%;
            height: 100%;
            background: transparent;
            margin: 0;
            border: none;
          }
          .contact-form-card {
            padding: 28px 20px;
          }
        }
      `}</style>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <m.div
            className="modal-overlay"
            variants={modalBackdrop}
            initial="hidden" animate="visible" exit="exit"
            onClick={closeModal}
          >
            <m.div
              className="modal-card"
              variants={modalContent}
              initial="hidden" animate="visible" exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {status === "success" ? (
                <>
                  <m.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                    style={{ width: 56, height: 56, borderRadius: "50%", background: "#a3e635", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <m.polyline points="20 6 9 17 4 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
                    </svg>
                  </m.div>
                  <h3 style={{ fontFamily: 'var(--font-space), sans-serif', fontSize: "1.3rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Message Sent</h3>
                  <p style={{ fontFamily: 'var(--font-hanken), sans-serif', color: "var(--text-dim)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 20 }}>Thanks for reaching out. I’ll get back to you soon.</p>
                  <m.button onClick={closeModal} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} style={{ padding: "10px 28px", background: "#6e7cff", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>Close</m.button>
                </>
              ) : (
                <>
                  <m.div initial={{ x: 0 }} animate={{ x: [0, -8, 8, -8, 8, 0] }} transition={{ duration: 0.5 }} style={{ width: 56, height: 56, borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </m.div>
                  <h3 style={{ fontFamily: 'var(--font-space), sans-serif', fontSize: "1.3rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Something went wrong</h3>
                  <p style={{ fontFamily: 'var(--font-hanken), sans-serif', color: "var(--text-dim)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 20 }}>Email me at <a href="mailto:youssefrrajeh@gmail.com" style={{ color: "#6e7cff", fontWeight: 600 }}>youssefrrajeh@gmail.com</a></p>
                  <m.button onClick={closeModal} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} style={{ padding: "10px 28px", background: "#6e7cff", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>Close</m.button>
                </>
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="contact-wrapper">
        <m.h2
          className="contact-title"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          Get In Touch
        </m.h2>

        <div className="contact-grid">
          <m.div
            className="contact-form-card"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <form onSubmit={handleSubmit}>
              <label className="contact-label">Name</label>
              <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} className="contact-input" />
              <label className="contact-label">Email</label>
              <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} className="contact-input" />
              <label className="contact-label">Subject</label>
              <input type="text" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} className="contact-input" />
              <label className="contact-label">Message</label>
              <textarea name="message" placeholder="Your Message" required rows={5} value={formData.message} onChange={handleChange} className="contact-input" style={{ resize: "vertical", minHeight: 120 }} />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="contact-submit-btn"
              >
                {status === "submitting" ? (
                  <>
                    <m.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #fff", borderRadius: "50%" }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </m.div>

          <m.div
            className="contact-info-list"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {contactItems.map((item, index) => (
              <m.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-card"
                variants={staggerItem}
              >
                <div className="contact-info-icon">
                  <i className={item.icon}></i>
                </div>
                <div className="contact-text-container">
                  <h4 className="contact-info-label">{item.label}</h4>
                  <span className="contact-info-text">{item.text}</span>
                </div>
              </m.a>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
