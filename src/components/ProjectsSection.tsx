"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import styles from "./ProjectsSection.module.css";

type TermLineKind = "prompt" | "comment" | "ok" | "warn" | "err" | "text";
type TermLine = { kind: TermLineKind; text: string };

type Project = {
  id: string;
  index: string;
  title: string;
  tags: string[];
  short: string;
  terminalTitle: string;
  terminalLines: TermLine[];
  writeup: string[];
  liveUrl?: string;
  githubUrl?: string;
};

const PROJECTS: Project[] = [
  {
    id: "p1",
    index: "01",
    title: "Commerce Core — E-commerce REST API",
    tags: ["Node.js", "Express", "PostgreSQL", "JWT", "Stripe"],
    short:
      "Full-featured shop backend: cart, checkout, Stripe webhook fulfillment, admin role access, and paginated catalog search with Redis cache.",
    terminalTitle: "~/commerce-core",
    terminalLines: [
      { kind: "comment", text: "# Boot the platform locally" },
      { kind: "prompt",  text: "$ pnpm install && pnpm dev" },
      { kind: "text",    text: "✔ Postgres connected   (pool=10)" },
      { kind: "text",    text: "✔ Redis cache warmed    (30 keys)" },
      { kind: "ok",      text: "➜ Listening on :3000" },
    ],
    writeup: [
      "Commerce Core is a REST-first store backend handling auth, products, carts, orders and Stripe-hosted checkouts.",
      "Challenges included guaranteeing webhook idempotency (each Stripe event keyed in Postgres so retries never double-charge), and keeping the catalog sub-50ms with a Redis TTL layer.",
      "Shipped with a CI/CD pipeline running migrations on Heroku review apps.",
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "p2",
    index: "02",
    title: "Socket Room — Real-time Chat Engine",
    tags: ["WebSocket", "Redis Pub/Sub", "Node.js", "Rate Limiting"],
    short:
      "Horizontally-scalable chat: presence, typing indicators, DMs, rooms, and sliding-window rate limits backed by sorted sets.",
    terminalTitle: "~/socket-room",
    terminalLines: [
      { kind: "prompt",  text: "$ pm2 start server.js -i 4" },
      { kind: "text",    text: "[PM2] App launched · 4 instances" },
      { kind: "text",    text: "➜ redis.pubsub → 'chat:events' online" },
      { kind: "ok",      text: "✔ 182 peers connected · 0 dropped msgs" },
    ],
    writeup: [
      "A WebSocket chat server scaled across 4 processes using Redis Pub/Sub as the fan-out bus — any node can broadcast to any room.",
      "The tricky part was rate limiting per-user across the cluster. Solved with a ZADD-based sliding window that survives process crashes.",
      "Also supports ephemeral typing indicators — broadcast on keystroke, TTL-expire after 4s of silence.",
    ],
    githubUrl: "#",
  },
  {
    id: "p3",
    index: "03",
    title: "ProbeKit — CTF Vulnerability Scanner",
    tags: ["Python", "Nmap", "Requests", "PoC Scripts"],
    short:
      "Educational offensive toolkit for Capture The Flag events: port/version scans, common HTTP misconfigs, and reusable PoC modules.",
    terminalTitle: "~/probekt · venv",
    terminalLines: [
      { kind: "comment", text: "# Run a recon sweep on a CTF target" },
      { kind: "prompt",  text: "$ python -m probe scan ctf.local" },
      { kind: "warn",    text: "  ! 22/tcp  SSH   OpenSSH 7.4  (user enum!)" },
      { kind: "warn",    text: "  ! 80/tcp  HTTP  Apache/2.4   (TRACE on)" },
      { kind: "ok",      text: "✔ 3 exploit modules loaded · run 'probe use #3'" },
    ],
    writeup: [
      "ProbeKit is my CTF-workflow-in-a-box — a Python CLI to reduce the first 20 minutes of recon to one command.",
      "It wraps Nmap XML output, then fires modules for common finds (TRACE-enabled, robots.txt /sitemap.xml leaks, .git/config disclosures).",
      "Written for learning, use only in labs and authorized CTFs.",
    ],
    githubUrl: "#",
  },
  {
    id: "p4",
    index: "04",
    title: "Minishort — Analytics Shortener API",
    tags: ["FastAPI", "Docker", "SQLAlchemy", "Redis RL"],
    short:
      "Clean URL shortener with per-alias analytics (referer, UA, country), token bucket rate limits, and one-command Docker Compose deploy.",
    terminalTitle: "~/minishort",
    terminalLines: [
      { kind: "prompt",  text: "$ docker compose up -d --build" },
      { kind: "text",    text: "  ✔ postgres  healthy" },
      { kind: "text",    text: "  ✔ redis     healthy" },
      { kind: "text",    text: "  ✔ api       :8000 → uvicorn running" },
      { kind: "ok",      text: "➜ docs: http://localhost:8000/docs" },
    ],
    writeup: [
      "A URL shortener with a focus on observability — every resolve stores a light analytics row so dashboard can show click trends.",
      "Rate limit per-IP with a 40-token bucket over 60s so bulk-abuse stops at the API gateway, not the DB.",
      "Whole stack ships in one docker-compose up command for easy portability.",
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "p5",
    index: "05",
    title: "EventBus — Order Microservice",
    tags: ["Kafka", "Node.js", "Avro", "Docker Compose"],
    short:
      "Event-driven order flow: orders.created → payments.processed → shipments.dispatched, dead-letter queue + consumer offsets monitored.",
    terminalTitle: "~/event-bus",
    terminalLines: [
      { kind: "prompt",  text: "$ kafka-console-consumer --topic orders.v1 --from-beginning | head -5" },
      { kind: "text",    text: "  { order_id: 1093,  status: 'CREATED',  ts: … }" },
      { kind: "text",    text: "  { order_id: 1093,  status: 'PAID',     ts: … }" },
      { kind: "ok",      text: "✔ shipments-consumer lags: 0   (healthy)" },
    ],
    writeup: [
      "A 3-service order pipeline with Kafka as the backbone. Each service is responsible for exactly one event transformation.",
      "Idempotency keys in every consumer so replay-from-zero is safe when fixing bugs.",
      "Avro schemas in a registry to guarantee no accidental cross-service message breaks.",
    ],
    githubUrl: "#",
  },
  {
    id: "p6",
    index: "06",
    title: "VaultKit — Password Manager API",
    tags: ["Argon2", "AES-GCM", "Audit Log", "Go"],
    short:
      "Secrets vault with memory-hard Argon2id master hashing, AES-GCM per-secret encryption, and tamper-evident audit log.",
    terminalTitle: "~/vaultkit · vault",
    terminalLines: [
      { kind: "prompt",  text: "$ vault login sonia@dev" },
      { kind: "text",    text: "  master password ********  (Argon2id m=64M, t=3)" },
      { kind: "ok",      text: "✔ unlocked · 42 vault entries loaded" },
      { kind: "prompt",  text: "$ vault get 'stripe/prod'" },
      { kind: "ok",      text: "decrypted → sk_live_********************" },
    ],
    writeup: [
      "Backend for a personal password manager — no password is ever stored in reversible form.",
      "Master key is derived via Argon2id (64MB memory cost), each secret is AES-GCM encrypted with its own data key.",
      "Every auth+read is appended to a sequentially-linked audit log, you can detect tampering with a simple chain hash.",
    ],
    githubUrl: "#",
  },
  {
    id: "p7",
    index: "07",
    title: "CRM-API — Velora Team Project",
    tags: ["NestJS", "Prisma", "PostgreSQL", "Jest", "CI/CD"],
    short:
      "Internal customer-relationship backend built with the Velora team: role tiers, CSV import pipelines, test coverage gated by CI.",
    terminalTitle: "~/velora-crm",
    terminalLines: [
      { kind: "prompt",  text: "$ git push origin feature/customer-dupes" },
      { kind: "text",    text: "  running 3 jobs · lint · unit · migrate" },
      { kind: "text",    text: "  jest  PASS  41/41   coverage: 84%" },
      { kind: "ok",      text: "✔ merge request ready → assigned for review" },
    ],
    writeup: [
      "Production CRM backend built alongside the backend engineering group at Velora during my internship.",
      "Shipped the deduplication pipeline that runs across 100k+ rows before any CSV import commits — prevented thousands of bad writes.",
      "Introduced Jest coverage gating to CI so we never regressed on the service layer tests.",
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

/** ── Terminal content renderer ─────────────────────────────────── */
function Terminal({
  title,
  lines,
  visible,
}: {
  title: string;
  lines: TermLine[];
  visible: boolean;
}) {
  const flat = lines.map((l) => l.text).join("\n");
  const { displayed, done } = useTypingEffect(flat, 120, 10, 20, visible);
  const shownLines = displayed.split("\n");
  const visibleLines = lines.slice(0, shownLines.length);

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalBar}>
        <span className={`${styles.termDot} ${styles.red}`} />
        <span className={`${styles.termDot} ${styles.yellow}`} />
        <span className={`${styles.termDot} ${styles.green}`} />
        <span className={styles.termTitle}>{title}</span>
      </div>
      <div className={styles.termBody}>
        {visibleLines.map((line, i) => {
          let cls = "";
          if (line.kind === "prompt")  cls = styles.prompt;
          if (line.kind === "comment") cls = styles.comment;
          if (line.kind === "ok")      cls = styles.ok;
          if (line.kind === "warn")    cls = styles.warn;
          if (line.kind === "err")     cls = styles.err;
          const isLast = i === visibleLines.length - 1;
          const append = isLast && !done ? (
            <>
              {shownLines[i]}
              <span className={styles.cursor} />
            </>
          ) : (
            shownLines[i] ?? ""
          );
          return (
            <span key={i} className={styles.termLine}>
              <span className={cls}>{append}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** ── Card component ───────────────────────────────────────────── */
function Card({
  project,
  onOpen,
  visible,
  stagger,
}: {
  project: Project;
  onOpen: (p: Project) => void;
  visible: boolean;
  stagger: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cardInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const revealWhen = visible && cardInView;

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      onMouseMove={handleMouse}
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.85,
        delay: stagger * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className={styles.index}>{project.index}</span>

      <div className={styles.headline}>
        <h3 className={styles.title}>{project.title}</h3>
      </div>

      <div className={styles.tags}>
        {project.tags.map((t, i) => (
          <motion.span
            key={t}
            className={styles.tag}
            initial={{ opacity: 0, y: 6 }}
            animate={revealWhen ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.45 }}
          >
            {t}
          </motion.span>
        ))}
      </div>

      <p className={styles.description}>{project.short}</p>

      <Terminal
        title={project.terminalTitle}
        lines={project.terminalLines}
        visible={revealWhen}
      />
    </motion.div>
  );
}

/** ── Main section ──────────────────────────────────────────────── */
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
          <Card
            key={p.id}
            project={p}
            onOpen={setSelected}
            visible={listVisible}
            stagger={i}
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

              <div className={styles.modalSubtitle}>Project {selected.index}</div>
              <h3 className={styles.modalTitle}>{selected.title}</h3>

              <div className={styles.modalTags}>
                {selected.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>

              {/* Photo slot for real screenshot later — replace with <Image src="..." /> */}
              <div className={styles.modalMedia}>
                screenshot placeholder · drop an image here later
              </div>

              {selected.writeup.map((p, i) => (
                <p key={i} className={styles.modalParagraph}>{p}</p>
              ))}

              <div className={styles.modalLinks}>
                {selected.githubUrl && (
                  <a className={styles.modalLink} href={selected.githubUrl} target="_blank" rel="noreferrer noopener">
                    <Code2 size={15} /> Source code
                  </a>
                )}
                {selected.liveUrl && (
                  <a className={`${styles.modalLink} ${styles.modalLinkPrimary}`} href={selected.liveUrl} target="_blank" rel="noreferrer noopener">
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
