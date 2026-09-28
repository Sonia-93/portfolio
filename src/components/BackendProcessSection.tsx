"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  ClipboardList,
  Network,
  Database,
  Layers,
  ShieldCheck,
  TestTube2,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "./BackendProcessSection.module.css";

type StepIcon =
  | typeof ClipboardList
  | typeof Network
  | typeof Database
  | typeof Layers
  | typeof ShieldCheck
  | typeof TestTube2
  | typeof Rocket;

type Step = {
  id: string;
  num: string;
  icon: StepIcon;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
};

const STEPS: Step[] = [
  {
    id: "req",
    num: "01",
    icon: ClipboardList,
    title: "Requirements & Discovery",
    subtitle: "Map goals to specs",
    description:
      "Map users, roles, core flows, traffic estimates, and constraints with stakeholders.",
    points: [
      "<strong>Stakeholder interviews</strong> — users, roles, workflows",
      "<strong>Traffic estimates</strong> — QPS, concurrency, growth",
      "<strong>Acceptance criteria</strong> — testable requirements",
    ],
  },
  {
    id: "arch",
    num: "02",
    icon: Network,
    title: "System Architecture",
    subtitle: "Blueprint the topology",
    description:
      "Modular monolith first, services later. Define how components communicate and fail.",
    points: [
      "<strong>Architecture style</strong> — modular monolith → services",
      "<strong>Communication</strong> — HTTP/gRPC + async queues",
      "<strong>Fault-tolerance</strong> — retries, circuit breakers",
    ],
  },
  {
    id: "db",
    num: "03",
    icon: Database,
    title: "Database Design",
    subtitle: "Schema shapes everything",
    description:
      "Clean ERD, 3NF normalization, proper indexes, reversible migrations.",
    points: [
      "<strong>Schema</strong> — entities, relations, nullability",
      "<strong>Indexes</strong> — EXPLAIN every hot query",
      "<strong>Migrations</strong> — versioned, reversible",
    ],
  },
  {
    id: "api",
    num: "04",
    icon: Layers,
    title: "API & Business Logic",
    subtitle: "Controller → Service → Repo",
    description:
      "Business logic in services, isolated from transport so HTTP/CLI/gRPC share code.",
    points: [
      "<strong>Layering</strong> — routes → services → repos",
      "<strong>Validation</strong> — zod / class-validator",
      "<strong>Typed errors</strong> — domain → HTTP codes",
    ],
  },
  {
    id: "sec",
    num: "05",
    icon: ShieldCheck,
    title: "Auth & Security",
    subtitle: "Defense in depth",
    description:
      "Short-lived tokens, RBAC at both layers, OWASP Top 10 on every endpoint.",
    points: [
      "<strong>Authentication</strong> — JWT + refresh rotation",
      "<strong>Authorization</strong> — role + attribute checks",
      "<strong>Input hygiene</strong> — parameterized queries, CSP",
    ],
  },
  {
    id: "test",
    num: "06",
    icon: TestTube2,
    title: "Testing & Optimization",
    subtitle: "Verify, measure, speed up",
    description:
      "Tests where they pay, CI gates on PRs, then profiling for queries and cold paths.",
    points: [
      "<strong>Pyramid</strong> — unit 70% · integration 25% · e2e 5%",
      "<strong>CI gates</strong> — lint → typecheck → test → build",
      "<strong>Observability</strong> — logs, metrics, traces",
    ],
  },
  {
    id: "deploy",
    num: "07",
    icon: Rocket,
    title: "Deploy & Operate",
    subtitle: "Containers, pipelines, rollbacks",
    description:
      "Multi-stage containers, infra-as-code, staging-first gradual rolls with auto-rollback.",
    points: [
      "<strong>Containerize</strong> — multi-stage Docker, non-root",
      "<strong>Infra as code</strong> — Terraform/Pulumi",
      "<strong>Zero-downtime</strong> — rolling + health probes",
    ],
  },
];

function useTypingEffect(
  text: string,
  startDelay: number,
  baseSpeed: number = 55,
  variance: number = 40,
  startTrigger: boolean = true
) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTrigger) {
      setDisplayed("");
      setDone(false);
      return;
    }

    let index = 0;
    let timeoutId: NodeJS.Timeout;
    let cancelled = false;

    const startTimeout = setTimeout(() => {
      const type = () => {
        if (cancelled) return;
        if (index <= text.length) {
          setDisplayed(text.slice(0, index));
          index++;
          if (index <= text.length) {
            const jitter = Math.random() * variance;
            timeoutId = setTimeout(type, baseSpeed + jitter);
          } else {
            setDone(true);
          }
        }
      };
      type();
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, startDelay, baseSpeed, variance, startTrigger]);

  return { displayed, done };
}

