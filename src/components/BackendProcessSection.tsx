"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, Network, Database, Layers,
  ShieldCheck, TestTube2, Rocket,
} from "lucide-react";
import styles from "./BackendProcessSection.module.css";

const STEPS = [
  { num: "01", icon: ClipboardList, title: "Requirements & Discovery", subtitle: "Map goals to specs" },
  { num: "02", icon: Network,       title: "System Architecture",      subtitle: "Blueprint the topology" },
  { num: "03", icon: Database,      title: "Database Design",           subtitle: "Schema shapes everything" },
  { num: "04", icon: Layers,        title: "API & Business Logic",      subtitle: "Controller → Service → Repo" },
  { num: "05", icon: ShieldCheck,   title: "Auth & Security",           subtitle: "Defense in depth" },
  { num: "06", icon: TestTube2,     title: "Testing & Optimization",    subtitle: "Verify, measure, speed up" },
  { num: "07", icon: Rocket,        title: "Deploy & Operate",          subtitle: "Containers, pipelines, rollbacks" },
];

export default function BackendProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.header}>
        <span className={styles.label}>My Playbook</span>
        <h2 className={styles.title}>How I Build Backend Systems</h2>
      </div>

      <div className={styles.list}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.num}
              className={styles.item}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.iconWrap}>
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div className={styles.itemText}>
                <p className={styles.itemTitle}>{s.title}</p>
                <p className={styles.itemSubtitle}>{s.subtitle}</p>
              </div>
              {i < STEPS.length - 1 && <div className={styles.connector} />}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
