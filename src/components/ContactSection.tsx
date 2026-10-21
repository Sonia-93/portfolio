"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, GitBranch, Link } from "lucide-react";
import TypingHeading from "./TypingHeading";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your message could not be sent. Please try again.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message could not be sent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        {/* Left */}
        <div className={styles.left}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Get in touch
          </motion.span>
          <TypingHeading className={styles.title} text="Let’s Work Together" />
          <motion.p
            className={styles.desc}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.16 }}
          >
            Have a project in mind or want to collaborate? I&apos;m open to backend development roles, freelance work, and interesting projects.
          </motion.p>

          <motion.div
            className={styles.links}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <a href="mailto:shimirwasonia5@gmail.com" className={styles.contactCard}>
              <span className={styles.cardIcon}><Mail size={18} /></span>
              <span className={styles.cardInfo}>
                <span className={styles.cardLabel}>Email</span>
                <span className={styles.cardValue}>shimirwasonia5@gmail.com</span>
              </span>
            </a>
            <a href="tel:+250792283148" className={styles.contactCard}>
              <span className={styles.cardIcon}><GitBranch size={18} /></span>
              <span className={styles.cardInfo}>
                <span className={styles.cardLabel}>Phone</span>
                <span className={styles.cardValue}>+250 792 283 148</span>
              </span>
            </a>
            <div className={styles.contactCard}>
              <span className={styles.cardIcon}><Link size={18} /></span>
              <span className={styles.cardInfo}>
                <span className={styles.cardLabel}>Location</span>
                <span className={styles.cardValue}>Muhanga, Rwanda</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right — form */}
        <motion.div
          className={styles.formWrap}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {sent ? (
            <motion.div
              className={styles.success}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className={styles.successIcon}>✓</span>
              <h3 className={styles.successTitle}>Message sent!</h3>
              <p className={styles.successDesc}>Thanks for reaching out. I&apos;ll get back to you soon.</p>
              <button className={styles.resetBtn} onClick={() => { setSent(false); setError(""); setForm({ name: "", email: "", message: "" }); }}>
                Send another
              </button>
            </motion.div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  className={styles.input}
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  className={styles.input}
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                />
              </div>
              {error && <p className={styles.formError} role="alert">{error}</p>}
              <button className={styles.submitBtn} type="submit" disabled={loading}>
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
