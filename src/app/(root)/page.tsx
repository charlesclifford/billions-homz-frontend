import AboutSection from "@/components/home/AboutSection";
import HeroSection from "@/components/home/HeroSection";
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
    </div>
  );
};

export default Homepage;
