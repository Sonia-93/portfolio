"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Award, BookOpen, ShieldCheck } from "lucide-react";
import styles from "./RecognitionSection.module.css";

const credentials = [
  {
    title: "Best Team — High School Women in Cyber",
    issuer: "primeCTF-Africa 2026 · Upanzi DPI Network",
    type: "Certificate of achievement",
    description: "Ciphers Team earned Best Team on the Africa leaderboard in the High School Women in Cyber category, demonstrating cybersecurity knowledge and problem-solving.",
    file: "/certificates/primectf-africa-2026.png",
    preview: "/certificates/primectf-africa-2026.png",
    icon: ShieldCheck,
  },
  {
    title: "AI Software Design & Development",
    issuer: "Nazli Tech School · Women in Tech Rwanda",
    type: "Course completion",
    description: "Completed the AI Software Design & Development course, building practical skills in designing and developing AI-powered software.",
    file: "/certificates/ai-software-design-and-development.pdf",
    preview: "/certificates/previews/ai-software-design.png",
    icon: BookOpen,
  },
  {
    title: "2026 Season Semifinalist",
    issuer: "Technovation Rwanda · HerIngress",
    type: "Certificate of recognition",
    description: "Recognized as a semifinalist for outstanding work with Team Dev Girls, developing the HerIngress project in the 2026 Technovation season.",
    file: "/certificates/technovation-2026-semifinalist.pdf",
    preview: "/certificates/previews/technovation.png",
    icon: Award,
  },
  {
    title: "Wavumbuzi Entrepreneurship Challenge",
    issuer: "6th Edition · 2026",
    type: "Certificate of appreciation",
    description: "Received a certificate of appreciation for participation in the 6th edition of the Wavumbuzi Entrepreneurship Challenge.",
    file: "/certificates/wavumbuzi-certificate-of-appreciation.pdf",
    preview: "/certificates/previews/wavumbuzi.png",
    icon: Award,
  },
];

export default function RecognitionSection() {
  const [expanded, setExpanded] = useState<number[]>([]);
  const allExpanded = expanded.length === credentials.length;

  return (
    <section className={styles.section} id="recognition" aria-labelledby="recognition-title">
      <div className={styles.inner}>
        <motion.div
          className={styles.heading}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>Progress with purpose</span>
          <h2 id="recognition-title" className={styles.title}>Certificates <span>&amp; recognition</span></h2>
        </motion.div>

        <div className={styles.certificateList}>
          {credentials.map(({ title, issuer, type, description, file, preview, icon: Icon }, index) => {
            const isExpanded = expanded.includes(index);
            return (
              <motion.article
                key={file}
                className={`${styles.credentialRow} ${isExpanded ? styles.credentialRowExpanded : ""}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                <div className={styles.rowTop}>
                  <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.icon}><Icon size={18} strokeWidth={1.6} /></span>
                  <div className={styles.credentialText}>
                    <span className={styles.credentialType}>{type}</span>
                    <h3>{title}</h3>
                    <p>{issuer}</p>
                    <p className={styles.credentialDescription}>{description}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.expandButton}
                    onClick={() => setExpanded((current) => (
                      isExpanded ? current.filter((item) => item !== index) : [...current, index]
                    ))}
                    aria-expanded={isExpanded}
                    aria-controls={`credential-preview-${index}`}
                    aria-label={`${isExpanded ? "Hide" : "View"} ${title}`}
                  >
                    {isExpanded ? <ArrowUpRight size={19} /> : <ArrowDownRight size={19} />}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`credential-preview-${index}`}
                      className={styles.credentialDetails}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className={styles.detailCopy}>
                        <span className={styles.detailLabel}>Certificate preview</span>
                        <a href={file} target="_blank" rel="noreferrer" className={styles.pdfLink}>
                          Open original certificate <ArrowUpRight size={15} />
                        </a>
                      </div>
                      <a href={file} target="_blank" rel="noreferrer" className={styles.previewLink} aria-label={`Open the full ${title} certificate`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt={`${title} certificate`} className={styles.preview} />
                        <span className={styles.previewHint}>Open full certificate <ArrowUpRight size={15} /></span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
        <button
          className={styles.viewAllButton}
          type="button"
          onClick={() => setExpanded(allExpanded ? [] : credentials.map((_, index) => index))}
          aria-expanded={allExpanded}
        >
          {allExpanded ? "Close all previews" : "View all certificates"}
          {allExpanded ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
        </button>
      </div>
    </section>
  );
}
