import styles from "./PortfolioFooter.module.css";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Recognition", href: "#recognition" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <p className={styles.quote}>Until you win, your efforts go unnoticed. Get used to it.</p>
          <a className={styles.contactLink} href="mailto:shimirwasonia5@gmail.com">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>© {new Date().getFullYear()} · All rights reserved.</p>
          <nav className={styles.navigation} aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a href={link.href} key={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className={styles.socials}>
            <a href="https://github.com/Sonia-93" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.instagram.com/t_sonia_93/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="#top" className={styles.backToTop} aria-label="Back to top">↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
