"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Code2, FolderOpen, Mail, Star } from "lucide-react";
import styles from "./NavBar.module.css";

const links = [
  { icon: Home,          href: "/",           label: "Home",         section: "home" },
  { icon: User,          href: "/#about",     label: "About",        section: "about" },
  { icon: Code2,         href: "/#skills",    label: "Skills",       section: "skills" },
  { icon: FolderOpen,    href: "/projects",   label: "Projects",     section: "projects" },
  { icon: MessageSquare, href: "/#testimonials", label: "Testimonials", section: "testimonials" },
  { icon: Mail,          href: "/#contact",   label: "Contact",      section: "contact" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    if (pathname !== "/") {
      const match = links.find((l) => l.href === pathname);
      setActiveSection(match?.section ?? "home");
      return;
    }

    const SECTION_IDS = ["home", "about", "journey", "skills", "projects", "testimonials", "contact"];

    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const midpoint = scrollY + vh * 0.45;

      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (midpoint >= top) {
          if (id === "journey") current = "about";
          else current = id;
        }
      }
      setActiveSection(current);

      void scrollY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <nav className={styles.nav}>
      {links.map(({ icon: Icon, href, label, section }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${activeSection === section ? styles.active : ""}`}
          aria-label={label}
        >
          <Icon size={18} strokeWidth={1.8} />
        </Link>
      ))}
    </nav>
  );
}
