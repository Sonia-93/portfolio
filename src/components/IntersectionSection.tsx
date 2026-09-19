"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Gauge, Layers, Zap } from "lucide-react";
import styles from "./IntersectionSection.module.css";

// ─── Data tailored specifically for Backend Engineering ──────────────────────
// 0: Architecture (Bottom Left in Venn)
// 1: Performance (Top Center in Venn)
// 2: Scalability (Bottom Right in Venn)
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

  // Wrapper opacity: Appears at appStart, stays locked at 1.0 (never fades out)
  const opacity = useTransform(
    progress,
    [0, appStart, appEnd, 1],
    [0, 0, 1, 1]
  );

  // Outer circle size: SMALL (44px) -> LARGE (360px)
  const size = useTransform(
    progress,
    [0, growStart, growEnd, 1],
    [SMALL, SMALL, LARGE, LARGE]
  );

  // Position X: H_X -> V_X
  const x = useTransform(
    progress,
    [0, morphStart, morphEnd, 1],
    [H_X[index], H_X[index], V_X[index], V_X[index]]
  );

  // Position Y: 0 -> V_Y[index] (Morphs into triangular set)
  const y = useTransform(
    progress,
    [0, morphStart, morphEnd, 1],
    [0, 0, V_Y[index], V_Y[index]]
  );

  // Inner content offsets: 0 -> targetContentX/Y during morph so inner circles sit inside their respective outer circle space
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

  // Outer SVG Stroke Opacity: 0 at start, turns on as outer ring grows
  const outerStrokeOpacity = useTransform(
    progress,
    [0, growStart, growEnd, 1],
    [0, 0, 0.3, 0.3]
  );

  // Outer stroke draw effect
  const circumference = useTransform(size, (s) => Math.PI * s);
  const dashoffset = useTransform(
    progress,
    [growStart, growEnd, 1],
    [Math.PI * SMALL, 0, 0]
  );

  // Derived SVG geometry
  const cx_cy = useTransform(size, (s) => s / 2);
  const r = useTransform(size, (s) => s / 2 - 1);

  // Label opacity
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
      {/* Resizable SVG outer Venn ring — transparent fill so overlapping lines intersect cleanly */}
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

      {/* Inner content: Icon circle + label positioned inside its respective circle area */}
      <motion.div
        className={styles.circleContent}
        style={{ x: contentX, y: contentY }}
      >
        {/* Glowing brilliant white inner circle enclosing icon */}
        <motion.div className={styles.innerIconCircle}>
          <Icon size={18} strokeWidth={2.2} color="#ffffff" />
        </motion.div>

        {/* Crisp white text label with tight letter spacing */}
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

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

        {/* Headline — Tailored for Backend Developer */}
        <div className={styles.headline}>
          <h2 className={styles.headlineText}>
            <span className={styles.headlineLine}>I BUILD SYSTEMS</span>
            <span className={styles.headlineLine}>AT THE INTERSECTION OF :</span>
          </h2>
        </div>

        {/* Circles stage — shifted downwards for clear margin below headline */}
        <div className={styles.stage}>
          {CIRCLES.map(({ id, label, Icon, targetContentX, targetContentY }, i) => (
            <AnimatedCircle
              key={id}
              index={i}
              icon={Icon}
              label={label}
              targetContentX={targetContentX}
              targetContentY={targetContentY}
              progress={scrollYProgress}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
