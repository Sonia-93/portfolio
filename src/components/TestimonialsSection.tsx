"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TestimonialsSection.module.css";

const testimonials = [
  {
    quote: "Sonia delivered clean, scalable backend architecture that exceeded our expectations. Her attention to detail and problem-solving skills are outstanding.",
    name: "Alex M.",
    role: "CTO, TechStartup",
    initials: "AM",
    photo: "",
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
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const go = (next: number, dir: number) => {
    setDirection(dir);
    setActive(next);
  };

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const prev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    go((active - 1 + testimonials.length) % testimonials.length, -1);
    startAuto();
  };

  const next = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    go((active + 1) % testimonials.length, 1);
    startAuto();
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section className={styles.section}>
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
          >
            <span className={styles.quoteIcon}>"</span>
            <p className={styles.quote}>{testimonials[active].quote}</p>
            <div className={styles.author}>
              <div className={styles.avatar}>
                {testimonials[active].photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={testimonials[active].photo} alt={testimonials[active].name} className={styles.avatarImg} />
                ) : (
                  <span>{testimonials[active].initials}</span>
                )}
              </div>
              <div>
                <p className={styles.name}>{testimonials[active].name}</p>
                <p className={styles.role}>{testimonials[active].role}</p>
              </div>
            </div>
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
