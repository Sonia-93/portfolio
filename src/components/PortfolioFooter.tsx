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
          <a className={styles.brand} href="#top" aria-label="Shimirwa Teta Sonia, back to top">
            <span className={styles.monogram}>ST</span>
            <span className={styles.brandText}>
              <strong>Shimirwa Teta Sonia</strong>
              <small>Backend developer · Cybersecurity enthusiast</small>
            </span>
          </a>
          <p className={styles.note}>Building thoughtful software, one system at a time.</p>
          <a className={styles.contactLink} href="mailto:shimirwasonia5@gmail.com">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>© {new Date().getFullYear()} Shimirwa Teta Sonia</p>
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
