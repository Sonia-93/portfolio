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
// Venn diagram layout
const V_POS = [
  { x: -135, y:  80 },  // AESTHETIC   bottom-left
  { x:    0, y: -95 },  // PERFORMANCE top
  { x:  135, y:  80 },  // STRATEGY    bottom-right
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
  // --- Appear threshold for this circle ---
  const appearAt  = 0.05 + index * 0.08;
  const drawEnd   = appearAt + 0.15;
  const morphStart = 0.55;
  const morphEnd   = 0.85;

  // Stroke draw: circumference → 0
  const strokeOffset = useTransform(
    scrollYProgress,
    [appearAt, drawEnd],
    [CIRC_SMALL, 0]
  );

  // Radius grow: small → large
  const radius = useTransform(
    scrollYProgress,
    [morphStart, morphEnd],
    [R_SMALL, R_LARGE]
  );

  // Stroke circumference (keeps in sync with radius)
  const strokeDash = useTransform(
    scrollYProgress,
    [morphStart, morphEnd],
    [CIRC_SMALL, CIRC_LARGE]
  );

  // Opacity of the circle itself
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

  // Label opacity: fades in shortly after draw, fades out as morph begins, back in at end
  const labelOpacity = useTransform(
    scrollYProgress,
    [drawEnd - 0.02, drawEnd + 0.06, morphStart, morphEnd],
    [0, 1, 0.3, 1]
  );

  // Icon size: scales with radius
  const iconScale = useTransform(
    scrollYProgress,
    [morphStart, morphEnd],
    [1, 2.2]
  );

  // SVG viewport size driven by radius
  const svgSize = useTransform(radius, (r) => r * 2 + 4);
  const cx = useTransform(radius, (r) => r + 2);

  return (
    <motion.div
      className={styles.circleWrapper}
      style={{ x, y, opacity: circleOpacity }}
    >
      {/* SVG ring */}
      <motion.svg
        style={{ width: svgSize, height: svgSize }}
        overflow="visible"
      >
        {/* Background dim fill */}
        <motion.circle
          style={{ cx, cy: cx, r: radius }}
          fill="rgba(255,255,255,0.03)"
          stroke="none"
        />
        {/* Animated stroke ring */}
        <motion.circle
          style={{
            cx,
            cy: cx,
            r: radius,
            strokeDasharray: strokeDash,
            strokeDashoffset: strokeOffset,
          }}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1}
          strokeLinecap="round"
          transform={`rotate(-90, ${R_SMALL + 2}, ${R_SMALL + 2})`}
        />
      </motion.svg>

      {/* Icon + label overlay */}
      <motion.div className={styles.circleContent} style={{ opacity: circleOpacity }}>
        <motion.div style={{ scale: iconScale, transformOrigin: "center" }}>
          <Icon size={18} strokeWidth={1.4} color="rgba(255,255,255,0.8)" />
        </motion.div>
        <motion.span className={styles.circleLabel} style={{ opacity: labelOpacity }}>
          {label}
        </motion.span>
      </motion.div>
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
