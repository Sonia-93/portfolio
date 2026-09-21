"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import soniaImage from "@/app/sonia.png";
import styles from "./AboutSection.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutSection() {
  const textColRef = useRef<HTMLDivElement>(null);
  const textInView = useInView(textColRef, { once: true, margin: "-10% 0px" });

  const imageRef = useRef<HTMLDivElement>(null);
  const imageInView = useInView(imageRef, { once: true, margin: "-10% 0px" });

  return (
    <section className={styles.about} id="about">
      <div className={styles.twoCol}>
        <div ref={textColRef} className={styles.textCol}>
          <div className={styles.textTorch} aria-hidden="true" />

          <motion.h2
            className={styles.aboutTitle}
            initial={{ opacity: 0, y: 36 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.08, ease }}
          >
            ABOUT ME
          </motion.h2>

          <motion.div
            className={styles.fullName}
            initial={{ opacity: 0, y: 22 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.26, ease }}
          >
            SHIMIRWA TETA Sonia
          </motion.div>

          <motion.div
            className={styles.roleLine}
            initial={{ opacity: 0, y: 18 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.38, ease }}
          >
            Backend Developer &amp; Cyber Security Enthusiast
          </motion.div>

          <motion.div
            className={styles.textDivider}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={textInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.05, delay: 0.5, ease }}
          />

          <motion.p
            className={styles.body}
            initial={{ opacity: 0, y: 24 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.62, ease }}
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
            transition={{ duration: 0.9, delay: 0.78, ease }}
          >
            My passion for backend engineering goes hand-in-hand with my love for
            cyber security. I build systems with security baked in from the ground
            up — hardening APIs, implementing least-privilege access controls,
            and crafting robust authentication &amp; encryption layers. Whether I&apos;m
            optimising a PostgreSQL query or analysing network traffic for
            vulnerabilities, I believe great software is both <em className={styles.em}>blazing fast</em> and
            <em className={styles.em}> deeply secure</em>.
          </motion.p>
        </div>

        <motion.div
          ref={imageRef}
          className={styles.imageCol}
          initial={{ opacity: 0, x: 48, scale: 0.94 }}
          animate={imageInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1.15, delay: 0.22, ease }}
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
              <span className={styles.portraitVeil} aria-hidden="true" />
            </div>
            <motion.span
              className={styles.cornerTopLeft}
              aria-hidden="true"
              initial={{ opacity: 0, x: -8, y: -8 }}
              animate={imageInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.7, ease }}
            />
            <motion.span
              className={styles.cornerTopRight}
              aria-hidden="true"
              initial={{ opacity: 0, x: 8, y: -8 }}
              animate={imageInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.78, ease }}
            />
            <motion.span
              className={styles.cornerBottomLeft}
              aria-hidden="true"
              initial={{ opacity: 0, x: -8, y: 8 }}
              animate={imageInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.86, ease }}
            />
            <motion.span
              className={styles.cornerBottomRight}
              aria-hidden="true"
              initial={{ opacity: 0, x: 8, y: 8 }}
              animate={imageInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.94, ease }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
