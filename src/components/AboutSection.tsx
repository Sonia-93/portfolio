"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Camera, Share2, GitBranch } from "lucide-react";
import soniaImage from "@/app/sonia.png";
import styles from "./AboutSection.module.css";

function useTypingEffect(
  text: string,
  startDelay: number,
  baseSpeed: number = 12,
  variance: number = 10,
  startTrigger: boolean = true
) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTrigger) {
      setDisplayed("");
      setDone(false);
      return;
    }

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

const P2_TEXT = "My journey in tech is driven by a fascination with how systems work under the hood and how to protect them from malicious threats. I specialize in building scalable server-side applications.";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const textInView = useInView(textColRef, {
    once: false,
    margin: "0px 0px -25% 0px",
  });

  const imageRef = useRef<HTMLDivElement>(null);
  const imageInView = useInView(imageRef, { once: true, margin: "0px 0px -10% 0px" });

  const frameRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  // ── Typing on "ABOUT ME" title — starts FRESH every time user reaches section ──
  const { displayed: typedTitle, done: titleDone } = useTypingEffect(
    "ABOUT ME",
    0,
    65,
    30,
    textInView
  );

  return (
    <section ref={sectionRef} className={styles.about} id="about">

      <div className={styles.twoCol}>

        <div ref={textColRef} className={styles.textCol}>

          {/* ABOUT ME title with typing */}
          <h2 className={styles.aboutTitle}>
            {typedTitle || textInView ? (
              <>
                {typedTitle}
                {!titleDone && textInView && (
                  <span style={{ opacity: 0.7, marginLeft: 2 }}>_</span>
                )}
              </>
            ) : null}
          </h2>

          {/* Bio paragraphs — appear ALL AT ONCE after title finishes typing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.body}>
              <strong className={styles.strongInline}>Shimirwa Teta Sonia</strong>, a passionate Backend Developer and Cyber Security Enthusiast currently studying at the prestigious Rwanda Coding Academy.
            </p>

            <p className={styles.body}>{P2_TEXT}</p>

            <p className={styles.body}>
              When I'm not writing APIs or configuring databases, you can find me participating in <em className={styles.emInline}>CTF (Capture The Flag)</em> challenges, analyzing network traffic, or exploring the latest vulnerabilities in the cybersecurity landscape.
            </p>

            {/* Social icons */}
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            </div>
          </motion.div>

        </div>

        <motion.div
          ref={imageRef}
          className={styles.imageCol}
          initial={{ opacity: 0, x: 40, scale: 0.98 }}
          animate={imageInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={frameRef}
            className={`${styles.imageFrame} ${isHovering ? styles.isSpotlight : ""}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            style={{
              ["--mx" as any]: "50%",
              ["--my" as any]: "50%",
            }}
          >
            <div className={styles.imageClip}>
              <Image
                src={soniaImage}
                alt="Shimirwa Teta Sonia — Backend Developer"
                className={styles.portraitOriginal}
                priority
              />
              <div className={styles.portraitBW}>
                <Image
                  src={soniaImage}
                  alt=""
                  className={styles.portraitBWGrey}
                  aria-hidden="true"
                />
              </div>
            </div>

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
