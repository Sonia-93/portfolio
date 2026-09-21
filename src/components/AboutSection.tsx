"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import soniaImage from "@/app/sonia.png";
import styles from "./AboutSection.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

const SKILLS = [
  "NODE.JS",
  "PYTHON",
  "POSTGRESQL",
  "REDIS",
  "DOCKER",
  "REST APIS",
  "GRAPHQL",
  "AWS",
  "PENETRATION TESTING",
  "NETWORK SECURITY",
];

function useTypingEffect(
  text: string,
  startDelay: number,
  baseSpeed: number,
  variance: number,
  startTrigger: boolean
) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTrigger) return;

    let index = 0;
    let timeoutId: NodeJS.Timeout;
    let cancelled = false;

    const startTimeout = setTimeout(() => {
      const type = () => {
        if (cancelled) return;
        if (index <= text.length) {
          setDisplayed(text.slice(0, index));
          index++;
          if (index <= text.length) {
            const jitter = Math.random() * variance;
            timeoutId = setTimeout(type, baseSpeed + jitter);
          } else {
            setDone(true);
          }
        }
      };
      type();
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, startDelay, baseSpeed, variance, startTrigger]);

  return { displayed, done };
}

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const textColRef = useRef<HTMLDivElement>(null);
  const textSeen = useInView(textColRef, { once: true, margin: "-10% 0px" });
  const textInView = mounted && textSeen;

  const imageRef = useRef<HTMLDivElement>(null);
  const imageSeen = useInView(imageRef, { once: true, margin: "-10% 0px" });
  const imageInView = mounted && imageSeen;

  const { displayed: titleText, done: titleDone } = useTypingEffect(
    "ABOUT ME",
    180,
    70,
    40,
    textInView
  );

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 160, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 160, damping: 18 });

  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightSize = useMotionValue(0);
  const smoothSize = useSpring(spotlightSize, { stiffness: 120, damping: 20 });
  const colorMask = useTransform(
    [spotlightX, spotlightY, smoothSize],
    ([x, y, size]) =>
      `radial-gradient(circle ${size}px at ${x}% ${y}%, #000 0%, #000 38%, transparent 72%)`
  );

  const onImageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 14);
    rotateX.set((0.5 - py) * 14);
    spotlightX.set(px * 100);
    spotlightY.set(py * 100);
    spotlightSize.set(210);
  };

  const onImageLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    spotlightSize.set(0);
  };

  return (
    <section className={styles.about} id="about">
      <div className={styles.twoCol}>
        <div ref={textColRef} className={styles.textCol}>
          <h2 className={`sectionTitle ${styles.aboutTitle}`}>
            {titleText}
            {textInView && !titleDone && <span className={styles.typingCursor} />}
          </h2>

          <motion.div
            className={styles.fullName}
            initial={{ opacity: 0, y: 22 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.55, ease }}
          >
            SHIMIRWA TETA Sonia
          </motion.div>

          <motion.div
            className={styles.roleLine}
            initial={{ opacity: 0, y: 18 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.68, ease }}
          >
            Backend Developer & Cyber Security Enthusiast
          </motion.div>

          <motion.div
            className={styles.textDivider}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={textInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.05, delay: 0.8, ease }}
          />

          <motion.p
            className={styles.body}
            initial={{ opacity: 0, y: 24 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.92, ease }}
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
            transition={{ duration: 0.9, delay: 1.05, ease }}
          >
            My passion for backend engineering goes hand-in-hand with my love for
            cyber security. I build systems with security baked in from the ground
            up — hardening APIs, implementing least-privilege access controls,
            and crafting robust authentication & encryption layers. Whether I&apos;m
            optimising a PostgreSQL query or analysing network traffic for
            vulnerabilities, I believe great software is both <em className={styles.em}>blazing fast</em> and
            <em className={styles.em}> deeply secure</em>.
          </motion.p>

          <motion.ul
            className={styles.skills}
            initial="hidden"
            animate={textInView ? "show" : "hidden"}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 1.18 } },
            }}
          >
            {SKILLS.map((skill) => (
              <motion.li
                key={skill}
                className={styles.skill}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.92 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                whileHover={{ scale: 1.06, y: -2 }}
                transition={{ duration: 0.28, ease }}
              >
                {skill}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          ref={imageRef}
          className={styles.imageCol}
          initial={{ opacity: 0, x: 48, scale: 0.94 }}
          animate={imageInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1.15, delay: 0.22, ease }}
        >
          <motion.div
            className={styles.imageFrame}
            style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
            onMouseMove={onImageMove}
            onMouseLeave={onImageLeave}
          >
            <div className={styles.imageInner}>
              <Image
                src={soniaImage}
                alt=""
                aria-hidden="true"
                className={`${styles.portrait} ${styles.portraitBw}`}
                priority
              />
              <motion.div className={styles.colorReveal} style={{ WebkitMaskImage: colorMask, maskImage: colorMask }}>
                <Image
                  src={soniaImage}
                  alt="SHIMIRWA TETA Sonia — Backend Developer"
                  className={`${styles.portrait} ${styles.portraitColor}`}
                  priority
                />
              </motion.div>
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
