"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Network, Database, Layers,
  ShieldCheck, TestTube2, Rocket,
} from "lucide-react";
import styles from "./BackendProcessSection.module.css";

const STEPS = [
  {
    num: "01", icon: ClipboardList,
    title: "Requirements & Discovery",
    subtitle: "Map goals to specs",
    description: "Map users, roles, core flows, traffic estimates, and constraints with stakeholders.",
    points: [
      "<strong>Stakeholder interviews</strong> — users, roles, workflows",
      "<strong>Traffic estimates</strong> — QPS, concurrency, growth",
      "<strong>Acceptance criteria</strong> — testable requirements",
    ],
  },
  {
    num: "02", icon: Network,
    title: "System Architecture",
    subtitle: "Blueprint the topology",
    description: "Modular monolith first, services later. Define how components communicate and fail.",
    points: [
      "<strong>Architecture style</strong> — modular monolith → services",
      "<strong>Communication</strong> — HTTP/gRPC + async queues",
      "<strong>Fault-tolerance</strong> — retries, circuit breakers",
    ],
  },
  {
    num: "03", icon: Database,
    title: "Database Design",
    subtitle: "Schema shapes everything",
    description: "Clean ERD, 3NF normalization, proper indexes, reversible migrations.",
    points: [
      "<strong>Schema</strong> — entities, relations, nullability",
      "<strong>Indexes</strong> — EXPLAIN every hot query",
      "<strong>Migrations</strong> — versioned, reversible",
    ],
  },
  {
    num: "04", icon: Layers,
    title: "API & Business Logic",
    subtitle: "Controller → Service → Repo",
    description: "Business logic in services, isolated from transport so HTTP/CLI/gRPC share code.",
    points: [
      "<strong>Layering</strong> — routes → services → repos",
      "<strong>Validation</strong> — zod / class-validator",
      "<strong>Typed errors</strong> — domain → HTTP codes",
    ],
  },
  {
    num: "05", icon: ShieldCheck,
    title: "Auth & Security",
    subtitle: "Defense in depth",
    description: "Short-lived tokens, RBAC at both layers, OWASP Top 10 on every endpoint.",
    points: [
      "<strong>Authentication</strong> — JWT + refresh rotation",
      "<strong>Authorization</strong> — role + attribute checks",
      "<strong>Input hygiene</strong> — parameterized queries, CSP",
    ],
  },
  {
    num: "06", icon: TestTube2,
    title: "Testing & Optimization",
    subtitle: "Verify, measure, speed up",
    description: "Tests where they pay, CI gates on PRs, then profiling for queries and cold paths.",
    points: [
      "<strong>Pyramid</strong> — unit 70% · integration 25% · e2e 5%",
      "<strong>CI gates</strong> — lint → typecheck → test → build",
      "<strong>Observability</strong> — logs, metrics, traces",
    ],
  },
  {
    num: "07", icon: Rocket,
    title: "Deploy & Operate",
    subtitle: "Containers, pipelines, rollbacks",
    description: "Multi-stage containers, infra-as-code, staging-first gradual rolls with auto-rollback.",
    points: [
      "<strong>Containerize</strong> — multi-stage Docker, non-root",
      "<strong>Infra as code</strong> — Terraform/Pulumi",
      "<strong>Zero-downtime</strong> — rolling + health probes",
    ],
  },
];

export default function BackendProcessSection() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const Icon = step.icon;

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.label}>Process</span>
        <h2 className={styles.title}>How I Build Backend Systems</h2>
      </div>

      <div className={styles.layout}>
        {/* Left: step list */}
        <div className={styles.stepList}>
          {STEPS.map((s, i) => {
            const SIcon = s.icon;
            const isActive = i === active;
            return (
              <button
                key={s.num}
                className={`${styles.stepBtn} ${isActive ? styles.stepBtnActive : ""}`}
                onClick={() => setActive(i)}
              >
                <span className={styles.stepNum}>{s.num}</span>
                <span className={styles.stepBtnTitle}>{s.title}</span>
                {isActive && (
                  <motion.span
                    className={styles.activeLine}
                    layoutId="activeLine"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: animated card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className={styles.card}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Card header */}
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <div>
                <p className={styles.stepLabel}>Step {step.num} / {String(STEPS.length).padStart(2, "0")}</p>
                <h3 className={styles.cardTitle}>{step.title}</h3>
              </div>
            </div>

            <p className={styles.cardDesc}>{step.description}</p>

            {/* Points */}
            <div className={styles.points}>
              {step.points.map((pt, i) => (
                <motion.div
                  key={i}
                  className={styles.point}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                  dangerouslySetInnerHTML={{ __html: `<span class="${styles.dot}" />${pt}` }}
                />
              ))}
            </div>

            {/* Footer nav */}
            <div className={styles.cardFooter}>
              <span className={styles.footerCount}>{String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}</span>
              <div className={styles.footerBtns}>
                <button
                  className={styles.navBtn}
                  onClick={() => setActive((p) => Math.max(0, p - 1))}
                  disabled={active === 0}
                >
                  ‹ Prev
                </button>
                <button
                  className={styles.navBtnPrimary}
                  onClick={() => setActive((p) => Math.min(STEPS.length - 1, p + 1))}
                  disabled={active === STEPS.length - 1}
                >
                  Next ›
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
