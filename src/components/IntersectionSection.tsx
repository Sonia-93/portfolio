"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, MotionValue, useInView, useMotionValue, animate } from "framer-motion";
import { Gauge, Layers, Zap } from "lucide-react";
import styles from "./IntersectionSection.module.css";

// ─── Data tailored specifically for Backend Engineering ──────────────────────
const CIRCLES = [
  { id: "architecture", label: "ARCHITECTURE", Icon: Layers, targetContentX: -35, targetContentY: 30 },
  { id: "performance",  label: "PERFORMANCE",  Icon: Gauge,  targetContentX: 0,   targetContentY: -50 },
  { id: "scalability",  label: "SCALABILITY",  Icon: Zap,    targetContentX: 35,  targetContentY: 30 },
] as const;

// Sizes (diameter)
const SMALL = 44;
const LARGE = 360;

// Initial horizontal row positions (Loading reference)
const H_X = [-240, 0, 240];

// Final triangular Venn diagram positions
const V_X = [-90, 0, 90];
const V_Y = [75, -90, 75];

function useTypingEffect(
  text: string,
  startDelay: number,
  baseSpeed: number = 55,
  variance: number = 45,
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

// ─── Individual animated circle ──────────────────────────────────────────────
function AnimatedCircle({
  index,
  icon: Icon,
  label,
  targetContentX,
  targetContentY,
  progress,
}: {
  index: number;
  icon: React.ElementType;
  label: string;
  targetContentX: number;
  targetContentY: number;
  progress: MotionValue<number>;
}) {
  // Step 1: Initial load — Small inner circles appear horizontally together
  const appStart = 0.02 + index * 0.04;
  const appEnd   = appStart + 0.12;

  // Step 2: Outer circle appears and grows around each small circle
  const growStart = 0.20;
  const growEnd   = 0.45;

  // Step 3: Morph from horizontal row into triangular Venn diagram
  const morphStart = 0.45;
  const morphEnd   = 0.70;

  const opacity = useTransform(
    progress,
    [0, appStart, appEnd, 1],
    [0, 0, 1, 1]
  );

  const size = useTransform(
    progress,
    [0, growStart, growEnd, 1],
    [SMALL, SMALL, LARGE, LARGE]
  );

  const x = useTransform(
    progress,
    [0, morphStart, morphEnd, 1],
    [H_X[index], H_X[index], V_X[index], V_X[index]]
  );

  const y = useTransform(
    progress,
    [0, morphStart, morphEnd, 1],
    [0, 0, V_Y[index], V_Y[index]]
  );

  const contentX = useTransform(
    progress,
    [0, morphStart, morphEnd, 1],
    [0, 0, targetContentX, targetContentX]
  );

  const contentY = useTransform(
    progress,
    [0, morphStart, morphEnd, 1],
    [0, 0, targetContentY, targetContentY]
  );

  const outerStrokeOpacity = useTransform(
    progress,
    [0, growStart, growEnd, 1],
    [0, 0, 0.3, 0.3]
  );

  const circumference = useTransform(size, (s) => Math.PI * s);
  const dashoffset = useTransform(
    progress,
    [growStart, growEnd, 1],
    [Math.PI * SMALL, 0, 0]
  );

  const cx_cy = useTransform(size, (s) => s / 2);
  const r = useTransform(size, (s) => s / 2 - 1);

  const labelOpacity = useTransform(
    progress,
    [appStart, appEnd, 1],
    [0, 1, 1]
  );

  return (
    <motion.div
      className={styles.circleWrapper}
      style={{ x, y, opacity, width: size, height: size }}
    >
      <motion.svg
        style={{ position: "absolute", inset: 0, width: size, height: size }}
        overflow="visible"
      >
        <motion.circle
          style={{
            cx: cx_cy,
            cy: cx_cy,
            r,
            strokeDasharray: circumference,
            strokeDashoffset: dashoffset,
            transformOrigin: "center",
            rotate: "-90deg",
            opacity: outerStrokeOpacity,
          }}
          fill="none"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </motion.svg>

      <motion.div
        className={styles.circleContent}
        style={{ x: contentX, y: contentY }}
      >
        <motion.div className={styles.innerIconCircle}>
          <Icon size={18} strokeWidth={2.2} color="#ffffff" />
        </motion.div>

        <motion.span
          className={styles.circleLabel}
          style={{ opacity: labelOpacity }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function IntersectionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(headlineRef, {
    once: false,
    margin: "0px 0px -30% 0px",
  });

  const { displayed: line1, done: done1 } = useTypingEffect(
    "I BUILD SYSTEMS",
    0,
    55,
    30,
    sectionInView
  );
  const { displayed: line2, done: done2 } = useTypingEffect(
    "AT THE INTERSECTION OF :",
    50,
    50,
    25,
    done1
  );

  const typingFullyDone = done1 && done2;

  // ── AUTO-PLAY circle steps after typing finishes ──
  const autoProgress = useMotionValue(0);

  useEffect(() => {
    if (!typingFullyDone) return;
    const controls = animate(autoProgress, 1, {
      duration: 5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.15,
    });
    return controls.stop;
  }, [typingFullyDone, autoProgress]);

  // Reset circles progress if user scrolls away & back
  useEffect(() => {
    if (!sectionInView) {
      autoProgress.jump(0);
    }
  }, [sectionInView, autoProgress]);

  const lineScaleY = useTransform(autoProgress, [0, 0.95], [0, 1]);

  return (
    <div ref={sectionRef} className={styles.scrollSection}>
      <div className={styles.sticky}>

        {/* Left progress line */}
        <div className={styles.progressTrack}>
          <motion.div
            className={styles.progressFill}
            style={{ scaleY: lineScaleY, originY: 0 }}
          />
        </div>

        {/* Headline */}
        <div ref={headlineRef} className={styles.headline}>
          <h2 className={styles.headlineText}>
            <span className={styles.headlineLine1}>
              {line1 || sectionInView ? line1 : null}
              {!done1 && sectionInView && line1 !== undefined && (
                <span className={styles.typingCursor} />
              )}
            </span>
            <span className={styles.headlineLine2}>
              {line2 || (sectionInView && done1) ? line2 : null}
              {done1 && !done2 && sectionInView && (
                <span className={styles.typingCursor} />
              )}
            </span>
          </h2>
        </div>

        {/* Circles stage */}
        <div className={styles.stage}>
          {CIRCLES.map(({ id, label, Icon, targetContentX, targetContentY }, i) => (
            <AnimatedCircle
              key={id}
              index={i}
              icon={Icon}
              label={label}
              targetContentX={targetContentX}
              targetContentY={targetContentY}
              progress={autoProgress}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