export default function BackendProcessSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stepsWrapRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(wrapRef, {
    once: false,
    margin: "0px 0px -30% 0px",
  });

  const { displayed: titleText, done: titleDone } = useTypingEffect(
    "How I Build Backend Systems",
    0,
    50,
    30,
    sectionInView
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const activeStep = STEPS[activeIdx];

  const totalSteps = STEPS.length;
  const progressPct = useMemo(() => {
    if (totalSteps <= 1) return 0;
    return (activeIdx / (totalSteps - 1)) * 100;
  }, [activeIdx, totalSteps]);

  return (
    <section ref={wrapRef} className={styles.section} id="backend-process">
      <div className={styles.titleWrap}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={styles.sectionLabel}
        >
          My Playbook
        </motion.div>

        <div className={styles.titleRow}>
          <h2 className={styles.sectionTitle}>
            {titleText || sectionInView ? (
              <>
                {titleText}
                {!titleDone && sectionInView && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 4,
                      height: "0.9em",
                      background: "#ffffff",
                      marginLeft: 8,
                      verticalAlign: "baseline",
                      boxShadow: "0 0 10px rgba(255,255,255,0.9)",
                      borderRadius: 2,
                      animation: "blinkCursorBP 0.75s ease-in-out infinite",
                    }}
                  />
                )}
              </>
            ) : null}
          </h2>
        </div>
      </div>

      <div className={styles.layout}>
        <div ref={stepsWrapRef} className={styles.stepsWrap}>
          <svg className={styles.stepsSvg} preserveAspectRatio="none">
            <line
              className={styles.stepsLineBg}
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
            />
            <motion.line
              className={styles.stepsLineProgress}
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressPct / 100 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                strokeDasharray: "0 1",
                strokeDashoffset: 0,
              }}
            />
          </svg>

          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === activeIdx;
            return (
              <motion.div
                key={s.id}
                className={styles.stepItem}
                onClick={() => setActiveIdx(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIdx(i);
                  }
                }}
                aria-label={`Step ${i + 1}: ${s.title}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={`${styles.stepCircle} ${
                    isActive ? styles.stepCircleActive : ""
                  }`}
                >
                  <Icon className={styles.stepIcon} strokeWidth={2} />
                </div>

                <div className={styles.stepText}>
                  <h3
                    className={`${styles.stepTitle} ${
                      isActive ? styles.stepTitleActive : ""
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className={styles.stepSubtitle}>{s.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className={styles.detailWrap}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              className={styles.detailCard}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.detailGlow} />

              <div className={styles.detailInner}>
                <div className={styles.detailHeader}>
                  <div className={styles.detailIconWrap}>
                    {(() => {
                      const Icon = activeStep.icon;
                      return <Icon className={styles.detailIcon} strokeWidth={1.8} />;
                    })()}
                  </div>
                  <div className={styles.detailHeaderText}>
                    <div className={styles.detailStepLabel}>
                      Step {activeStep.num} / 07
                    </div>
                    <h3 className={styles.detailTitle}>{activeStep.title}</h3>
                  </div>
                </div>

                <p className={styles.detailDescription}>{activeStep.description}</p>

                <div className={styles.detailPoints}>
                  {activeStep.points.map((p, i) => (
                    <motion.div
                      key={i}
                      className={styles.detailPoint}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
                    >
                      <span className={styles.detailBullet} />
                      <span
                        className={styles.detailPointText}
                        dangerouslySetInnerHTML={{ __html: p }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={styles.detailNav}>
                <div className={styles.stepCounter}>
                  {activeStep.num} &nbsp;/&nbsp; {String(STEPS.length).padStart(2, "0")}
                </div>
                <div className={styles.navBtns}>
                  <button
                    type="button"
                    className={styles.navBtn}
                    disabled={activeIdx === 0}
                    onClick={() => setActiveIdx((v) => Math.max(0, v - 1))}
                    aria-label="Previous step"
                  >
                    <ChevronLeft className={styles.navIcon} />
                    Prev
                  </button>
                  <button
                    type="button"
                    className={`${styles.navBtn} ${styles.navBtnPrimary}`}
                    disabled={activeIdx === STEPS.length - 1}
                    onClick={() =>
                      setActiveIdx((v) => Math.min(STEPS.length - 1, v + 1))
                    }
                    aria-label="Next step"
                  >
                    Next
                    <ChevronRight className={styles.navIcon} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blinkCursorBP {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
