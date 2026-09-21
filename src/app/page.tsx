import HeroSection from "@/components/HeroSection";
import IntersectionSection from "@/components/IntersectionSection";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import ProjectsSection from "@/components/ProjectsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IntersectionSection />
      <AboutSection />
      <JourneySection />
      <ProjectsSection />
    </main>
  );
}
