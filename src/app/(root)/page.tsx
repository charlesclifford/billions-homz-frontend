import AboutSection from "@/components/home/AboutSection";
import BlogSection from "@/components/home/BlogSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import { Metadata } from "next";

const pageTitle = "Home";

export const metadata: Metadata = {
  title: pageTitle,
};

const Homepage = () => {
  return (
    <div className="min-h-dvh">
      <HeroSection />
      <AboutSection />
      <WhatWeOffer />
      <TestimonialSection />
      <ContactSection />
      <BlogSection />
    </div>
  );
};

export default Homepage;
