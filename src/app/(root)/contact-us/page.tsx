import ContactForm from "@/components/pages/contact/ContactForm";
import ContactInfoSection from "@/components/pages/contact/ContactInfoSection";
import PageHeader from "@/components/shared/PageHeader";
import React from "react";
import bgImg from "../../../../public/images/bg/top-view-workspace-with-orange-background.jpg";

const ContactUsPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader title="Contact us" bgImage={bgImg} />

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 mb-[80px] lg:mt-[100px]">
        <ContactInfoSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
          <div className="">
            <ContactForm />
          </div>
          <div className="w-full h-[350px] lg:h-[450px] rounded-[30px] overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15902.469641653235!2d6.991649055970549!3d4.835574243261091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069ce6cbd09f00d%3A0xd94a034509a02e99!2sRevelation%20Mall!5e0!3m2!1sen!2sng!4v1752871557149!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
