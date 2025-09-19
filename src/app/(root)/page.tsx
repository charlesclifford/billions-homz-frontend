import AboutSection from "@/components/pages/home/AboutSection";
import AcademySection from "@/components/pages/home/AcademySection";
import BlogSection from "@/components/pages/home/BlogSection";
import ContactSection from "@/components/pages/home/ContactSection";
import HeroSection from "@/components/pages/home/HeroSection";
import PropertiesSection from "@/components/pages/home/PropertiesSection";
import TestimonialSection from "@/components/pages/home/TestimonialSection";
import WhatWeOffer from "@/components/pages/home/WhatWeOffer";
import { Metadata } from "next";

const pageTitle = "Home";

export const metadata: Metadata = {
  title: pageTitle,
};

const Homepage = () => {
  return (
    <div className="min-h-dvh">
      <HeroSection />
      <div className="bg-background">
        <AboutSection />
      </div>
      <WhatWeOffer />
      <PropertiesSection />
      <AcademySection />
      <TestimonialSection />

      <div className="bg-background">
        <ContactSection />
      </div>
      <div className="bg-background">
        <BlogSection />
      </div>
    </div>
  );
};

export default Homepage;
