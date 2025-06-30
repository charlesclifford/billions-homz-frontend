import AboutUsSection from "@/components/pages/about/AboutUsSection";
import ExploreCompany from "@/components/pages/about/ExploreCompany";
import TeamSection from "@/components/pages/about/TeamSection";
import PageHeader from "@/components/shared/PageHeader";

const AboutPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader
        title="About Us"
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/about-bc.jpg"
      />

      <AboutUsSection />
      <ExploreCompany />
      <TeamSection />
    </div>
  );
};

export default AboutPage;
