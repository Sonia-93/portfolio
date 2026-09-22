"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Code2, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import styles from "./ProjectsSection.module.css";

import wastenet1 from "@/app/wastenet1.png";
import wastenet2 from "@/app/wastenet2.png";
import staffnet1 from "@/app/staffnet1.png";
import staffnet2 from "@/app/staffnet2.png";
import umuco1 from "@/app/umuco1.png";
import umuco2 from "@/app/umuco2.png";
import code1 from "@/app/code1.png";
import code2 from "@/app/code2.png";

type Project = {
  id: string;
  index: string;
  category: string;
  title: string;
  subtitle: string;
  tags: string[];
  short: string;
  photos: { src: string; alt: string; width?: number; height?: number; staticImport?: any }[];
  writeup: string[];
  githubUrl?: string;
  liveUrl?: string;
};

/* ── 4 featured projects: WasteNet, StaffNet, UmucoCore, CodeBridge ── */
const PROJECTS: Project[] = [
  {
    id: "wastenet",
    index: "01",
    category: "Artificial Intelligence",
    title: "WasteNet",
    subtitle: "Smart Waste Classification System",
    tags: ["Next.js", "TypeScript", "Python", "AI Classification", "PostgreSQL", "Real-time Dashboard"],
    short:
      "An AI-powered waste management system that classifies waste into plastic, paper, biodegradable, non-biodegradable, metals, and more using smart bins. A real-time dashboard tracks waste levels, collection status, and environmental impact across locations.",
    photos: [
      { src: "", alt: "WasteNet — smart bin classification dashboard", staticImport: wastenet1 },
      { src: "", alt: "WasteNet — collection map & impact stats", staticImport: wastenet2 },
    ],
    writeup: [
      "WasteNet combines on-device AI with a cloud backend to turn ordinary bins into smart, connected units.",
      "Each smart bin runs a lightweight image classifier that identifies waste as it's dropped in — sorted into plastic, paper, biodegradable, non-biodegradable, metals, and other common categories.",
      "The real-time dashboard aggregates fill levels, collection status, and environmental-impact metrics across every location, giving municipalities and operations teams a single pane to plan routes, prioritize pickups, and measure sustainability progress week-over-week.",
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "staffnet",
    index: "02",
    category: "Operations Platform",
    title: "StaffNet",
    subtitle: "RCA Staff Operations Portal",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Role Dashboards"],
    short:
      "A digital operations system designed for RCA staff to ditch the paperwork. Manages student tickets, borrowed phones, and student funds all in one place — streamlining daily administrative tasks with a clean, intuitive interface that saves time and reduces errors.",
    photos: [
      { src: "", alt: "StaffNet — tickets + funds overview dashboard", staticImport: staffnet1 },
      { src: "", alt: "StaffNet — student device borrow tracking", staticImport: staffnet2 },
    ],
    writeup: [
      "StaffNet was built specifically for Rwanda Coding Academy staff, replacing paper-based workflows that were slow, error-prone, and hard to search.",
      "The platform centralizes three of the most common admin jobs: student helpdesk tickets (tracked from open to resolved with comments), the student phone borrow-log (who took which device, due-back date, and overdues), and the student-funds ledger for petty cash and allowance disbursements.",
      "Every module has role-based dashboards for admins, matrons, and finance staff, so each person sees only their queue while a full audit trail keeps every change accountable.",
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "umucocore",
    index: "03",
    category: "Cultural Heritage",
    title: "UmucoCore",
    subtitle: "Digital Heritage Archive Platform",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Media Library"],
    short:
      "A cultural heritage platform that preserves, documents, and shares Rwandan traditions, oral histories, music, and indigenous knowledge — making it accessible for future generations through an immersive digital archive.",
    photos: [
      { src: "", alt: "UmucoCore — cultural collections & archive homepage", staticImport: umuco1 },
      { src: "", alt: "UmucoCore — oral history player & story detail", staticImport: umuco2 },
    ],
    writeup: [
      "UmucoCore is a living digital archive dedicated to preserving and celebrating Rwandan cultural heritage.",
      "The platform features oral histories, traditional music, dance documentation, indigenous crafts, and community-curated stories organized into browsable collections.",
      "Built with role-based contribution workflows, elders and cultural custodians can submit content directly while moderators ensure quality and authenticity.",
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "codebridge",
    index: "04",
    category: "Education Technology",
    title: "CodeBridge",
    subtitle: "Coding Education Community",
    tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Learning Platform"],
    short:
      "A community-driven coding education platform that bridges the gap between beginners and mentors — featuring interactive tutorials, peer code reviews, project-based tracks, and live study rooms.",
    photos: [
      { src: "", alt: "CodeBridge — learning tracks & dashboard overview", staticImport: code1 },
      { src: "", alt: "CodeBridge — interactive coding challenge editor", staticImport: code2 },
    ],
    writeup: [
      "CodeBridge connects aspiring developers with experienced mentors through structured learning paths and community support.",
      "The platform includes interactive coding challenges, project submission workflows with peer review, live study rooms, and a progress dashboard that tracks skill mastery across tracks like frontend, backend, and DevOps.",
      "Built for Rwanda's growing tech ecosystem, CodeBridge prioritizes offline-friendly content and Kinyarwanda language support to reach learners everywhere.",
    ],
    githubUrl: "#",
    liveUrl: "#",
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

/** ── Two-photo auto-rotating image stage (ken burns effect) ── */
function PhotoStage({
  photos,
  paused,
}: {
  photos: Project["photos"];
  paused?: boolean;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % photos.length);
    }, 6000); // <── change this number (in ms) for slower/faster swap: 6000 = 6s
    return () => clearInterval(id);
  }, [paused, photos.length]);

  if (photos.length === 0) {
    return (
      <div
        className={styles.imageStage}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.04em",
          background:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 14px, rgba(255,255,255,0.045) 14px 28px)",
        }}
      >
        drop 2 photos here later · photo1.png + photo2.png
      </div>
    );
  }

  return (
    <div className={styles.imageStage}>
      {photos.map((p, i) => {
        const isActive = i === active;
        return (
          <Image
            key={i}
            src={p.staticImport ?? p.src}
            alt={p.alt}
            fill
            sizes="(max-width: 960px) 100vw, 960px"
            className={`${styles.projectImage} ${isActive ? styles.imgActive : styles.imgIdle}`}
            priority={i === 0}
            quality={100}
          />
        );
      })}

      {photos.length > 0 && (
        <div className={styles.imagePill}>
          <span className={styles.pillDot} />
          <span>
            {active + 1} / {photos.length}
          </span>
        </div>
      )}
    </div>
  );
}

