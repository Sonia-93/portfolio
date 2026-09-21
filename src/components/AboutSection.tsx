"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import soniaImage from "@/app/sonia.png";
import styles from "./AboutSection.module.css";

const SKILLS = [
  "Node.js", "Python", "PostgreSQL", "Redis",
  "Docker", "REST APIs", "GraphQL", "AWS",
  "Penetration Testing", "Network Security",
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

  const textColRef = useRef<HTMLDivElement>(null);
  const textInView = useInView(textColRef, { once: true, margin: "-10% 0px" });

  const imageRef = useRef<HTMLDivElement>(null);
  const imageInView = useInView(imageRef, { once: true, margin: "-10% 0px" });

  return (
    <section ref={sectionRef} className={styles.about} id="about">

      {/* ── Two-column wrapper ── */}
      <div className={styles.twoCol}>

        {/* ── LEFT: Text column ── */}
        <div ref={textColRef} className={styles.textCol}>

          {/* "ABOUT ME" headline — Bebas Neue (same as I BUILD SYSTEMS) */}
          <motion.h2
            className={styles.aboutTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            ABOUT ME
          </motion.h2>

          {/* Full name line */}
          <motion.div
            className={styles.fullName}
            initial={{ opacity: 0, y: 20 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.28, ease: "easeOut" }}
          >
            SHIMIRWA TETA Sonia
          </motion.div>

          {/* Role / Title line */}
          <motion.div
            className={styles.roleLine}
            initial={{ opacity: 0, y: 20 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Backend Developer &amp; Cyber Security Enthusiast
          </motion.div>

          {/* Divider */}
          <motion.div
            className={styles.textDivider}
            initial={{ scaleX: 0 }}
            animate={textInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Bio paragraphs */}
          <motion.p
            className={styles.body}
            initial={{ opacity: 0, y: 24 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
          >
            I&apos;m <strong className={styles.strong}>SHIMIRWA TETA Sonia</strong>, a backend developer
            and cyber security enthusiast based in Kigali, Rwanda. I specialise in
            designing robust, high-throughput server-side architectures — turning
            complex business requirements into clean, scalable APIs and secure
            data pipelines.
          </motion.p>

          <motion.p
            className={styles.body}
            initial={{ opacity: 0, y: 24 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            My passion for backend engineering goes hand-in-hand with my love for
            cyber security. I build systems with security baked in from the ground
            up — hardening APIs, implementing least-privilege access controls,
            and crafting robust authentication &amp; encryption layers. Whether I&apos;m
            optimising a PostgreSQL query or analysing network traffic for
            vulnerabilities, I believe great software is both <em className={styles.em}>blazing fast</em> and
            <em className={styles.em}> deeply secure</em>.
          </motion.p>

          {/* Skill tags */}
          <div className={styles.skillsRow}>
            {SKILLS.map((s, i) => (
              <SkillTag key={s} label={s} delay={0.95 + i * 0.05} />
            ))}
          </div>

        </div>

        {/* ── RIGHT: Image column ── */}
        <motion.div
          ref={imageRef}
          className={styles.imageCol}
          initial={{ opacity: 0, x: 40, scale: 0.98 }}
          animate={imageInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.imageFrame}>
            <div className={styles.imageGlow} aria-hidden="true" />
            <div className={styles.imageInner}>
              <Image
                src={soniaImage}
                alt="SHIMIRWA TETA Sonia — Backend Developer"
                className={styles.portrait}
                priority
              />
            </div>
            {/* Corner accents */}
            <span className={styles.cornerTopLeft} aria-hidden="true" />
            <span className={styles.cornerTopRight} aria-hidden="true" />
            <span className={styles.cornerBottomLeft} aria-hidden="true" />
            <span className={styles.cornerBottomRight} aria-hidden="true" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
