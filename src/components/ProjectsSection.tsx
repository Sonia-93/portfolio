"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, Github, X } from "lucide-react";
import styles from "./ProjectsSection.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// 7 PLACEHOLDER PROJECTS (swap names/descriptions/tags/media later!)
// ─────────────────────────────────────────────────────────────────────────────
type TerminalLine = { kind: "prompt" | "out" | "ok" | "warn" | "err" | "comment"; text: string; delay?: number };

type Project = {
  indexDisplay: string;
  title: string;
  tags: string[];
  shortDescription: string;
  modal: {
    subtitle: string;
    intro: string;
    challenge: string;
    approach: string;
    impact: string;
    links: { label: string; href: string; variant?: "primary"; icon?: "github" | "external" }[];
  };
  termTitle: string;
  termLines: TerminalLine[];
};

const PROJECTS: Project[] = [
  {
    indexDisplay: "01",
    title: "E-Commerce Checkout API",
    tags: ["Node.js", "PostgreSQL", "Stripe", "JWT", "Redis"],
    shortDescription:
      "A production-ready backend for a multi-vendor storefront: cart operations, Stripe payment intents with webhook retries, JWT auth with refresh rotation, and inventory deduplication.",
    modal: {
      subtitle: "Fintech · Payments",
      intro: "Full-service backend API handling the entire customer checkout lifecycle for a multi-vendor fashion marketplace.",
      challenge: "Preventing double-charges on flaky mobile networks was the #1 risk — Stripe webhooks can arrive out-of-order and carts needed optimistic locking.",
      approach: "Designed idempotent payment intents + a Redis-queued webhook handler with exponential backoff retries. Inventory DB rows use SELECT FOR UPDATE to avoid oversells.",
      impact: "Zero double-charge incidents after launch, 99.99% checkout success, average <600ms payment confirmation latency even under peak traffic.",
      links: [
        { label: "View on GitHub", href: "#", icon: "github" },
        { label: "Live API Docs", href: "#", icon: "external", variant: "primary" },
      ],
    },
    termTitle: "~/checkout-api · zsh",
    termLines: [
      { kind: "comment", text: "# Start services + run migrations" },
      { kind: "prompt",  text: "docker compose up -d && npm run db:migrate" },
      { kind: "out",     text: "  ✔ postgres   healthy (port 5432)" },
      { kind: "out",     text: "  ✔ redis      healthy (port 6379)" },
      { kind: "ok",      text: "  ✔ applied 14 migrations in 820 ms" },
      { kind: "prompt",  text: "npm run dev" },
      { kind: "ok",      text: "🚀 Server listening on https://localhost:3001" },
    ],
  },
  {
    indexDisplay: "02",
    title: "Real-time Chat Server",
    tags: ["WebSocket", "Redis Pub/Sub", "Node.js", "Rate Limiting"],
    shortDescription:
      "Horizontally scalable chat with presence indicators, typing events, and E2E-encrypted DMs — backed by Redis pub/sub for cross-instance broadcast.",
    modal: {
      subtitle: "Realtime Systems",
      intro: "Scalable message broker powering a live chat app with ~300 concurrent rooms. Supports threads, reactions, and user presence.",
      challenge: "A single Node server couldn't hold 300+ WebSocket connections without dropping ping/pong frames. Also needed spam/rate controls without adding latency.",
      approach: "Multi-worker deployment behind nginx sticky sessions; Redis pub/sub fans out broadcast messages to all workers. Token-bucket rate limiter runs in Redis Lua atomically.",
      impact: "Scaled to 3× target concurrent users with <60ms median delivery time; spam reports dropped 88% after rate limiting went live.",
      links: [
        { label: "View on GitHub", href: "#", icon: "github" },
      ],
    },
    termTitle: "~/chat · wscat",
    termLines: [
      { kind: "prompt",  text: "wscat -c wss://chat.example/socket?token=eyJhbG..." },
      { kind: "ok",      text: "connected (server id: worker-03)" },
      { kind: "prompt",  text: "> {\"type\":\"join\",\"roomId\":\"room:general\"}" },
      { kind: "out",     text: "< {\"type\":\"presence\",\"usersOnline\":47}" },
      { kind: "out",     text: "< {\"type\":\"msg\",\"from\":\"@sonia\",\"text\":\"hello 👋\"}" },
      { kind: "prompt",  text: "> {\"type\":\"typing\",\"roomId\":\"room:general\"}" },
    ],
  },
  {
    indexDisplay: "03",
    title: "Vulnerability Scanner (CTF Toolkit)",
    tags: ["Python", "Nmap", "Requests", "PoC", "Cybersecurity"],
    shortDescription:
      "A CTF-oriented multi-scanner: subdomain enumeration, port discovery, HTTP smuggling probes, and quick CSRF/JWT audit — outputs clean JSON for triage.",
    modal: {
      subtitle: "Offensive Security · Tooling",
      intro: "Custom command-line reconnaissance toolkit built after my third CTF to stop re-writing the same 10 scripts every weekend.",
      challenge: "Most off-the-shelf tools take 10+ minutes and output far too much noise. I needed a fast, targeted scan that finishes before the CTF round timer heats up.",
      approach: "Asyncio pipeline: amass-style DNS + crt.sh → port fingerprinting via python-nmap → per-service probes (HTTP request smuggling variants, JWT alg:none check, etc.) — results merged to a single JSON report.",
      impact: "Won 2 back-to-back weekend CTFs using this as the starting recon; cut my typical 15-min manual enum routine down to a 90-second `python scan.py -t $BOX_IP`.",
      links: [
        { label: "View on GitHub", href: "#", icon: "github", variant: "primary" },
      ],
    },
    termTitle: "~/ctf-scan · bash",
    termLines: [
      { kind: "comment", text: "# Quick CTF recon against a target box" },
      { kind: "prompt",  text: "python scan.py -t 10.10.11.24 --mode=fast --output=report.json" },
      { kind: "warn",    text: "[!] running light scan — no destructive payloads" },
      { kind: "out",     text: "    DNS: found 6 subdomains via crt.sh passive" },
      { kind: "out",     text: "    Ports: 22, 80, 443, 3306, 8080" },
      { kind: "err",     text: "    [HIGH] /api/login accepts JWT alg:none" },
      { kind: "ok",      text: "✅ Wrote report.json (2.4 KB)" },
    ],
  },
  {
    indexDisplay: "04",
    title: "Shortlink + Analytics API",
    tags: ["FastAPI", "PostgreSQL", "Docker", "Redis Cache"],
    shortDescription:
      "Bit.ly-style shortener with rate limits, per-click geo-location analytics, custom slugs, and an admin dashboard with 24h top-links charts.",
    modal: {
      subtitle: "Developer Tools",
      intro: "Self-hosted link shortener I use for my own portfolio links with built-in click analytics.",
      challenge: "Hundreds of redirects per second hitting Postgres directly would kill it; also had to block spammy/phishing slugs at create time.",
      approach: "FastAPI async + Redis LRU cache for the top 5% of shortcodes (90%+ of all traffic). Slug denylist runs as a pre-validation Bloom filter so we never even touch the DB.",
      impact: "90th percentile redirect latency dropped from 450ms → 38ms after caching. Denylist caught 7 spam submissions in the first week.",
      links: [
        { label: "View on GitHub", href: "#", icon: "github" },
        { label: "Live Demo", href: "#", icon: "external", variant: "primary" },
      ],
    },
    termTitle: "~/shortlink · httpie",
    termLines: [
      { kind: "prompt",  text: "http POST :8000/shorten url==\"https://sonia.dev/projects\" slug==\"projects\"" },
      { kind: "ok",      text: "HTTP/1.1 201 Created" },
      { kind: "out",     text: "{" },
      { kind: "out",     text: '  "short": "https://s.sonia/projects",' },
      { kind: "out",     text: '  "createdAt": "2025-09-20T14:05:12Z"' },
      { kind: "out",     text: "}" },
      { kind: "prompt",  text: "http GET :8000/s/projects --headers | head -n 1" },
      { kind: "ok",      text: "HTTP/1.1 301 Moved Permanently" },
    ],
  },
  {
    indexDisplay: "05",
    title: "Event-driven Microservices",
    tags: ["Kafka", "Docker Compose", "Node.js", "Dead-letter Queue"],
    shortDescription:
      "Orders → Inventory → Payments → Email microservices communicating via Kafka. Exactly-once delivery, DLQ for poison messages, and a retry dashboard.",
    modal: {
      subtitle: "Distributed Systems",
      intro: "Class project that became my deepest dive into distributed systems: 4 micro-services glued together with a Kafka event bus.",
      challenge: "Naive at-least-once delivery was double-dispatching orders whenever the inventory worker crashed mid-consume. Needed exactly-once semantics without adding a full 2PC coordinator.",
      approach: "Idempotent event_id keys in the consumer DBs + a Redis distributed lock that gates offset commits. Poison messages land in a DLQ and a UI lets operators replay them.",
      impact: "Correctly handles 600 orders/min in load tests with zero duplicate invoices or phantom inventory decrements. DLQ dashboard prevents support tickets.",
      links: [
        { label: "View on GitHub", href: "#", icon: "github", variant: "primary" },
      ],
    },
    termTitle: "~/kafka-stack · k9s",
    termLines: [
      { kind: "prompt",  text: "kafkacat -b localhost:9092 -t orders.created -C -o end -c 2" },
      { kind: "out",     text: "% Reached end of topic orders.created [0]" },
      { kind: "ok",      text: "{\"event_id\":\"ord_9fa1\", \"total\":149.00, \"items\":[...]}" },
      { kind: "out",     text: "  → inventory.reserved ✓" },
      { kind: "out",     text: "  → payments.captured ✓" },
      { kind: "out",     text: "  → notifications.email_queued ✓" },
    ],
  },
  {
    indexDisplay: "06",
    title: "Password Manager API",
    tags: ["Argon2id", "AES-256-GCM", "Fastify", "PostgreSQL", "Audit Log"],
    shortDescription:
      "Zero-knowledge-style PW manager: clients encrypt locally, the server stores ciphertext + Argon2id-derived auth keys. All accesses are tamper-evident audit-logged.",
    modal: {
      subtitle: "Security / Crypto",
      intro: "Personal vault API — the password manager I actually use day-to-day. Clientside encryption; server never sees the plaintext.",
      challenge: "Balancing cryptographic strength (Argon2id params high enough to resist GPU crack) with reasonable unlock UX on a cheap VPS. Also audit log must be append-only.",
      approach: "Auth uses a separate Argon2id-derived key than vault decryption. The append-only audit table is only INSERT-able via trigger so even an admin can't backdate or delete rows.",
      impact: "Personal security upgrade — no more re-using passwords across CTF platforms. 3rd-party audit with `hashcat` confirmed >100 years crack-time per hash at 2025 GPU pricing.",
      links: [
        { label: "View on GitHub", href: "#", icon: "github" },
      ],
    },
    termTitle: "~/vault · cli",
    termLines: [
      { kind: "prompt",  text: "vault unlock" },
      { kind: "warn",    text: "Master password: **********" },
      { kind: "ok",      text: "Argon2id verified in 410 ms · 48 items decrypted" },
      { kind: "prompt",  text: "vault get github --show" },
      { kind: "out",     text: "  URL:      https://github.com/login" },
      { kind: "out",     text: "  User:     shimirwa-sonia" },
      { kind: "ok",      text: "  Password: ghp_********************LcYb" },
    ],
  },
  {
    indexDisplay: "07",
    title: "Internal CRM Backend (Velora)",
    tags: ["NestJS", "PostgreSQL", "Microservice", "Team Work"],
    shortDescription:
      "Worked as one of the backend engineers on the internal CRM rewrite: customer records API, role-based permission system, and CSV bulk-import jobs.",
    modal: {
      subtitle: "Internship · Velora",
      intro: "The CRM project I shipped as part of the backend engineering team during my Velora internship.",
      challenge: "The existing CRM only supported super-admin OR user; the sales team needed 4 roles (agent / manager / finance / admin) each with column-level visibility rules.",
      approach: "Designed a declarative RBAC table in Postgres and a small NestJS interceptor that applies column filtering automatically before responses hit the wire. Bulk CSV importer uses COPY FROM + idempotent upserts so the same file can be re-uploaded safely.",
      impact: "Shipped to 120 internal Velora users on schedule. Finance team's 2-hour/week manual reconciliation was replaced by the new CSV import pipeline (≈40 seconds).",
      links: [
        { label: "Velora (homepage)", href: "#", icon: "external", variant: "primary" },
      ],
    },
    termTitle: "~/velora-crm · nest",
    termLines: [
      { kind: "comment", text: "# Role-based column filter demo" },
      { kind: "prompt",  text: "curl -H \"Role: agent\" /api/customers?limit=2 | jq '.data[0]' | head -n 7" },
      { kind: "out",     text: "{" },
      { kind: "out",     text: '  "id": "cust_041",' },
      { kind: "out",     text: '  "company": "Kigali Coffee Co.",' },
      { kind: "out",     text: '  "status": "open"' },
      { kind: "out",     text: "}" },
      { kind: "prompt",  text: "curl -H \"Role: finance\" /api/customers?limit=2 | jq '.data[0].invoiceTotal'" },
      { kind: "ok",      text: "\"RWF 4,820,000\"" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hooks + helpers
// ─────────────────────────────────────────────────────────────────────────────
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

// Terminal lines that stream themselves one-by-one with a blinking cursor.
function TerminalPlayer({ lines, startWhen }: { lines: TerminalLine[]; startWhen: boolean }) {
  const [visible, setVisible] = useState(0);
  const [typingTail, setTypingTail] = useState("");
  const [cursorActive, setCursorActive] = useState(false);

  useEffect(() => {
    if (!startWhen) {
      setVisible(0);
      setTypingTail("");
      setCursorActive(false);
      return;
    }
    setVisible(0);
    let idx = 0;
    let charIdx = 0;
    let typeT: NodeJS.Timeout;
    let lineT: NodeJS.Timeout;
    let cancelled = false;

    const typeNextChar = () => {
      if (cancelled) return;
      const line = lines[idx];
      if (!line) {
        setCursorActive(true);
        return;
      }
      if (charIdx < line.text.length) {
        charIdx++;
        setTypingTail(line.text.slice(0, charIdx));
        setCursorActive(true);
        const base = line.kind === "prompt" ? 18 : line.kind === "comment" ? 8 : 10;
        typeT = setTimeout(typeNextChar, base + Math.random() * 12);
      } else {
        setTypingTail("");
        setCursorActive(idx >= lines.length - 1);
        idx++;
        charIdx = 0;
        setVisible(idx);
        if (idx < lines.length) {
          const d = lines[idx]?.delay ?? (lines[idx - 1]?.kind === "prompt" ? 140 : 50);
          lineT = setTimeout(typeNextChar, d);
        }
      }
    };
    lineT = setTimeout(typeNextChar, 180);

    return () => {
      cancelled = true;
      clearTimeout(typeT);
      clearTimeout(lineT);
    };
  }, [lines, startWhen]);

  return (
    <>
      {lines.slice(0, visible).map((l, i) => (
        <span key={i} className={`${styles.termLine} ${styles[l.kind] ?? ""}`}>
          {l.text}
        </span>
      ))}
      {typingTail && (
        <span
          className={`${styles.termLine} ${
            styles[lines[visible]?.kind ?? "out"] ?? ""
          }`}
        >
          {typingTail}
          {cursorActive && <span className={styles.cursor} />}
        </span>
      )}
      {!typingTail && cursorActive && (
        <span className={styles.termLine}>
          <span className={styles.cursor} />
        </span>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, {
    once: false,
    margin: "0px 0px -30% 0px",
  });

  // ── Step 1: Type the section header "PROJECTS" ──
  const { displayed: titleText, done: titleDone } = useTypingEffect(
    "Projects",
    0,
    65,
    35,
    sectionInView
  );

  const [selected, setSelected] = useState<number | null>(null);

  // Close modal on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section ref={sectionRef} className={styles.projects} id="projects">

      {/* Header: "SELECTED WORK" fade-in + "PROJECTS" typed */}
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
                    animation: "blinkCursor 0.75s ease-in-out infinite",
                  }}
                />
              )}
            </>
          ) : null}
        </h2>
      </div>

      {/* Cards list (rendered AFTER section title finishes typing) */}
      <motion.div
        className={styles.list}
        initial="hidden"
        animate={titleDone ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.indexDisplay}
            project={p}
            index={i}
            onOpen={() => setSelected(i)}
          />
        ))}
      </motion.div>

      {/* Modal for selected project */}
      <AnimatePresence>
        {selected !== null && (
          <ProjectModal
            project={PROJECTS[selected]}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single card (stagger-animated in the list)
// ─────────────────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -15% 0px" });
  const startTerminal = inView;

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      onClick={onOpen}
      onMouseMove={handleMouse}
      variants={{
        hidden: { opacity: 0, y: 34, filter: "blur(6px)" },
        show:   {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.02 * index,
          },
        },
      }}
      whileTap={{ scale: 0.995 }}
    >
      <div className={styles.index} aria-hidden="true">{project.indexDisplay}</div>

      <div className={styles.headline}>
        <h3 className={styles.title}>{project.title}</h3>
      </div>

      <div className={styles.tags}>
        {project.tags.map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>

      <p className={styles.description}>{project.shortDescription}</p>

      {/* Mini terminal preview on the right */}
      <div className={styles.terminal} aria-hidden="true">
        <div className={styles.terminalBar}>
          <span className={`${styles.termDot} ${styles.red}`} />
          <span className={`${styles.termDot} ${styles.yellow}`} />
          <span className={`${styles.termDot} ${styles.green}`} />
          <span className={styles.termTitle}>{project.termTitle}</span>
        </div>
        <div className={styles.termBody}>
          <TerminalPlayer lines={project.termLines} startWhen={startTerminal} />
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal (click a card → deep dive)
// ─────────────────────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className={styles.backdrop}
      onClick={onClose}
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
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close project"
        >
          <X size={16} strokeWidth={2.2} />
        </button>

        <div className={styles.modalSubtitle}>{project.modal.subtitle}</div>
        <h3 className={styles.modalTitle}>{project.title}</h3>

        <div className={styles.modalTags}>
          {project.tags.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>

        <div
          className={styles.modalMedia}
          title="Placeholder — drop a real screenshot here later!"
        >
          📷 screenshot / demo placeholder · 16:9
        </div>

        <p className={styles.modalParagraph}>{project.modal.intro}</p>
        <p className={styles.modalParagraph}><strong>Challenge:</strong> {project.modal.challenge}</p>
        <p className={styles.modalParagraph}><strong>Approach:</strong> {project.modal.approach}</p>
        <p className={styles.modalParagraph}><strong>Impact:</strong> {project.modal.impact}</p>

        <div className={styles.modalLinks}>
          {project.modal.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className={`${styles.modalLink} ${l.variant === "primary" ? styles.modalLinkPrimary : ""}`}
            >
              {l.icon === "github" ? <Github size={15} strokeWidth={2.2} /> : <ArrowUpRight size={15} strokeWidth={2.2} />}
              {l.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
