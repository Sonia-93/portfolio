"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import styles from "./projects.module.css";

import scree from "@/app/scree.png";
import wastenetFront from "@/app/wastenetFront.png";
import staffnet from "@/app/staffnet.png";
import staffnetFront from "@/app/staffnetFront.png";
import umuco from "@/app/umuco.png";
import umucoFront from "@/app/umucoFront.png";
import code from "@/app/code.png";
import codeFront from "@/app/codeFront.png";
import rcaFront from "@/app/rcaFront.png";
import rcaRight from "@/app/rcaRight.png";
import gwizaFront from "@/app/gwizaFront.png";
import gwizaRight from "@/app/gwizaRight.png";

type Project = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  tags: string[];
  defaultImage?: StaticImageData;
  hoverImage?: StaticImageData;
  writeup: string[];
  githubUrl?: string;
  liveUrl?: string;
};

const projects: Project[] = [
  {
    id: "wastenet",
    category: "Artificial Intelligence",
    title: "WasteNet",
    subtitle: "Smart Waste Classification System",
    tags: ["Next.js", "Python", "AI Classification", "PostgreSQL"],
    defaultImage: wastenetFront,
    hoverImage: scree,
    writeup: [
      "WasteNet combines on-device AI with a cloud backend to turn ordinary bins into smart, connected units.",
      "Each smart bin runs a lightweight image classifier that identifies waste as it's dropped in — sorted into plastic, paper, biodegradable, non-biodegradable, metals, and other common categories.",
      "The real-time dashboard aggregates fill levels, collection status, and environmental-impact metrics across every location.",
    ],
  },
  {
    id: "staffnet",
    category: "Operations Platform",
    title: "StaffNet",
    subtitle: "RCA Staff Operations Portal",
    tags: ["Express", "PostgreSQL", "OpenAI", "React"],
    defaultImage: staffnetFront,
    hoverImage: staffnet,
    writeup: [
      "StaffNet was built specifically for Rwanda Coding Academy staff, replacing paper-based workflows that were slow, error-prone, and hard to search.",
      "The platform centralizes three of the most common admin jobs: student helpdesk tickets, the student phone borrow-log, and the student-funds ledger.",
      "Every module has role-based dashboards for admins, matrons, and finance staff.",
    ],
  },
  {
    id: "umucocore",
    category: "Cultural Heritage",
    title: "UmucoCore",
    subtitle: "Digital Heritage Archive Platform",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Media Library"],
    defaultImage: umucoFront,
    hoverImage: umuco,
    writeup: [
      "UmucoCore is a living digital archive dedicated to preserving and celebrating Rwandan cultural heritage.",
      "The platform features oral histories, traditional music, dance documentation, indigenous crafts, and community-curated stories.",
      "Built with role-based contribution workflows, elders and cultural custodians can submit content directly.",
    ],
  },
  {
    id: "codebridge",
    category: "Education Technology",
    title: "CodeBridge",
    subtitle: "Coding Education Community",
    tags: ["TYPO3", "PHP", "MySQL", "JavaScript"],
    defaultImage: codeFront,
    hoverImage: code,
    writeup: [
      "CodeBridge connects aspiring developers with experienced mentors through structured learning paths and community support.",
      "The platform includes interactive coding challenges, project submission workflows with peer review, and live study rooms.",
      "Built for Rwanda's growing tech ecosystem, CodeBridge prioritizes offline-friendly content and Kinyarwanda language support.",
    ],
  },
  {
    id: "gwiza-ai",
    category: "Artificial Intelligence",
    title: "Gwiza AI",
    subtitle: "AI-Powered Recruitment Platform",
    tags: ["Next.js", "Node.js", "Express", "MongoDB", "REST API", "TypeScript"],
    defaultImage: gwizaFront,
    hoverImage: gwizaRight,
    githubUrl: "#",
    liveUrl: "#",
    writeup: [
      "Gwiza AI takes the guesswork out of hiring by automatically ranking applicants and surfacing the top 10–20 candidates.",
      "Each candidate comes with a detailed breakdown of their strengths, weaknesses, and the reasoning behind their ranking.",
      "The platform helps recruiters make faster, fairer decisions by removing unconscious bias from the shortlisting process.",
    ],
  },
  {
    id: "rca-website",
    category: "Web Maintenance",
    title: "RCA Website",
    subtitle: "Rwanda Coding Academy Official Website",
    tags: ["TYPO3", "PHP", "MySQL", "JavaScript"],
    defaultImage: rcaFront,
    hoverImage: rcaRight,
    writeup: [
      "The Rwanda Coding Academy website is the official online presence of one of Africa's leading coding schools.",
      "As part of the maintenance team, the role involves keeping the site updated, fixing bugs, and ensuring uptime and performance.",
      "The site is built on TYPO3 CMS with a PHP backend and MySQL database, serving thousands of visitors monthly.",
    ],
  },
  {
    id: "heringress",
    category: "AI / Social Impact",
    title: "HerIngress",
    subtitle: "AI-Powered Platform for Women Empowerment",
    tags: ["React", "AI", "Real-time Chat", "Node.js", "MongoDB"],
    writeup: [
      "HerIngress is an AI-powered platform built to empower women across every field.",
      "It features inspiring role model stories, field-specific opportunities, and real-time group chats where girls collaborate and invite mentors.",
      "Asha AI — a personal assistant built into the platform — guides each user on their unique journey, offering tailored advice and resources.",
    ],
  },
];

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={styles.card}
      onClick={() => onSelect(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.cardImage}>
        {project.defaultImage ? (
          <Image
            src={hovered && project.hoverImage ? project.hoverImage : project.defaultImage}
            alt={project.title}
            fill
            style={{ objectFit: "contain", transition: "opacity 0.3s ease" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <span>{project.title[0]}</span>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardCategory}>{project.category}</span>
        <h2 className={styles.cardTitle}>{project.title}</h2>
        <p className={styles.cardSubtitle}>{project.subtitle}</p>
        <div className={styles.cardTags}>
          {project.tags.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.viewStory}>View Story →</span>
          <div className={styles.cardLinks} onClick={(e) => e.stopPropagation()}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className={styles.iconLink} aria-label="GitHub">
                <Github size={15} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className={styles.iconLink} aria-label="Live Demo">
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={styles.detail}>
      <button className={styles.back} onClick={onBack} type="button">← Back</button>
      <div className={styles.detailHeader}>
        <span className={styles.detailCategory}>{project.category}</span>
        <h1 className={styles.detailTitle}>{project.title}</h1>
        <p className={styles.detailSubtitle}>{project.subtitle}</p>
      </div>
      <div className={styles.detailTags}>
        {project.tags.map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>
      <div
        className={styles.detailImage}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {project.hoverImage ? (
          <Image
            src={hovered && project.defaultImage ? project.defaultImage : project.hoverImage}
            alt={project.title}
            fill
            style={{ objectFit: "contain", transition: "opacity 0.3s ease" }}
            sizes="100vw"
            priority
          />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <span>Image coming soon</span>
          </div>
        )}
      </div>
      <div className={styles.detailWriteup}>
        {project.writeup.map((p, i) => (
          <p key={i} className={styles.detailParagraph}>{p}</p>
        ))}
      </div>

      {(project.githubUrl || project.liveUrl) && (
        <div className={styles.detailLinks}>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className={styles.detailBtn}>
              <Github size={15} /> Source Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className={`${styles.detailBtn} ${styles.detailBtnPrimary}`}>
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <main className={styles.page}>
      {selected ? (
        <ProjectDetail project={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
          <div className={styles.header}>
            <Link href="/#projects" className={styles.backLink}>← Back to Projects</Link>
            <h1 className={styles.title}>Projects Archive</h1>
            <p className={styles.desc}>
              A collection of projects built across backend systems, AI, and product development.
            </p>
          </div>
          <div className={styles.grid}>
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onSelect={setSelected} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
