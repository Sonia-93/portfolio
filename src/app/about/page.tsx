import IntersectionSection from "@/components/IntersectionSection";
import AboutSection from "@/components/AboutSection";

export const metadata = {
  title: "About — Sonia",
  description: "Learn about Sonia, a backend developer building systems at the intersection of aesthetic, performance, and strategy.",
};

export default function AboutPage() {
  return (
    <main>
      <IntersectionSection />
      <AboutSection />
    </main>
  );
}
