"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Link2, Gauge, Crosshair } from "lucide-react";
import styles from "./IntersectionSection.module.css";

// ─── Data ────────────────────────────────────────────────────────────────────
const CIRCLES = [
  { id: "aesthetic",   label: "AESTHETIC",   Icon: Link2,     delay: 0 },
  { id: "performance", label: "PERFORMANCE",  Icon: Gauge,     delay: 0.12 },
  { id: "strategy",    label: "STRATEGY",     Icon: Crosshair, delay: 0.24 },
] as const;

// ─── Circle radius & circumference ──────────────────────────────────────────
const R_SMALL = 44;   // radius when in horizontal list
const R_LARGE = 128;  // radius in final Venn diagram
const CIRC_SMALL = 2 * Math.PI * R_SMALL;
const CIRC_LARGE = 2 * Math.PI * R_LARGE;

// ─── Positions ───────────────────────────────────────────────────────────────
// Horizontal layout  (x, y) from section center
const H_POS = [
  { x: -240, y: 0 },
  { x:    0, y: 0 },
  { x:  240, y: 0 },
];
// Venn diagram layout — circles must overlap (radius=128, so centers ~160px apart)
const V_POS = [
  { x: -90, y:  70 },  // AESTHETIC   bottom-left
  { x:   0, y: -80 },  // PERFORMANCE top
  { x:  90, y:  70 },  // STRATEGY    bottom-right
];

// ─── Individual animated circle ──────────────────────────────────────────────
function AnimatedCircle({
  index,
  icon: Icon,
  label,
  scrollYProgress,
}: {
  index: number;
  icon: React.ElementType;
  label: string;
  scrollYProgress: MotionValue<number>;
}) {
  const appearAt   = 0.05 + index * 0.08;
  const drawEnd    = appearAt + 0.15;
  const morphStart = 0.55;
  const morphEnd   = 0.85;

  // The SVG is fixed size (large), we scale the wrapper div
  const FIXED_R = R_LARGE;
  const FIXED_CIRC = CIRC_LARGE;
  const SIZE = FIXED_R * 2 + 4;
  const CX = FIXED_R + 2;

  // Scale the whole wrapper from small → large
  const scale = useTransform(
    scrollYProgress,
    [morphStart, morphEnd],
    [R_SMALL / R_LARGE, 1]
  );

  // Stroke draw: full circumference → 0 (scaled down circumference at start)
  const strokeOffset = useTransform(
    scrollYProgress,
    [appearAt, drawEnd],
    [FIXED_CIRC * (R_SMALL / R_LARGE), 0]
  );

  // Opacity of the circle wrapper
  const circleOpacity = useTransform(
    scrollYProgress,
    [appearAt - 0.02, appearAt + 0.04],
    [0, 1]
  );

  // X position: H → V
  const x = useTransform(
    scrollYProgress,
    [morphStart, morphEnd],
    [H_POS[index].x, V_POS[index].x]
  );

  // Y position: H → V
  const y = useTransform(
    scrollYProgress,
    [morphStart, morphEnd],
    [H_POS[index].y, V_POS[index].y]
  );

  // Label opacity
  const labelOpacity = useTransform(
    scrollYProgress,
    [drawEnd - 0.02, drawEnd + 0.06, morphStart, morphEnd],
    [0, 1, 0.3, 1]
  );

  // Icon scale: stays consistent relative to circle
  const iconScale = useTransform(
    scrollYProgress,
    [morphStart, morphEnd],
    [0.55, 1]
  );

  return (
    <motion.div
      className={styles.circleWrapper}
      style={{ x, y, opacity: circleOpacity, scale, width: SIZE, height: SIZE }}
    >
      {/* SVG ring — fixed size, scaled by parent */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        overflow="visible"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Background fill */}
        <circle
          cx={CX}
          cy={CX}
          r={FIXED_R}
          fill="rgba(255,255,255,0.06)"
          stroke="none"
        />
        {/* Animated drawing stroke */}
        <motion.circle
          cx={CX}
          cy={CX}
          r={FIXED_R}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={FIXED_CIRC}
          style={{ strokeDashoffset: strokeOffset }}
          transform={`rotate(-90 ${CX} ${CX})`}
        />
      </svg>

      {/* Icon + label */}
      <div className={styles.circleContent}>
        <motion.div style={{ scale: iconScale, transformOrigin: "center" }}>
          <Icon size={22} strokeWidth={1.4} color="rgba(255,255,255,0.85)" />
        </motion.div>
        <motion.span className={styles.circleLabel} style={{ opacity: labelOpacity }}>
          {label}
        </motion.span>
      </div>
    </motion.div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────
export default function IntersectionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Headline
  const headlineOpacity = useTransform(scrollYProgress, [0.38, 0.52], [0, 1]);
  const headlineY       = useTransform(scrollYProgress, [0.38, 0.52], [30, 0]);

  // Left progress line height
  const lineScaleY = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  return (
    <div ref={sectionRef} className={styles.scrollSection}>
      {/* Sticky viewport */}
      <div className={styles.sticky}>

        {/* ── Left progress line ── */}
        <div className={styles.progressTrack}>
          <motion.div
            className={styles.progressFill}
            style={{ scaleY: lineScaleY, originY: 0 }}
          />
        </div>

        {/* ── Headline ── */}
        <motion.div
          className={styles.headline}
          style={{ opacity: headlineOpacity, y: headlineY }}
        >
          <h2 className={styles.headlineText}>
            I BUILD SYSTEMS<br />
            AT THE INTERSECTION OF :
          </h2>
        </motion.div>

        {/* ── Circles stage ── */}
        <div className={styles.stage}>
          {CIRCLES.map(({ id, label, Icon }, i) => (
            <AnimatedCircle
              key={id}
              index={i}
              icon={Icon}
              label={label}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
