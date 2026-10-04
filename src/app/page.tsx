import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import TechStackSection from "@/components/TechStackSection";
import BackendProcessSection from "@/components/BackendProcessSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <TechStackSection />
      <BackendProcessSection />
      <ProjectsSection />
      <TestimonialsSection />
    </main>
  );
}
