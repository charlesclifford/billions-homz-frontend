import ContactForm from "@/components/pages/contact/ContactForm";
import ContactInfoSection from "@/components/pages/contact/ContactInfoSection";
import PageHeader from "@/components/shared/PageHeader";
import React from "react";
import bgImg from "../../../../public/images/bg/top-view-workspace-with-orange-background.jpg";
import ContactMap from "@/components/pages/contact/ContactMap";

const ContactUsPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader title="Contact us" bgImage={bgImg} />

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 mb-[80px] lg:mt-[100px]">
        <ContactInfoSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
          <ContactForm />
          <ContactMap />
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
