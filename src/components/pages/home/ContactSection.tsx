import React from "react";
import SmallTitle from "../../shared/SmallTitle";
import QuickContactForm from "./QuickContactForm";

const ContactSection = () => {
  return (
    <div className="about-section w-full container mx-auto lg:px-4">
      <div className="w-full max-w-[min(100%,1290px)] mx-auto py-[150px] flex flex-col">
        <div className="bg-[url(https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/h1_bg-1.jpg)] bg-center bg-cover bg-no-repeat relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full flex rounded-[30px] flex-col overflow-hidden rounded-bl-none">
          <div className="px-5 pt-[60px] lg:pt-[100px] pb-10 flex flex-col z-[2] ">
            <div className="bg-white rounded-[30px] px-4">
              <div className="max-w-[630px] mx-auto py-[60px] lg:py-[100px]">
                <SmallTitle text="Quick enquiry" className="mx-auto" />

                <div className="my-10">
                  <h4 className="leading-[1] text-3xl lg:text-4xl font-bold clear-both text-center">
                    Get specialist advice for residential, commercial or
                    property
                  </h4>
                </div>

                <div className="z-[2]">
                  <div>
                    <QuickContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-full relative w-[150px] lg:w-[220px]">
            <div className="bg-white rounded-tr-[30px] w-full h-full">
              <div className="w-full h-full">
                <div className="h-full">
                  <div className="h-[60px]"></div>
                </div>
              </div>
            </div>
            {/* top-right */}
            <div className="bg-white w-[30px] h-[30px] absolute top-[-29.5px] left-[-0.5px] rotate-0 border-shape"></div>
            {/* bottom-left */}
            <div className="bg-white w-[30px] h-[30px] absolute bottom-[-0.5px] right-[-29.5px] rotate-0 border-shape"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