type BadgePos = { x: number; y: number };

/** ── Alternating project row ── */
function ProjectRow({
  project,
  index,
  onOpen,
  listVisible,
  registerBadge,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
  listVisible: boolean;
  registerBadge: (id: string, el: HTMLDivElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reveal = listVisible && cardInView;
  const flipped = index % 2 === 1;

  useEffect(() => {
    registerBadge(project.id, badgeRef.current);
    return () => registerBadge(project.id, null);
  }, [project.id, registerBadge]);

  const contentInnerReveal = reveal;

  return (
    <motion.div
      ref={ref}
      className={`${styles.row} ${flipped ? styles.rowFlip : ""}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* ─── PHOTO (reveals first) ─── */}
      <motion.div
        ref={frameRef}
        className={styles.frameWrap}
        onClick={() => onOpen(project)}
        style={{ cursor: "pointer" }}
        role="button"
        aria-label={`View ${project.title} details`}
        initial={{ opacity: 0, x: flipped ? 80 : -80, scale: 0.92 }}
        animate={reveal ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{
          duration: 0.95,
          delay: 0.02,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className={styles.frame}>
          <PhotoStage photos={project.photos} paused={true} />
        </div>
      </motion.div>

      {/* ─── DESCRIPTION CARD (reveals after photo) ─── */}
      <motion.div
        className={styles.content}
        onClick={() => onOpen(project)}
        style={{ cursor: "pointer" }}
        role="button"
        aria-label={`View ${project.title} details`}
        initial={{ opacity: 0, x: flipped ? -80 : 80, scale: 0.92 }}
        animate={reveal ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{
          duration: 1.0,
          delay: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div
          ref={badgeRef}
          className={`${styles.indexBadge} ${
            project.id === "staffnet" || project.id === "codebridge"
              ? styles.indexBadgeRight
              : ""
          }`}
          aria-hidden="true"
        >
          {project.index}
        </div>

        <motion.span
          className={styles.category}
          initial={{ opacity: 0, y: 10 }}
          animate={contentInnerReveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          {project.category}
        </motion.span>

        <motion.h3
          className={styles.projectTitle}
          initial={{ opacity: 0, y: 12 }}
          animate={contentInnerReveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.62 }}
        >
          {project.title}
        </motion.h3>

        <motion.div
          className={styles.projectSubtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={contentInnerReveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.68 }}
        >
          {project.subtitle}
        </motion.div>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 16 }}
          animate={contentInnerReveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.74 }}
        >
          {project.short}
        </motion.p>

        <div className={styles.tags}>
          {project.tags.map((t, i) => (
            <motion.span
              key={t}
              className={styles.tag}
              initial={{ opacity: 0, y: 6 }}
              animate={contentInnerReveal ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.84 + i * 0.045, duration: 0.5 }}
            >
              {t}
            </motion.span>
          ))}
        </div>

        <div
          className={styles.actions}
          onClick={(e) => e.stopPropagation()}
        >
          {project.githubUrl && (
            <motion.a
              className={styles.btn}
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              initial={{ opacity: 0, y: 6 }}
              animate={contentInnerReveal ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.05, duration: 0.5 }}
            >
              <Code2 size={17} /> Code
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={`${styles.btn} ${styles.btnPrimary}`}
              initial={{ opacity: 0, y: 6 }}
              animate={contentInnerReveal ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.12, duration: 0.5 }}
            >
              Live Demo <ExternalLink size={15} />
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** ── SVG Timeline Path Generator (zig-zag between alternating badge positions) ── */
function buildTimelinePath(positions: BadgePos[]): string {
  if (positions.length < 2) return "";
  const pts = positions;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const midY = (prev.y + cur.y) / 2;
    d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
  }
  return d;
}

/** ── Main Projects Section ── */
export default function ProjectsSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(wrapRef, {
    once: false,
    margin: "0px 0px -30% 0px",
  });

  const { displayed: titleText, done: titleDone } = useTypingEffect(
    "Projects",
    0,
    60,
    35,
    sectionInView
  );

  const listVisible = titleDone;
  const [selected, setSelected] = useState<Project | null>(null);

  const [badgeEls, setBadgeEls] = useState<Record<string, HTMLDivElement | null>>({});
  const [badgePositions, setBadgePositions] = useState<BadgePos[]>([]);

  const registerBadge = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      setBadgeEls((prev) => {
        const next = { ...prev, [id]: el };
        return next;
      });
    },
    []
  );

  const updatePositions = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const listRect = list.getBoundingClientRect();
    const positions = PROJECTS.map((p) => {
      const el = badgeEls[p.id];
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - listRect.left + r.width / 2,
        y: r.top - listRect.top + r.height / 2,
      };
    });
    setBadgePositions(positions);
  }, [badgeEls]);

  useEffect(() => {
    updatePositions();
    const handle = () => updatePositions();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    const timer = setTimeout(handle, 300);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
      clearTimeout(timer);
    };
  }, [updatePositions]);

  useEffect(() => {
    const timeout = setTimeout(updatePositions, 50);
    return () => clearTimeout(timeout);
  }, [badgeEls, listVisible, updatePositions]);

  const timelinePath = useMemo(
    () => buildTimelinePath(badgePositions),
    [badgePositions]
  );

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 35%"],
  });

  const pathLengthMotion = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const showTimeline = badgePositions.length >= 2 && timelinePath !== "";

  const pathLengthRef = useRef<number | null>(null);

  return (
    <section ref={wrapRef} className={styles.projects} id="projects">

      <div className={styles.titleWrap}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={styles.sectionLabel}
        >
          Selected Work
        </motion.div>

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
                    animation: "blinkCursorP 0.75s ease-in-out infinite",
                  }}
                />
              )}
            </>
          ) : null}
        </h2>
      </div>

      <div ref={listRef} className={styles.list}>
        {/* ─── SVG Timeline connector ─── */}
        <svg
          className={styles.timelineSvg}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="50%" stopColor="#b8c6ff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffd8a8" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          {showTimeline && (
            <>
              <path
                className={styles.timelineLine}
                d={timelinePath}
                strokeDasharray="1 10"
                strokeDashoffset="0"
              />
              <motion.path
                ref={(el) => {
                  if (el && pathLengthRef.current === null) {
                    try {
                      pathLengthRef.current = el.getTotalLength();
                    } catch {}
                  }
                }}
                className={styles.timelineLineProgress}
                d={timelinePath}
                style={{
                  pathLength: pathLengthMotion,
                }}
              />
            </>
          )}
        </svg>

        {PROJECTS.map((p, i) => (
          <ProjectRow
            key={p.id}
            project={p}
            index={i}
            onOpen={setSelected}
            listVisible={listVisible}
            registerBadge={registerBadge}
          />
        ))}
      </div>

      <motion.div
        className={styles.viewAllWrap}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <a href="#" className={styles.viewAllBtn}>
          View all projects
          <ArrowRight size={16} />
        </a>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className={styles.backdrop}
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setSelected(null)}
                aria-label="Close project"
              >
                <X size={16} />
              </button>

              <div className={styles.modalSubtitle}>
                {selected.index} · {selected.category}
              </div>
              <h3 className={styles.modalTitle}>{selected.title}</h3>
              <p className={styles.projectSubtitle} style={{ marginBottom: 20, marginTop: -4 }}>
                {selected.subtitle}
              </p>

              <div className={styles.modalTags}>
                {selected.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>

              <div className={styles.modalStage}>
                <PhotoStage photos={selected.photos} />
              </div>

              {selected.writeup.map((p, i) => (
                <p key={i} className={styles.modalParagraph}>{p}</p>
              ))}

              <div className={styles.modalLinks}>
                {selected.githubUrl && (
                  <a className={styles.btn} href={selected.githubUrl} target="_blank" rel="noreferrer noopener">
                    <Code2 size={15} /> Source code
                  </a>
                )}
                {selected.liveUrl && (
                  <a className={`${styles.btn} ${styles.btnPrimary}`} href={selected.liveUrl} target="_blank" rel="noreferrer noopener">
                    <ExternalLink size={15} /> Live demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes blinkCursorP {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
