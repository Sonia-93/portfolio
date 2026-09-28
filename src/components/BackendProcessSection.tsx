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
  filename: string;
  codeLines: { text: string; cls?: string }[];
};

const STEPS: Step[] = [
  {
    id: "req",
    num: "01",
    icon: ClipboardList,
    title: "Requirements & Discovery",
    subtitle: "Map business goals to tech specs",
    description:
      "Before writing a single line of code I sit down with stakeholders and map out exactly what the system needs to do — users, roles, core flows, expected traffic, and non-negotiable constraints. The goal here is to make impossible decisions early, not late.",
    points: [
      "<strong>Stakeholder interviews</strong> — identify core users, roles, and high-priority workflows",
      "<strong>Traffic &amp; scale estimates</strong> — rough QPS, concurrent users, data growth per month",
      "<strong>Acceptance criteria</strong> — every feature written as testable, measurable requirements",
      "<strong>Constraints &amp; trade-offs</strong> — realtime vs consistency, budget, timeline, compliance",
    ],
    filename: "requirements.md",
    codeLines: [
      { text: "# Backend Spec — User Service", cls: "codeComment" },
      { text: "" },
      { text: "## Actors & Roles", cls: "codeComment" },
      { text: "ROLES = [", cls: "codeKeyword" },
      { text: '  "GUEST"     # browse public data', cls: "codeString" },
      { text: '  "USER"      # own profile, orders', cls: "codeString" },
      { text: '  "ADMIN"     # full CRUD, reports', cls: "codeString" },
      { text: "]" },
      { text: "" },
      { text: "## Non-Functional Requirements", cls: "codeComment" },
      { text: "NFR = {" },
      { text: "  latency_p95: 300,    # ms", cls: "codeNum" },
      { text: "  availability: 99.9,  # %", cls: "codeNum" },
      { text: "  rps_target: 500", cls: "codeNum" },
      { text: "}" },
    ],
  },
  {
    id: "arch",
    num: "02",
    icon: Network,
    title: "System Architecture",
    subtitle: "Pick the right shape for the job",
    description:
      "Now I translate the requirements into a blueprint. Monolith vs microservices, where state lives, which services talk to which, and how the system fails gracefully. Diagrams and quick prototypes come before production code.",
    points: [
      "<strong>Architecture style</strong> — modular monolith first; split services only when boundaries are obvious",
      "<strong>Communication</strong> — sync (HTTP/gRPC) vs async queues (Redis/RabbitMQ) for background work",
      "<strong>Service boundaries</strong> — single-responsibility modules with explicit public APIs",
      "<strong>Fault-tolerance</strong> — retries, circuit breakers, idempotency keys baked in from day one",
    ],
    filename: "architecture.ts",
    codeLines: [
      { text: "// High-level system topology", cls: "codeComment" },
      { text: "" },
      { text: "const system = {", cls: "codeKeyword" },
      { text: "  gateway:   'Nginx / Cloudflare',", cls: "codeString" },
      { text: "  apiLayer:  'NestJS (HTTP + WebSockets)',", cls: "codeString" },
      { text: "  workers:   'BullMQ queues for email + ML jobs',", cls: "codeString" },
      { text: "  cache:     'Redis 7 (sessions + hot reads)',", cls: "codeString" },
      { text: "  db:        'PostgreSQL 16 (primary + replica)',", cls: "codeString" },
      { text: "  storage:   'S3-compatible object store',", cls: "codeString" },
      { text: "  observability: 'Prometheus + Grafana + Sentry',", cls: "codeString" },
      { text: "};", cls: "codePunct" },
    ],
  },
  {
    id: "db",
    num: "03",
    icon: Database,
    title: "Database Design",
    subtitle: "Schema shapes the entire app",
    description:
      "A clean schema saves months of pain later. I start with the ER diagram, normalize tables to 3NF, then strategically denormalize for reads. Indexes, constraints, and migration strategy are locked in before the first INSERT.",
    points: [
      "<strong>Schema design</strong> — entities, relationships, enums, and correct nullability",
      "<strong>Indexes &amp; query plan</strong> — EXPLAIN every query the app will issue at scale",
      "<strong>Migrations</strong> — versioned, reversible, zero-downtime when possible",
      "<strong>Seed &amp; fixtures</strong> — realistic test data so dev envs behave like production",
    ],
    filename: "schema.prisma",
    codeLines: [
      { text: "model User {", cls: "codeKeyword" },
      { text: "  id        String   @id @default(cuid())", cls: "codeVar" },
      { text: "  email     String   @unique", cls: "codeVar" },
      { text: "  role      Role     @default(USER)", cls: "codeVar" },
      { text: "  createdAt DateTime @default(now())", cls: "codeVar" },
      { text: "  orders    Order[]", cls: "codeType" },
      { text: "" },
      { text: "  @@index([email, role])", cls: "codeFn" },
      { text: "}", cls: "codePunct" },
      { text: "" },
      { text: "model Order {", cls: "codeKeyword" },
      { text: "  id     String @id @default(cuid())", cls: "codeVar" },
      { text: "  userId String", cls: "codeVar" },
      { text: "  user   User   @relation(fields: [userId])", cls: "codeType" },
      { text: "  status Status @default(PENDING)", cls: "codeVar" },
      { text: "}", cls: "codePunct" },
    ],
  },
  {
    id: "api",
    num: "04",
    icon: Layers,
    title: "API & Business Logic",
    subtitle: "Controllers → services → repositories",
    description:
      "I keep business logic isolated from transport layers so HTTP, gRPC, and a CLI can all drive the same code. Strict layering means tests are fast and replacing a framework doesn't require rewriting the app.",
    points: [
      "<strong>Layered architecture</strong> — routes/controller → service → repository, no cross-leaks",
      "<strong>Contract-first</strong> — OpenAPI or tRPC schema written before handlers",
      "<strong>Validation</strong> — DTOs with class-validator / zod at every trust boundary",
      "<strong>Error taxonomy</strong> — typed domain errors map cleanly to HTTP 4xx / 5xx",
    ],
    filename: "user.service.ts",
    codeLines: [
      { text: "@Injectable()", cls: "codeFn" },
      { text: "export class UserService {", cls: "codeKeyword" },
      { text: "  constructor(", cls: "codePunct" },
      { text: "    private readonly users: UserRepository,", cls: "codeType" },
      { text: "    private readonly hash: HashService,", cls: "codeType" },
      { text: "    private readonly events: EventBus,", cls: "codeType" },
      { text: "  ) {}", cls: "codePunct" },
      { text: "" },
      { text: "  async register(dto: RegisterDto) {", cls: "codeFn" },
      { text: "    const exists = await this.users.findByEmail(dto.email);", cls: "codeVar" },
      { text: "    if (exists) throw new UserAlreadyExistsError();", cls: "codeKeyword" },
      { text: "    const user = await this.users.create({", cls: "codeVar" },
      { text: "      ...dto,", cls: "codeVar" },
      { text: "      passwordHash: await this.hash.make(dto.password),", cls: "codeVar" },
      { text: "    });", cls: "codePunct" },
      { text: "    await this.events.publish(new UserCreated(user.id));", cls: "codeFn" },
      { text: "    return user;", cls: "codeKeyword" },
      { text: "  }", cls: "codePunct" },
      { text: "}", cls: "codePunct" },
    ],
  },
  {
    id: "sec",
    num: "05",
    icon: ShieldCheck,
    title: "Auth & Security",
    subtitle: "Defense in depth, every request",
    description:
      "Security is not a final pass — it's baked into each layer. Signed short-lived access tokens, refresh tokens in httpOnly cookies, RBAC at both route and service levels, plus the OWASP Top 10 run through on every endpoint.",
    points: [
      "<strong>Authentication</strong> — JWT + refresh rotation or httpOnly sessions, rate-limited login",
      "<strong>Authorization</strong> — role &amp; attribute checks both in routes AND inside services",
      "<strong>Input hygiene</strong> — parameterized queries, CSP, CORS, CSRF tokens for forms",
      "<strong>Secrets</strong> — env-managed via Vault/.env, never committed, rotated on incidents",
    ],
    filename: "auth.guard.ts",
    codeLines: [
      { text: "@Injectable()", cls: "codeFn" },
      { text: "export class JwtGuard implements CanActivate {", cls: "codeKeyword" },
      { text: "  canActivate(ctx: ExecutionContext) {", cls: "codeFn" },
      { text: "    const req = ctx.switchToHttp().getRequest();", cls: "codeVar" },
      { text: "    const token = this.extractBearer(req);", cls: "codeVar" },
      { text: "    const payload = this.jwt.verify(token, {", cls: "codeVar" },
      { text: "      algorithms: ['ES256'],", cls: "codeString" },
      { text: "      issuer: 'api.myapp',", cls: "codeString" },
      { text: "    });", cls: "codePunct" },
      { text: "    req.user = payload.sub;", cls: "codeVar" },
      { text: "    return true;", cls: "codeKeyword" },
      { text: "  }", cls: "codePunct" },
      { text: "}", cls: "codePunct" },
    ],
  },
  {
    id: "test",
    num: "06",
    icon: TestTube2,
    title: "Testing & Optimization",
    subtitle: "Verify, measure, then speed up",
    description:
      "I write tests where they pay for themselves: unit tests for pure logic, integration tests for service boundaries, and a small set of smoke tests that run in CI. After correctness comes profiling — slow queries, cold paths, and memory leaks get hunted down with real data.",
    points: [
      "<strong>Testing pyramid</strong> — 70% unit, 25% integration, 5% e2e; flaky tests are deleted or fixed",
      "<strong>CI pipelines</strong> — lint → typecheck → test → build, on every PR before merge",
      "<strong>Performance</strong> — DB query logs, flamegraphs, cache hit ratios, k6 load tests",
      "<strong>Observability</strong> — structured logs, metrics dashboards, APM tracing per request",
    ],
    filename: "user.service.spec.ts",
    codeLines: [
      { text: "describe('UserService.register', () => {", cls: "codeFn" },
      { text: "  it('creates a user and emits event', async () => {", cls: "codeFn" },
      { text: "    const { users, hash, events, service } = setup();", cls: "codeVar" },
      { text: "    users.findByEmail.resolves(null);", cls: "codeVar" },
      { text: "    hash.make.resolves('$2a$10$...salted');", cls: "codeString" },
      { text: "" },
      { text: "    const user = await service.register({", cls: "codeVar" },
      { text: "      email: 'a@x.com', password: 'secret123',", cls: "codeString" },
      { text: "    });", cls: "codePunct" },
      { text: "" },
      { text: "    expect(users.create).toHaveBeenCalled();", cls: "codeFn" },
      { text: "    expect(events.publish).toHaveBeenCalledWith(", cls: "codeFn" },
      { text: "      expect.any(UserCreated),", cls: "codeType" },
      { text: "    );", cls: "codePunct" },
      { text: "  });", cls: "codePunct" },
      { text: "});", cls: "codePunct" },
    ],
  },
  {
    id: "deploy",
    num: "07",
    icon: Rocket,
    title: "Deploy & Operate",
    subtitle: "Containers, pipelines, rollbacks",
    description:
      "Every service ships inside a container with a Dockerfile and docker-compose for local parity. CI builds the image, pushes the registry, and rolls out to staging first. Production deployments are gradual, with automatic rollback on health-check failure.",
    points: [
      "<strong>Containerize</strong> — multi-stage Dockerfiles, distroless/Alpine, non-root user",
      { text: "<strong>Infra as code</strong> — Terraform/Pulumi, reproducible environments", cls: "" } as any,
      "<strong>Zero-downtime deploys</strong> — rolling updates, health probes, automated rollback",
      "<strong>Runbooks &amp; alerts</strong> — on-call paging with dashboards and known-incident playbooks",
    ],
    filename: "Dockerfile",
    codeLines: [
      { text: "# syntax=docker/dockerfile:1.7", cls: "codeComment" },
      { text: "FROM node:20-alpine AS build", cls: "codeKeyword" },
      { text: "WORKDIR /app", cls: "codeVar" },
      { text: "COPY package*.json ./", cls: "codeKeyword" },
      { text: "RUN npm ci --only=production=false", cls: "codeFn" },
      { text: "COPY . .", cls: "codeKeyword" },
      { text: "RUN npm run build", cls: "codeFn" },
      { text: "" },
      { text: "FROM node:20-alpine AS runtime", cls: "codeKeyword" },
      { text: "USER node", cls: "codeKeyword" },
      { text: "COPY --from=build --chown=node /app/dist ./dist", cls: "codeKeyword" },
      { text: "EXPOSE 3000", cls: "codeKeyword" },
      { text: 'CMD ["node", "dist/main.js"]', cls: "codeString" },
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

      <div className={styles.layout}>
        {/* ─── STEPS COLUMN ─── */}
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
            const isCompleted = i < activeIdx;
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
                  } ${isCompleted ? styles.stepCircleCompleted : ""}`}
                >
                  {isCompleted ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <Icon className={styles.stepIcon} strokeWidth={2} />
                  )}
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

        {/* ─── DETAIL PANEL ─── */}
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

                <div className={styles.codeBlock}>
                  <div className={styles.codeHeader}>
                    <div className={styles.codeDots}>
                      <span className={styles.codeDot} />
                      <span className={styles.codeDot} />
                      <span className={styles.codeDot} />
                    </div>
                    <div className={styles.codeFile}>{activeStep.filename}</div>
                    <div style={{ width: 36 }} />
                  </div>
                  <div className={styles.codeBody}>
                    {activeStep.codeLines.map((ln, i) => (
                      <motion.span
                        key={i}
                        className={`${styles.codeLine} ${ln.cls ? styles[ln.cls] : ""}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.25 + i * 0.03,
                        }}
                      >
                        {ln.text || "\u00A0"}
                      </motion.span>
                    ))}
                  </div>
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
