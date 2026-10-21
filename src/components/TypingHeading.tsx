"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import styles from "./TypingHeading.module.css";

type TypingHeadingProps = {
  text: string;
  className: string;
  id?: string;
};

export default function TypingHeading({ text, className, id }: TypingHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(headingRef, { once: true, amount: 0.65 });
  const reduceMotion = useReducedMotion() ?? false;
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;
    setDisplayed("");
    setDone(false);

    const typeNextCharacter = () => {
      if (cancelled) return;
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index < text.length) {
        timeoutId = setTimeout(typeNextCharacter, 55 + Math.random() * 25);
      } else {
        setDone(true);
      }
    };

    timeoutId = setTimeout(typeNextCharacter, 120);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [inView, reduceMotion, text]);

  return (
    <h2 ref={headingRef} id={id} className={className} aria-label={text} style={{ minHeight: "1em" }}>
      {displayed}
      {!done && inView && <span className={styles.caret} aria-hidden="true" />}
    </h2>
  );
}
