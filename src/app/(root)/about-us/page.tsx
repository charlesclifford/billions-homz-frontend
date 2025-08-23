import AboutUsSection from "@/components/pages/about/AboutUsSection";
import ExploreCompany from "@/components/pages/about/ExploreCompany";
import TeamSection from "@/components/pages/about/TeamSection";
import PageHeader from "@/components/shared/PageHeader";

const AboutPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader
        title="About Us"
        bgImage="/images/bg/black-lives-matter-protesting-with-megaphones.jpg"
      />

      <AboutUsSection />
      <ExploreCompany />
      <TeamSection />
    </div>
  );
};

export default AboutPage;
