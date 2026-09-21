"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
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
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.body}>
              <strong className={styles.strongInline}>Shimirwa Teta Sonia</strong>, a passionate Backend Developer and Cyber Security Enthusiast currently studying at the prestigious Rwanda Coding Academy.
            </p>

            <p className={styles.body}>{P2_TEXT}</p>

            <p className={styles.body}>
              When I'm not writing APIs or configuring databases, you can find me participating in <em className={styles.emInline}>CTF (Capture The Flag)</em> challenges, analyzing network traffic, or exploring the latest vulnerabilities in the cybersecurity landscape.
            </p>
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
