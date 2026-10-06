"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ClipboardList, Network, Database, Layers,
  ShieldCheck, TestTube2, Rocket,
} from "lucide-react";
import styles from "./BackendProcessSection.module.css";

const STEPS = [
  { num: "01", icon: ClipboardList, title: "Requirements & Discovery", subtitle: "Map goals to specs",
    points: ["Stakeholder interviews — users, roles, workflows", "Traffic estimates — QPS, concurrency, growth", "Acceptance criteria — testable requirements"] },
  { num: "02", icon: Network, title: "System Architecture", subtitle: "Blueprint the topology",
    points: ["Architecture style — modular monolith → services", "Communication — HTTP/gRPC + async queues", "Fault-tolerance — retries, circuit breakers"] },
  { num: "03", icon: Database, title: "Database Design", subtitle: "Schema shapes everything",
    points: ["Schema — entities, relations, nullability", "Indexes — EXPLAIN every hot query", "Migrations — versioned, reversible"] },
  { num: "04", icon: Layers, title: "API & Business Logic", subtitle: "Controller → Service → Repo",
    points: ["Layering — routes → services → repos", "Validation — zod / class-validator", "Typed errors — domain → HTTP codes"] },
  { num: "05", icon: ShieldCheck, title: "Auth & Security", subtitle: "Defense in depth",
    points: ["Authentication — JWT + refresh rotation", "Authorization — role + attribute checks", "Input hygiene — parameterized queries, CSP"] },
  { num: "06", icon: TestTube2, title: "Testing & Optimization", subtitle: "Verify, measure, speed up",
    points: ["Pyramid — unit 70% · integration 25% · e2e 5%", "CI gates — lint → typecheck → test → build", "Observability — logs, metrics, traces"] },
  { num: "07", icon: Rocket, title: "Deploy & Operate", subtitle: "Containers, pipelines, rollbacks",
    points: ["Containerize — multi-stage Docker, non-root", "Infra as code — Terraform/Pulumi", "Zero-downtime — rolling + health probes"] },
];

function StepRow({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -35% 0px" });
  const Icon = step.icon;

  return (
    <div
      ref={ref}
      className={`${styles.stepRow} ${inView ? styles.stepRowActive : ""}`}
    >
      {/* Big number */}
      <motion.span
        className={styles.bigNum}
        animate={inView
          ? { opacity: 1, textShadow: "0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.4)" }
          : { opacity: 0.08, textShadow: "none" }
        }
        transition={{ duration: 0.4 }}
      >
        {step.num}
      </motion.span>

      {/* Content */}
      <motion.div
        className={styles.stepContent}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className={styles.stepHead}>
          <div className={`${styles.iconWrap} ${inView ? styles.iconActive : ""}`}>
            <Icon size={18} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepSub}>{step.subtitle}</p>
          </div>
        </div>

        <motion.div
          className={styles.pointsList}
          animate={inView ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          {step.points.map((pt, i) => (
            <motion.p
              key={i}
              className={styles.point}
              initial={{ opacity: 0, x: 10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
            >
              <span className={styles.dot} />
              {pt}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function BackendProcessSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <section className={styles.section}>
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

      <div className={styles.steps}>
        {STEPS.map((s, i) => (
          <StepRow key={i} step={s} index={i} />
        ))}
      </div>
    </section>
  );
}
