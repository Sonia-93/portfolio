"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./HeroSection.module.css";

function useLiveDateTime() {
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState({ date: "", time: "" });

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setDisplay({ date: dateStr, time: timeStr });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return { ...display, mounted };
}

function useTypingEffect(
  text: string,
  startDelay: number,
  baseSpeed: number = 75,
  variance: number = 60,
  startTrigger: boolean = true
) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTrigger) return;

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

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, ease: "easeOut" as const, delay },
  };
}

// Animated dots canvas
function DotsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate dots — mix of white and grey
    const COUNT = 80;
    const dots = Array.from({ length: COUNT }, () => {
      const isWhite = Math.random() > 0.4;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.4,
        opacity: isWhite ? Math.random() * 0.4 + 0.6 : Math.random() * 0.25 + 0.05,
        color: isWhite ? "255,255,255" : "160,160,160",
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        if (d.color === "255,255,255") {
          // Outer glow
          const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 6);
          glow.addColorStop(0, `rgba(255,255,255,${d.opacity})`);
          glow.addColorStop(0.2, `rgba(255,255,255,${d.opacity * 0.6})`);
          glow.addColorStop(1, "rgba(255,255,255,0)");
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r * 6, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Bright core
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,1)`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${d.color},${d.opacity})`;
          ctx.fill();
        }

        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.dotsCanvas} />;
}

// ─── Revolving orbital rings ─────────────────────────────────────────────────
function OrbitalRings() {
  return (
    <div className={styles.orbitalWrapper} aria-hidden="true">
      <div className={styles.ring1}>
        <div className={styles.ring1Inner} />
        <div className={styles.ring1Arc} />
        <div className={styles.ring1Node} />
      </div>
      <div className={styles.ring2}>
        <div className={styles.ring2Inner} />
        <div className={styles.ring2Arc} />
        <div className={styles.ring2Node} />
      </div>
      <div className={styles.ring3}>
        <div className={styles.ring3Inner} />
        <div className={styles.ring3Arc} />
        <div className={styles.ring3Node} />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { date, time, mounted } = useLiveDateTime();
  const { displayed: text1, done: done1 } = useTypingEffect("Hi there", 700, 70, 55, true);
  const { displayed: text2, done: done2 } = useTypingEffect("I am Sonia", 300, 70, 55, done1);

  const typingFullyDone = done1 && done2;

  return (
    <section className={styles.hero}>
      <DotsCanvas />
      <OrbitalRings />

      {/* ── Top Left: Logo mark ── */}
      <motion.div className={styles.logoMark} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
        <span className={styles.logoSquare1} />
        <span className={styles.logoSquare2} />
      </motion.div>

      {/* ── Main Headline ── */}
      <div className={styles.headline}>
        <h1 className={styles.headlineText}>
          {text1}
          {!done1 && <span className={styles.typingCursor} />}
        </h1>

        <div className={styles.headlineLine2}>
          <span className={styles.headlineTextWhite}>
            {text2}
            {done1 && !done2 && <span className={styles.typingCursor} />}
          </span>
          <motion.span
            className={styles.accentRect}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: typingFullyDone ? 1 : 0,
              scale: typingFullyDone ? 1 : 0.6,
            }}
            transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
          />
        </div>

        <motion.p
          className={styles.role}
          initial={{ opacity: 0, y: 40 }}
          animate={typingFullyDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2, ease: "easeOut" }}
        >
          Backend Developer
        </motion.p>
        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 40 }}
          animate={typingFullyDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.45, ease: "easeOut" }}
        >
          <a href="mailto:sonia@example.com" className={styles.btnPrimary}>
            Get In Touch
          </a>
          <a href="/cv.pdf" download className={styles.btnOutline}>
            Download CV
          </a>
        </motion.div>
      </div>
    </section>
  );
}
