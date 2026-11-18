"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Award, BookOpen, Rocket, ShieldCheck, ExternalLink } from "lucide-react";
import styles from "./certificates.module.css";

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
    type: "Course completion & certification",
    description: "Completed the AI Software Design & Development course, building practical skills in designing and developing AI-powered software.",
    file: "/certificates/ai-software-design-and-development.pdf",
    preview: "/certificates/previews/ai-software-design.png",
    relatedFile: "/certificates/nazli-letter-good-standing.pdf",
    icon: BookOpen,
  },
  {
    title: "Technovation 2026 Season Semifinalist",
    issuer: "Technovation · HerIngress",
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
  {
    title: "NASA Space Apps Challenge 2026",
    issuer: "NASA · Global Hackathon",
    type: "Certificate of participation",
    description: "Participated in the world's largest annual global hackathon, collaborating with a team to build solutions using open NASA data to address real-world challenges in space exploration and science.",
    file: "/certificates/nasa-space-apps-challenge.pdf",
    preview: "/certificates/previews/nasa.png",
    icon: Rocket,
  },
];

// Newest first
const orderedCredentials = [...credentials].reverse();

type Credential = (typeof credentials)[number];

function CertificateCard({ credential, onSelect }: { credential: Credential; onSelect: (c: Credential) => void }) {
  const Icon = credential.icon;
  return (
    <div className={styles.card} onClick={() => onSelect(credential)}>
      <div className={styles.cardPreview}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={credential.preview} alt={credential.title} className={styles.cardImg} />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardType}>{credential.type}</span>
        <h2 className={styles.cardTitle}>{credential.title}</h2>
        <p className={styles.cardIssuer}>{credential.issuer}</p>
        <p className={styles.cardDesc}>{credential.description}</p>
        <div className={styles.cardFooter}>
          <span className={styles.viewStory}>View certificate →</span>
          <span className={styles.iconWrap}><Icon size={15} strokeWidth={1.6} /></span>
        </div>
      </div>
    </div>
  );
}

function CertificateDetail({ credential, onBack }: { credential: Credential; onBack: () => void }) {
  const Icon = credential.icon;
  return (
    <div className={styles.detail}>
      <button className={styles.back} onClick={onBack} type="button">← Back</button>
      <div className={styles.detailHeader}>
        <span className={styles.detailType}>{credential.type}</span>
        <h1 className={styles.detailTitle}>{credential.title}</h1>
        <p className={styles.detailIssuer}>{credential.issuer}</p>
      </div>
      <p className={styles.detailDesc}>{credential.description}</p>
      <div className={styles.detailPreview}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={credential.preview} alt={credential.title} className={styles.detailImg} />
      </div>
      <div className={styles.detailLinks}>
        <a href={credential.file} target="_blank" rel="noreferrer" className={styles.detailBtn}>
          <ExternalLink size={14} /> Open original certificate
        </a>
        {credential.relatedFile && (
          <a href={credential.relatedFile} target="_blank" rel="noreferrer" className={`${styles.detailBtn} ${styles.detailBtnSecondary}`}>
            <ExternalLink size={14} /> View letter of good standing
          </a>
        )}
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const [selected, setSelected] = useState<Credential | null>(null);

  return (
    <main className={styles.page}>
      {selected ? (
        <CertificateDetail credential={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
          <div className={styles.header}>
            <Link href="/#recognition" className={styles.backLink}>← Back to Portfolio</Link>
            <h1 className={styles.title}>Certificates & Recognition</h1>
            <p className={styles.desc}>
              A full record of achievements, completions, and recognitions — newest first.
            </p>
          </div>
          <div className={styles.grid}>
            {orderedCredentials.map((c) => (
              <CertificateCard key={c.file} credential={c} onSelect={setSelected} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
