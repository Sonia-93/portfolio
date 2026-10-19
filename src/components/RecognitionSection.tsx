"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Award, BookOpen, Lightbulb, Medal } from "lucide-react";
import styles from "./RecognitionSection.module.css";

const credentials = [
  {
    title: "2026 Season Semifinalist",
    issuer: "Technovation Rwanda · HerIngress",
    type: "Certificate of recognition",
    description: "Recognized for developing HerIngress as a member of Team Dev Girls in the 2026 Technovation season.",
    file: "/certificates/technovation-2026-semifinalist.pdf",
    preview: "/certificates/previews/technovation.png",
    icon: Medal,
  },
  {
    title: "Networking Basics",
    issuer: "Cisco Networking Academy",
    type: "Course completion",
    description: "Completed the Networking Basics course through the Cisco Networking Academy program.",
    file: "/certificates/cisco-networking-basics.pdf",
    preview: "/certificates/previews/cisco.png",
    icon: BookOpen,
  },
  {
    title: "AI Software Design & Development",
    issuer: "Nazli Tech School · Women in Tech Rwanda",
    type: "Course completion",
    description: "Completed a course in AI Software Design and Development with Nazli Tech School and Women in Tech Rwanda.",
    file: "/certificates/ai-software-design-and-development.pdf",
    preview: "/certificates/previews/ai-software-design.png",
    icon: Lightbulb,
  },
  {
    title: "Wavumbuzi Entrepreneurship Challenge",
    issuer: "6th Edition · 2026",
    type: "Certificate of appreciation",
    description: "Recognized for active participation in the 6th edition of the Wavumbuzi Entrepreneurship Challenge.",
    file: "/certificates/wavumbuzi-certificate-of-appreciation.pdf",
    preview: "/certificates/previews/wavumbuzi.png",
    icon: Award,
  },
];

export default function RecognitionSection() {
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const visibleCredentials = showAll ? credentials : credentials.slice(0, 2);

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
          <p className={styles.intro}>A record of continued learning, creative problem-solving, and recognition. Select a certificate to view it.</p>
        </motion.div>

        <div className={styles.certificateList}>
          {visibleCredentials.map(({ title, issuer, type, description, file, preview, icon: Icon }, index) => {
            const isExpanded = expanded === index;
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
                  </div>
                  <button
                    type="button"
                    className={styles.expandButton}
                    onClick={() => setExpanded(isExpanded ? null : index)}
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
                        <span className={styles.detailLabel}>About this credential</span>
                        <p>{description}</p>
                        <a href={file} target="_blank" rel="noreferrer" className={styles.pdfLink}>
                          Open original PDF <ArrowUpRight size={15} />
                        </a>
                      </div>
                      <a href={file} target="_blank" rel="noreferrer" className={styles.previewLink} aria-label={`Open the full ${title} certificate PDF`}>
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

        {!showAll && credentials.length > visibleCredentials.length && (
          <button className={styles.showAllButton} type="button" onClick={() => setShowAll(true)}>
            Show all certificates <span>+{credentials.length - visibleCredentials.length}</span>
          </button>
        )}
      </div>
    </section>
  );
}
