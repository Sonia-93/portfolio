"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
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
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            Let&apos;s Work<br />Together
          </motion.h2>
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
            <a href="mailto:sonia@example.com" className={styles.contactLink}>
              <span className={styles.linkIcon}>✉</span>
              sonia@example.com
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.contactLink}>
              <span className={styles.linkIcon}>⌥</span>
              github.com/sonia
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.contactLink}>
              <span className={styles.linkIcon}>in</span>
              linkedin.com/in/sonia
            </a>
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
              <button className={styles.resetBtn} onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}>
                Send another
              </button>
            </motion.div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Message</label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                />
              </div>
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
