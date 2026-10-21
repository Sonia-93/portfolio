import HeroSection from "@/components/HeroSection";
import IntersectionSection from "@/components/IntersectionSection";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import RecognitionSection from "@/components/RecognitionSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import PortfolioFooter from "@/components/PortfolioFooter";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <>
      <main id="top">
        <CustomCursor />
        <HeroSection />
        <IntersectionSection />
        <AboutSection />
        <JourneySection />
        <TechStackSection />
        <ProjectsSection />
        <RecognitionSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <PortfolioFooter />
    </>
  );
}
