"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, FolderOpen, Code2, Mail } from "lucide-react";
import styles from "./NavBar.module.css";

const links = [
  { icon: Home, href: "/", label: "Home", section: "home" },
  { icon: User, href: "/about", label: "About", section: "about" },
  { icon: FolderOpen, href: "/projects", label: "Projects", section: "projects" },
  { icon: Code2, href: "/skills", label: "Skills", section: "skills" },
  { icon: Mail, href: "/contact", label: "Contact", section: "contact" },
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

    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const intersectionEnd = heroHeight * 4.5;

      if (scrollY < heroHeight * 0.6) {
        setActiveSection("home");
      } else if (scrollY < intersectionEnd) {
        setActiveSection("about");
      } else {
        setActiveSection("about");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
