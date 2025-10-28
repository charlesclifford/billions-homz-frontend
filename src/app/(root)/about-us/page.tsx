import AboutUsSection from "@/components/pages/about/AboutUsSection";
import ExploreCompany from "@/components/pages/about/ExploreCompany";
import TeamSection from "@/components/pages/about/TeamSection";
import PageHeader from "@/components/shared/PageHeader";
import bgImg from "../../../../public/images/bg/black-lives-matter-protesting-with-megaphones.jpg";
import OurStory from "@/components/pages/about/OurStory";

const AboutPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader title="About Us" bgImage={bgImg} />

      <AboutUsSection />
      <OurStory />
      <ExploreCompany />
      <TeamSection />
    </div>
  );
};

export default AboutPage;
