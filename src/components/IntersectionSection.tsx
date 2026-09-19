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

// Circle dimensions
const CIRCLE_SIZE = 260; // px — final large size
const CIRC = Math.PI * CIRCLE_SIZE; // circumference of circle with r = SIZE/2

// Positions in the horizontal row (offsets from center)
const H_X = [-280, 0, 280];

// Venn diagram positions — circles need to overlap (r=130, so ~160px centers)
const V_X = [-95, 0, 95];
const V_Y = [75, -85, 75]; // [AESTHETIC, PERFORMANCE, STRATEGY]

// ─── Per-circle component ────────────────────────────────────────────────────
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
  // Staggered appearance: circle 0 → [0.05,0.18], 1 → [0.12,0.25], 2 → [0.19,0.32]
  const appStart  = 0.05 + index * 0.07;
  const appEnd    = appStart + 0.13;

  // Morph to Venn: [0.52 → 0.78]
  const morphStart = 0.52;
  const morphEnd   = 0.78;

  // ── Opacity: 0 → 1 as circle draws in
  const opacity = useTransform(progress, [appStart, appEnd], [0, 1]);

  // ── Stroke draw: full CIRC → 0 (stroke-dashoffset)
  const strokeDashoffset = useTransform(progress, [appStart, appEnd], [CIRC, 0]);

  // ── X: horizontal → Venn
  const x = useTransform(progress, [morphStart, morphEnd], [H_X[index], V_X[index]]);

  // ── Y: 0 → Venn Y
  const y = useTransform(progress, [morphStart, morphEnd], [0, V_Y[index]]);

  // ── Label opacity: appears after draw, fades during morph, re-appears
  const labelOpacity = useTransform(
    progress,
    [appEnd, appEnd + 0.05, morphStart + 0.05, morphEnd],
    [0, 1, 0.15, 1]
  );

  const r = CIRCLE_SIZE / 2;

  return (
    <motion.div
      className={styles.circleWrapper}
      style={{ x, y, opacity, width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
    >
      <svg
        width={CIRCLE_SIZE}
        height={CIRCLE_SIZE}
        viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
        style={{ position: "absolute", inset: 0 }}
        overflow="visible"
      >
        {/* Dim fill */}
        <circle cx={r} cy={r} r={r - 1} fill="rgba(255,255,255,0.05)" />
        {/* Animated stroke ring — draws from top */}
        <motion.circle
          cx={r}
          cy={r}
          r={r - 1}
          fill="none"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          style={{ strokeDashoffset: strokeDashoffset }}
          transform={`rotate(-90 ${r} ${r})`}
        />
      </svg>

      {/* Icon + label */}
      <div className={styles.circleInner}>
        <Icon size={22} strokeWidth={1.4} color="rgba(255,255,255,0.85)" />
        <motion.span className={styles.circleLabel} style={{ opacity: labelOpacity }}>
          {label}
        </motion.span>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export default function IntersectionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Headline fades in at 0.35–0.50
  const headlineOpacity = useTransform(scrollYProgress, [0.34, 0.48], [0, 1]);
  const headlineY       = useTransform(scrollYProgress, [0.34, 0.48], [24, 0]);

  // Progress line
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

        {/* Headline */}
        <motion.div
          className={styles.headline}
          style={{ opacity: headlineOpacity, y: headlineY }}
        >
          <h2 className={styles.headlineText}>
            I BUILD SYSTEMS<br />
            AT THE INTERSECTION OF :
          </h2>
        </motion.div>

        {/* Stage */}
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
