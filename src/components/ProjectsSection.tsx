"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import Image from "next/image";
import styles from "./ProjectsSection.module.css";

import wastenet1 from "@/app/wastenet1.png";
import wastenet2 from "@/app/wastenet2.png";
import staffnet1 from "@/app/staffnet1.png";
import staffnet2 from "@/app/staffnet2.png";

type Project = {
  id: string;
  index: string;
  category: string;
  title: string;
  tags: string[];
  short: string;
  photos: { src: string; alt: string; width?: number; height?: number; staticImport?: any }[];
  writeup: string[];
  githubUrl?: string;
  liveUrl?: string;
};

/* ── 7 projects: first 2 real (Wastenet + Staffnet), remaining 5 placeholders you fill in! ── */
const PROJECTS: Project[] = [
  {
    id: "wastenet",
    index: "01",
    category: "AI · Smart Waste Platform",
    title: "WasteNet",
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
    category: "RCA · Staff Operations Portal",
    title: "StaffNet",
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
    id: "project3",
    index: "03",
    category: "Real-time",
    title: "Project #3 (Coming soon)",
    tags: ["WebSocket", "Redis", "Node.js"],
    short:
      "Put your third project name here — real-time chat, collaboration tool, live dashboard, anything with WebSockets / events.",
    photos: [],
    writeup: [
      "Replace this paragraph with a 3-sentence writeup about the project.",
      "What problem did it solve? What was the tricky technical part? What numbers did you move?",
      "Then drop photo1.png and photo2.png in src/app/ and add them to the `photos` array above.",
    ],
  },
  {
    id: "project4",
    index: "04",
    category: "Data / APIs",
    title: "Project #4 (Coming soon)",
    tags: ["FastAPI", "Python", "Docker"],
    short:
      "Put your fourth project name here — scraping, data pipeline, internal tool, analytics API.",
    photos: [],
    writeup: [
      "Add the real writeup here.",
      "Use this to showcase: complex business rules, integrations, performance wins.",
    ],
  },
  {
    id: "project5",
    index: "05",
    category: "Infrastructure / DevOps",
    title: "Project #5 (Coming soon)",
    tags: ["Docker", "GitHub Actions", "Kafka"],
    short:
      "Put your fifth project here — event-driven microservices, CI/CD pipelines, anything infra/DevOps.",
    photos: [],
    writeup: ["TBD — replace this with the real story."],
  },
  {
    id: "project6",
    index: "06",
    category: "Cybersecurity",
    title: "Project #6 (Coming soon)",
    tags: ["CTF", "Python", "Security"],
    short:
      "Put your sixth project here — CTF tooling, a scanner you wrote, password manager API, crypto experiments.",
    photos: [],
    writeup: ["TBD — replace this with the real story."],
  },
  {
    id: "project7",
    index: "07",
    category: "Velora Internship",
    title: "Project #7 (Coming soon)",
    tags: ["NestJS", "Prisma", "Jest"],
    short:
      "Put your Velora internship project here — the CRM API deduplication work you mentioned or another team project.",
    photos: [],
    writeup: ["TBD — replace this with the real story."],
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

/** ── Alternating project row ── */
function ProjectRow({
  project,
  index,
  onOpen,
  listVisible,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
  listVisible: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cardInView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });
  const reveal = listVisible && cardInView;
  const flipped = index % 2 === 1; // second row flipped, fourth row flipped, etc

  return (
    <motion.div
      ref={ref}
      className={`${styles.row} ${flipped ? styles.rowFlip : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.9,
        delay: reveal ? 0.08 * index : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={styles.indexBadge} aria-hidden="true">
        {project.index}
      </div>

      <div className={styles.frameWrap}>
        <div className={styles.frame}>
          <PhotoStage photos={project.photos} />
        </div>
      </div>

      <div className={styles.content}>
        <motion.span
          className={styles.category}
          initial={{ opacity: 0, y: 10 }}
          animate={reveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {project.category}
        </motion.span>

        <motion.h3
          className={styles.projectTitle}
          initial={{ opacity: 0, y: 12 }}
          animate={reveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          {project.title}
        </motion.h3>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 16 }}
          animate={reveal ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.22 }}
        >
          {project.short}
        </motion.p>

        <div className={styles.tags}>
          {project.tags.map((t, i) => (
            <motion.span
              key={t}
              className={styles.tag}
              initial={{ opacity: 0, y: 6 }}
              animate={reveal ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.32 + i * 0.05, duration: 0.5 }}
            >
              {t}
            </motion.span>
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={() => onOpen(project)}>
            <Code2 size={15} /> About project
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              <ExternalLink size={15} /> Live demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/** ── Main Projects Section ── */
export default function ProjectsSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
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

      <div className={styles.list}>
        {PROJECTS.map((p, i) => (
          <ProjectRow
            key={p.id}
            project={p}
            index={i}
            onOpen={setSelected}
            listVisible={listVisible}
          />
        ))}
      </div>

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
