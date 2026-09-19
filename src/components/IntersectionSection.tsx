"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Link2, Gauge, Crosshair } from "lucide-react";
import styles from "./IntersectionSection.module.css";

// ─── Data ────────────────────────────────────────────────────────────────────
const CIRCLES = [
  { id: "aesthetic",   label: "AESTHETIC",   Icon: Link2 },
  { id: "performance", label: "PERFORMANCE",  Icon: Gauge },
  { id: "strategy",    label: "STRATEGY",     Icon: Crosshair },
] as const;

// Sizes (diameter)
const SMALL = 90;
const LARGE = 240;

// Horizontal row x-offsets from center
const H_X = [-240, 0, 240];

// Venn diagram positions (radius=120, overlapping at ~150px spacing)
const V_X = [-85, 0,  85];
const V_Y = [ 70, -80, 70];

// ─── Individual animated circle ──────────────────────────────────────────────
function AnimatedCircle({
  index,
  icon: Icon,
  label,
  progress,
}: {
  index: number;
  icon: React.ElementType;
  label: string;
  progress: MotionValue<number>;
}) {
  // Draw-in phase — staggered left→right
  const appStart = 0.04 + index * 0.09;
  const appEnd   = appStart + 0.14;

  // Grow phase: small → large
  const growStart = 0.38;
  const growEnd   = 0.56;

  // Morph to Venn positions
  const morphStart = 0.56;
  const morphEnd   = 0.80;

  const opacity  = useTransform(progress, [appStart, appEnd], [0, 1]);
  const size     = useTransform(progress, [growStart, growEnd], [SMALL, LARGE]);
  const x        = useTransform(progress, [morphStart, morphEnd], [H_X[index], V_X[index]]);
  const y        = useTransform(progress, [morphStart, morphEnd], [0, V_Y[index]]);
  const iconScale = useTransform(size, [SMALL, LARGE], [0.7, 1.1]);

  // Label position & opacity: starts outside circle (below), morphs inside circle during Venn diagram stage
  const labelY = useTransform(progress, [growStart, morphStart, morphEnd], [65, 65, 26]);
  const labelOpacity = useTransform(
    progress,
    [appEnd, appEnd + 0.04, morphStart, morphEnd],
    [0, 1, 0.6, 1]
  );
  const labelColor = useTransform(
    progress,
    [morphStart, morphEnd],
    ["rgba(255, 255, 255, 0.75)", "#ffffff"]
  );

  const strokeOpacity = useTransform(
    progress,
    [0, morphStart, morphEnd],
    [1, 0.25, 0.35]
  );

  // Stroke dashoffset draws the ring (uses SMALL circ initially)
  const circumference = useTransform(size, (s) => Math.PI * s);
  const dashoffset = useTransform(progress, [appStart, appEnd], [Math.PI * SMALL, 0]);

  // SVG geometry derived from size
  const cx_cy = useTransform(size, (s) => s / 2);
  const r     = useTransform(size, (s) => s / 2 - 1);

  return (
    <motion.div
      className={styles.circleWrapper}
      style={{ x, y, opacity, width: size, height: size }}
    >
      {/* Resizable SVG ring */}
      <motion.svg
        style={{ position: "absolute", inset: 0, width: size, height: size }}
        overflow="visible"
      >
        {/* Background fill — pure black */}
        <motion.circle
          style={{ cx: cx_cy, cy: cx_cy, r }}
          fill="#000000"
          stroke="none"
        />
        {/* Animated draw stroke */}
        <motion.circle
          style={{
            cx: cx_cy,
            cy: cx_cy,
            r,
            strokeDasharray: circumference,
            strokeDashoffset: dashoffset,
            transformOrigin: "center",
            rotate: "-90deg",
            opacity: strokeOpacity,
          }}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Icon + label */}
      <div className={styles.circleInner}>
        <motion.div style={{ scale: iconScale }} className={styles.iconGlow}>
          <Icon size={24} strokeWidth={2} color="#ffffff" />
        </motion.div>
        <motion.span
          className={styles.circleLabel}
          style={{ opacity: labelOpacity, y: labelY, color: labelColor }}
        >
          {label}
        </motion.span>
      </div>
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

        {/* Headline — always visible */}
        <div className={styles.headline}>
          <h2 className={styles.headlineText}>
            <span className={styles.headlineWhite}>I BUILD SYSTEMS</span><br />
            <span className={styles.headlineMuted}>AT THE INTERSECTION OF :</span>
          </h2>
        </div>

        {/* Circles stage */}
        <div className={styles.stage}>
          {CIRCLES.map(({ id, label, Icon }, i) => (
            <AnimatedCircle
              key={id}
              index={i}
              icon={Icon}
              label={label}
              progress={scrollYProgress}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
