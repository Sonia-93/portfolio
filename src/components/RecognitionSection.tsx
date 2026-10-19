"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Award, ExternalLink, Sparkles, UsersRound, X } from "lucide-react";
import styles from "./RecognitionSection.module.css";

const credentials = [
  {
    title: "2026 Season Semifinalist",
    issuer: "Technovation Rwanda · HerIngress",
    type: "Certificate of recognition",
    file: "/certificates/technovation-2026-semifinalist.pdf",
    preview: "/certificates/previews/technovation.png",
  },
  {
    title: "Networking Basics",
    issuer: "Cisco Networking Academy",
    type: "Course completion",
    file: "/certificates/cisco-networking-basics.pdf",
    preview: "/certificates/previews/cisco.png",
  },
  {
    title: "AI Software Design & Development",
    issuer: "Nazli Tech School · Women in Tech Rwanda",
    type: "Course completion",
    file: "/certificates/ai-software-design-and-development.pdf",
    preview: "/certificates/previews/ai-software-design.png",
  },
  {
    title: "Wavumbuzi Entrepreneurship Challenge",
    issuer: "6th Edition · 2026",
    type: "Certificate of appreciation",
    file: "/certificates/wavumbuzi-certificate-of-appreciation.pdf",
    preview: "/certificates/previews/wavumbuzi.png",
  },
];

const highlights = [
  {
    number: "01",
    value: "04",
    unit: "credentials",
    title: "Learning across disciplines",
    description: "Coursework and recognition spanning networking, AI software design, entrepreneurship, and innovation.",
    icon: Award,
  },
  {
    number: "02",
    value: "02",
    unit: "recognitions",
    title: "Taking on new challenges",
    description: "Recognized as a Technovation Rwanda 2026 semifinalist and in the Wavumbuzi Entrepreneurship Challenge.",
    icon: Sparkles,
  },
  {
    number: "03",
    value: "2026",
    unit: "season",
    title: "HerIngress · Team Dev Girls",
    description: "Developed HerIngress as a member of Team Dev Girls for the Technovation Rwanda season.",
    icon: UsersRound,
  },
];

export default function RecognitionSection() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeCredential, setActiveCredential] = useState<number | null>(null);
  const shownCredentials = credentials;
  const selectedCredential = activeCredential === null ? null : credentials[activeCredential];
  const modalKey = activeCredential !== null ? activeCredential + 1 : galleryOpen ? 0 : null;

  useEffect(() => {
    if (modalKey === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCredential(null);
        setGalleryOpen(false);
      }
      if (modalKey > 0 && event.key === "ArrowRight") setActiveCredential((current) => current === null ? 0 : (current + 1) % credentials.length);
      if (modalKey > 0 && event.key === "ArrowLeft") setActiveCredential((current) => current === null ? credentials.length - 1 : (current - 1 + credentials.length) % credentials.length);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modalKey]);

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
          <p className={styles.intro}>A few markers of the work, learning, and momentum behind my journey as a developer.</p>
        </motion.div>

        <div className={styles.contentGrid}>
          <div className={styles.achievementList}>
            {highlights.map(({ number, value, unit, title, description, icon: Icon }, index) => (
              <motion.article
                key={number}
                className={styles.achievement}
                initial={{ opacity: 0, x: -22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={styles.number}>{number}</span>
                <span className={styles.icon}><Icon size={18} strokeWidth={1.6} /></span>
                <div className={styles.achievementBody}>
                  <div className={styles.metric}><strong>{value}</strong><span>{unit}</span></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <ArrowUpRight className={styles.arrow} size={17} aria-hidden="true" />
              </motion.article>
            ))}
          </div>

          <motion.aside
            className={styles.certificatePanel}
            initial={{ opacity: 0, y: 28, rotate: 1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            aria-labelledby="credentials-title"
          >
            <div className={styles.credentialsHeading}>
              <div>
                <span className={styles.credentialsEyebrow}>Learning · building · growing</span>
                <h3 id="credentials-title">Certificates <span>&amp; recognition</span></h3>
              </div>
              <span className={styles.credentialCount}>04 <small>items</small></span>
            </div>
            <div className={styles.credentialGrid}>
              {shownCredentials.map((credential, index) => (
                <motion.article
                  key={credential.file}
                  className={styles.credentialCard}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.09 }}
                >
                  <span className={styles.previewWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={credential.preview} alt={`${credential.title} certificate preview`} className={styles.preview} />
                    <button
                      type="button"
                      className={styles.openCredential}
                      onClick={() => setActiveCredential(credentials.indexOf(credential))}
                      aria-label={`View ${credential.title}`}
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </span>
                  <span className={styles.credentialInfo}>
                    <span className={styles.credentialType}>{credential.type}</span>
                    <strong>{credential.title}</strong>
                    <span className={styles.credentialIssuer}>{credential.issuer}</span>
                  </span>
                </motion.article>
              ))}
            </div>
            <button className={styles.showAllButton} type="button" onClick={() => setGalleryOpen(true)}>
              Show all certificates
              <span>{credentials.length} <ArrowUpRight size={15} /></span>
            </button>
          </motion.aside>
        </div>
      </div>

      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            className={styles.viewerBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGalleryOpen(false)}
          >
            <motion.div
              className={styles.galleryViewer}
              role="dialog"
              aria-modal="true"
              aria-labelledby="all-certificates-title"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.viewerHeader}>
                <div>
                  <span className={styles.credentialType}>Learning · building · growing</span>
                  <h3 id="all-certificates-title">All certificates &amp; recognition</h3>
                  <p>Browse each credential and open its full preview.</p>
                </div>
                <button className={styles.viewerClose} type="button" onClick={() => setGalleryOpen(false)} aria-label="Close certificate gallery"><X size={20} /></button>
              </div>
              <div className={styles.allCredentialsGrid}>
                {credentials.map((credential, index) => (
                  <button
                    key={credential.file}
                    className={styles.galleryCard}
                    type="button"
                    onClick={() => { setGalleryOpen(false); setActiveCredential(index); }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={credential.preview} alt="" />
                    <span className={styles.credentialType}>{credential.type}</span>
                    <strong>{credential.title}</strong>
                    <span>{credential.issuer}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
        {selectedCredential && (
          <motion.div
            className={styles.viewerBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCredential(null)}
          >
            <motion.div
              className={styles.viewer}
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificate-viewer-title"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.viewerHeader}>
                <div>
                  <span className={styles.credentialType}>{selectedCredential.type}</span>
                  <h3 id="certificate-viewer-title">{selectedCredential.title}</h3>
                  <p>{selectedCredential.issuer}</p>
                </div>
                <button className={styles.viewerClose} type="button" onClick={() => setActiveCredential(null)} aria-label="Close certificate viewer"><X size={20} /></button>
              </div>
              <div className={styles.fullPreviewWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedCredential.preview} alt={`${selectedCredential.title} full certificate`} className={styles.fullPreview} />
              </div>
              <div className={styles.viewerFooter}>
                <button type="button" className={styles.viewerNav} onClick={() => setActiveCredential((activeCredential! - 1 + credentials.length) % credentials.length)} aria-label="Previous certificate"><ArrowLeft size={17} /> Previous</button>
                <a className={styles.openPdf} href={selectedCredential.file} target="_blank" rel="noreferrer">Open original PDF <ExternalLink size={15} /></a>
                <button type="button" className={styles.viewerNav} onClick={() => setActiveCredential((activeCredential! + 1) % credentials.length)} aria-label="Next certificate">Next <ArrowRight size={17} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
