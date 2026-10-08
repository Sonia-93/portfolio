"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TestimonialsSection.module.css";

const testimonials = [
  {
    quote: "Sonia delivered clean, scalable backend architecture that exceeded our expectations. Her attention to detail and problem-solving skills are outstanding.",
    name: "Irasubiza Saly Nelson",
    role: "CEO, Velora",
    initials: "IS",
    photo: "/saly.png",
  },
  {
    quote: "Working with Sonia was a pleasure. She built our entire API layer from scratch — well-documented, fast, and exactly what we needed.",
    name: "Jordan K.",
    role: "Product Manager, Velora",
    initials: "JK",
    photo: "",
  },
  {
    quote: "Sonia has a rare combination of technical depth and communication skills. She understood our requirements immediately and delivered ahead of schedule.",
    name: "Sarah L.",
    role: "Lead Developer, CodeBridge",
    initials: "SL",
    photo: "",
  },
  {
    quote: "The database architecture Sonia designed for us handles thousands of concurrent users without breaking a sweat. Impressive work.",
    name: "Daniel R.",
    role: "Founder, WasteNet",
    initials: "DR",
    photo: "",
  },
  {
    quote: "Sonia brought UmucoCore to life with a solid backend that handles our media-heavy archive beautifully. Her commitment to quality is unmatched.",
    name: "Hope Mutimutuje",
    role: "Co-Founder, UmucoCore",
    initials: "HM",
    photo: "/hope.jpg",
  },
  {
    quote: "Umurerwa Aubierge's vision for UmucoCore demanded a reliable, scalable system — Sonia delivered exactly that with clean architecture and zero downtime.",
    name: "Umurerwa Aubierge",
    role: "UmucoCore",
    initials: "UA",
    photo: "/aubi.jpg",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const go = (next: number, dir: number) => {
    setDirection(dir);
    setActive(next);
  };

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      startAuto();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

  const prev = () => {
    go((active - 1 + testimonials.length) % testimonials.length, -1);
    startAuto();
  };

  const next = () => {
    go((active + 1) % testimonials.length, 1);
    startAuto();
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.labelWrap}>
        <span className={styles.label}>What people say</span>
        <h2 className={styles.title}>Client Testimonials</h2>
      </div>

      <div className={styles.carousel}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={styles.card}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Top row: photo + name/role + github */}
            <div className={styles.cardTop}>
              <div className={styles.photoWrap}>
                {testimonials[active].photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimonials[active].photo}
                    alt={testimonials[active].name}
                    className={styles.photo}
                    style={{ filter: paused ? "none" : "grayscale(100%)", transition: "filter 0.3s ease" }}
                  />
                ) : (
                  <div className={styles.photoPlaceholder}>{testimonials[active].initials}</div>
                )}
              </div>
              <div className={styles.authorInfo}>
                <p className={styles.name}>{testimonials[active].name}</p>
                <p className={styles.role}>{testimonials[active].role}</p>
              </div>
              <div className={styles.githubIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
            </div>

            {/* Quote */}
            <p className={styles.quote}>"{testimonials[active].quote}"</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prev} aria-label="Previous">←</button>
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                onClick={() => { go(i, i > active ? 1 : -1); }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button className={styles.navBtn} onClick={next} aria-label="Next">→</button>
        </div>
      </div>
    </section>
  );
}
