"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

function StackCard({ step, index, total, scrollYProgress }: {
  step: typeof STEPS[0];
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  const Icon = step.icon;
  const start = index / total;
  const end = (index + 1) / total;

  const y = useTransform(scrollYProgress, [start, end], ["0%", "-8%"]);
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [start, Math.min(end + 0.05, 1)], [1, index === total - 1 ? 1 : 0.6]);

  return (
    <motion.div
      className={styles.card}
      style={{
        y,
        scale,
        opacity,
        zIndex: index + 1,
        top: `${index * 12}px`,
      }}
    >
      <div className={styles.cardHead}>
        <span className={styles.bigNum}>{step.num}</span>
        <div className={styles.cardMeta}>
          <div className={styles.iconWrap}>
            <Icon size={18} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardSub}>{step.subtitle}</p>
          </div>
        </div>
      </div>
      <div className={styles.points}>
        {step.points.map((pt, i) => (
          <p key={i} className={styles.point}>
            <span className={styles.dot} />{pt}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export default function BackendProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>My Playbook</span>
        <h2 className={styles.title}>How I Build Backend Systems</h2>
      </div>

      {/* Sticky scroll container — height controls how long user scrolls */}
      <div ref={containerRef} className={styles.scrollContainer}>
        <div className={styles.stickyWrap}>
          <div className={styles.stack}>
            {STEPS.map((s, i) => (
              <StackCard
                key={i}
                step={s}
                index={i}
                total={STEPS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
