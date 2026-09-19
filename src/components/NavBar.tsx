"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, FolderOpen, Code2, Mail } from "lucide-react";
import styles from "./NavBar.module.css";

const links = [
  { icon: Home, href: "/", label: "Home" },
  { icon: User, href: "/about", label: "About" },
  { icon: FolderOpen, href: "/projects", label: "Projects" },
  { icon: Code2, href: "/skills", label: "Skills" },
  { icon: Mail, href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {links.map(({ icon: Icon, href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${pathname === href ? styles.active : ""}`}
          aria-label={label}
        >
          <Icon size={18} strokeWidth={1.8} />
        </Link>
      ))}
    </nav>
  );
}
