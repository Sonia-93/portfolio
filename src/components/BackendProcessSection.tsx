"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ClipboardList, Network, Database, Layers,
  ShieldCheck, TestTube2, Rocket,
} from "lucide-react";
import styles from "./BackendProcessSection.module.css";

const STEPS = [
  { icon: ClipboardList, title: "Requirements & Discovery", subtitle: "Map goals to specs" },
  { icon: Network,       title: "System Architecture",      subtitle: "Blueprint the topology" },
  { icon: Database,      title: "Database Design",           subtitle: "Schema shapes everything" },
  { icon: Layers,        title: "API & Business Logic",      subtitle: "Controller → Service → Repo" },
  { icon: ShieldCheck,   title: "Auth & Security",           subtitle: "Defense in depth" },
  { icon: TestTube2,     title: "Testing & Optimization",    subtitle: "Verify, measure, speed up" },
  { icon: Rocket,        title: "Deploy & Operate",          subtitle: "Containers, pipelines, rollbacks" },
];

function Step({ step, index, total }: { step: typeof STEPS[0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const Icon = step.icon;
  const isLast = index === total - 1;

  return (
    <div ref={ref} className={styles.step}>
      {/* Connector line */}
      {!isLast && (
        <motion.div
          className={styles.line}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />
      )}

      {/* Icon circle */}
      <motion.div
        className={styles.iconCircle}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={inView ? {
          background: "#ffffff",
          borderColor: "#ffffff",
          boxShadow: "0 0 20px rgba(255,255,255,0.9), 0 0 50px rgba(255,255,255,0.4)",
          color: "#000",
        } : undefined}
      >
        <Icon size={20} strokeWidth={1.8} />
      </motion.div>

      {/* Text */}
      <motion.div
        className={styles.stepText}
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={styles.stepTitle}>{step.title}</p>
        <p className={styles.stepSubtitle}>{step.subtitle}</p>
      </motion.div>
    </div>
  );
}

export default function BackendProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.header} ref={headerRef}>
        <motion.span
          className={styles.label}
          initial={{ opacity: 0, y: 10 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          My Playbook
        </motion.span>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          How I Build Backend Systems
        </motion.h2>
      </div>

      <div className={styles.list}>
        {STEPS.map((s, i) => (
          <Step key={i} step={s} index={i} total={STEPS.length} />
        ))}
      </div>
    </section>
  );
}
