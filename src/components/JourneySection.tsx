"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";
import { Car } from "lucide-react";
import styles from "./JourneySection.module.css";

// ── Road path: viewBox 1200 × 420 EXACTLY matches CSS aspect-ratio, no letterboxing!
//    Start at x=-50 / end at x=1250 so line bleeds past both edges so you never see a cut-off.
//    Valley at (300, 270) · Peak at (600, 120) · Valley at (900, 270)
const ROAD_PATH =
  "M -50 190 C 80 190, 170 260, 300 270 C 430 280, 470 140, 600 120 C 730 100, 770 260, 900 270 C 1030 280, 1120 190, 1250 190";

// Stops placed exactly ON the white road SVG points
const STOP_CX = [300, 600, 900];
const STOP_CY = [270, 120, 270];

const MILESTONES = [
  {
    stopFrac: 0.25,
    posClass: "msPos0",
    bigNumber: "01",
    title: "1+ Year of Experience",
    description:
      "Building production-ready backend systems, APIs, and database architectures that scale with traffic.",
  },
  {
    stopFrac: 0.5,
    posClass: "msPos1",
    bigNumber: "02",
    title: "7 Projects Completed",
    description:
      "From REST/GraphQL APIs to real-time services with Redis & Docker — shipped across the full backend stack.",
  },
  {
    stopFrac: 0.75,
    posClass: "msPos2",
    bigNumber: "03",
    title: "Internship · Velora",
    description:
      "Completed an internship at Velora where I worked alongside a group of backend developers — building production APIs, databases, and services together on real engineering projects.",
  },
];

function useTypingEffect(
  text: string,
  startDelay: number,
  baseSpeed: number = 55,
  variance: number = 40,
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

export default function JourneySection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(wrapperRef, {
    once: false,
    margin: "0px 0px -35% 0px",
  });

  // ── Step 1: Type "THE JOURNEY SO FAR" ──
  const { displayed: titleText, done: titleDone } = useTypingEffect(
    "The Journey So Far",
    0,
    55,
    30,
    sectionInView
  );

  const labelShown = sectionInView;

  // ── Step 2: AFTER title finishes typing → start car 0 → 1 (10s) ──
  const journeyProgress = useMotionValue(0);

  useEffect(() => {
    if (!titleDone) return;
    // ALWAYS restart from 0 every time typing finishes → no "jump to midpoint!
    journeyProgress.jump(0);
    const controls = animate(journeyProgress, 1, {
      duration: 10,
      ease: "easeInOut",
      delay: 0.25,
    });
    return controls.stop;
  }, [titleDone, journeyProgress]);

  const journeyPct = useTransform(journeyProgress, (v) => `${v * 100}%`);

  // ── Milestone stop glows (light up AS the car reaches each one) ──
  const stopGlow0 = useTransform(journeyProgress, [0.16, 0.25, 0.4], [0.25, 1, 0.85]);
  const stopGlow1 = useTransform(journeyProgress, [0.41, 0.5, 0.66], [0.25, 1, 0.85]);
  const stopGlow2 = useTransform(journeyProgress, [0.66, 0.75, 0.91], [0.25, 1, 0.85]);
  const stopGlows = [stopGlow0, stopGlow1, stopGlow2];

  // ── Milestone text cards reveal ONLY *AFTER* the car has reached the stop
  const msReveal0 = useTransform(journeyProgress, [0.27, 0.40], [0, 1]);
  const msReveal1 = useTransform(journeyProgress, [0.52, 0.65], [0, 1]);
  const msReveal2 = useTransform(journeyProgress, [0.77, 0.90], [0, 1]);
  const msReveals = [msReveal0, msReveal1, msReveal2];

  const msY0 = useTransform(journeyProgress, [0.27, 0.40], [22, 0]);
  const msY1 = useTransform(journeyProgress, [0.52, 0.65], [-22, 0]);
  const msY2 = useTransform(journeyProgress, [0.77, 0.90], [22, 0]);
  const msYs = [msY0, msY1, msY2];

  return (
    <section ref={wrapperRef} className={styles.journey} id="journey">

      <div className={styles.titleWrap}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={labelShown ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={styles.sectionLabel}
        >
          Milestones
        </motion.div>
        <h2 className={styles.sectionTitle}>
          {titleText || sectionInView ? (
            <>
              {titleText}
              {!titleDone && sectionInView && (
                <span
                  style={{
                    display: "inline-block",
                    width: 4,
                    height: "0.9em",
                    background: "#ffffff",
                    marginLeft: 8,
                    verticalAlign: "baseline",
                    boxShadow: "0 0 10px rgba(255,255,255,0.9)",
                    borderRadius: 2,
                    animation: "blinkCursor 0.75s ease-in-out infinite",
                  }}
                />
              )}
            </>
          ) : null}
        </h2>
      </div>

      <div className={styles.roadWrap}>

        {/* SVG road + stops — viewBox matches aspect ratio 1200×420 perfectly */}
        <svg
          className={styles.roadSvg}
          viewBox="0 0 1200 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="roadGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="stopGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="11" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            id="roadPath"
            className={styles.roadLine}
            filter="url(#roadGlow)"
            d={ROAD_PATH}
          />

          {MILESTONES.map((m, i) => (
            <g key={m.bigNumber}>
              <motion.circle
                cx={STOP_CX[i]}
                cy={STOP_CY[i]}
                r="15"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                style={{ opacity: stopGlows[i] }}
                filter="url(#stopGlow)"
              />
              <motion.circle
                cx={STOP_CX[i]}
                cy={STOP_CY[i]}
                r="8"
                className={styles.stopDot}
                fill="#ffffff"
                style={{ opacity: stopGlows[i] }}
              />
            </g>
          ))}
        </svg>

        {/* Car rides directly on the white road line */}
        <motion.div
          className={styles.car}
          aria-hidden="true"
          style={{
            offsetPath: `path('${ROAD_PATH}')`,
            offsetDistance: journeyPct,
            offsetRotate: "auto",
          }}
        >
          <Car size={24} strokeWidth={1.6} />
        </motion.div>

        {MILESTONES.map((m, i) => (
          <motion.div
            key={m.bigNumber}
            className={`${styles.milestone} ${styles[m.posClass]}`}
            style={{
              opacity: msReveals[i],
              y: msYs[i],
            }}
          >
            <span className={styles.msBigNumber} aria-hidden="true">
              {m.bigNumber}
            </span>
            <h3 className={styles.msTitle}>{m.title}</h3>
            <p className={styles.msDescription}>{m.description}</p>
          </motion.div>
        ))}

      </div>

      <style jsx global>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
