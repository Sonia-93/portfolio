import HeroSection from "@/components/HeroSection";
import IntersectionSection from "@/components/IntersectionSection";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import ProjectsSection from "@/components/ProjectsSection";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <HeroSection />
      <IntersectionSection />
      <AboutSection />
      <JourneySection />
      <ProjectsSection />
    </main>
  );
}
