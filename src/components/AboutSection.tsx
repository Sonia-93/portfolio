"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import styles from "./AboutSection.module.css";

const SKILLS = [
  "Node.js", "Python", "PostgreSQL", "Redis",
  "Docker", "REST APIs", "GraphQL", "AWS",
];

function SkillTag({ label, delay }: { label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.span
      ref={ref}
      className={styles.skillTag}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {label}
    </motion.span>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-12% 0px" });

  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-5% 0px" });

  return (
    <section ref={sectionRef} className={styles.about} id="about">

      {/* ── Divider line draws in ── */}
      <div ref={lineRef} className={styles.dividerWrap} aria-hidden="true">
        <motion.div
          className={styles.dividerLine}
          initial={{ scaleX: 0 }}
          animate={lineInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className={styles.dividerDot}
          initial={{ opacity: 0, scale: 0 }}
          animate={lineInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.9 }}
        />
      </div>

      {/* ── Main headline block ── */}
      <div className={styles.headlineBlock}>

        {/* Line 1 */}
        <div className={styles.headlineRow}>
          <motion.h2
            className={styles.headlineSolid}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            I CRAFT BACKEND SYSTEMS
          </motion.h2>
        </div>

        {/* Line 2 */}
        <div className={styles.headlineRow}>
          <motion.span
            className={styles.headlineSolid}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            WITH
          </motion.span>
        </div>

        {/* Line 3 — italic accent */}
        <div className={styles.headlineRow}>
          <motion.span
            className={styles.headlineItalic}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            PRECISION AND SCALE.
          </motion.span>
        </div>
      </div>

      {/* ── Body copy ── */}
      <motion.p
        className={styles.body}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
      >
        I'm a backend developer based in Kigali, Rwanda. I specialise in
        designing robust, high-throughput server-side architectures — turning
        complex business requirements into clean, scalable APIs and data
        pipelines.
      </motion.p>

      {/* ── Skill tags ── */}
      <div className={styles.skillsRow}>
        {SKILLS.map((s, i) => (
          <SkillTag key={s} label={s} delay={1.0 + i * 0.07} />
        ))}
      </div>

    </section>
  );
}
