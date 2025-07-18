import { Button } from "@/components/ui/button";
import React from "react";
import { BiEnvelopeOpen, BiMap, BiPhoneCall } from "react-icons/bi";

const ContactInfoSection = () => {
  const itemsList: {
    icon: React.ReactNode;
    title: string;
    value: string;
    action: string;
    buttonName: string;
  }[] = [
    {
      icon: <BiEnvelopeOpen className="h-6 w-6" />,
      title: "Support Email",
      value: "billionshomzproperties@gmail.com",
      action: "mailto:billionshomzproperties@gmail.com",
      buttonName: "Email Us",
    },
    {
      icon: <BiPhoneCall className="h-6 w-6" />,
      title: "Phone Number",
      value: "+(234) 814 - 999 6145",
      action: "tel:+2348149996145",
      buttonName: "Call Us",
    },
    {
      icon: <BiMap className="h-6 w-6" />,
      title: "Our Location",
      value: "1st Floor Revelation Mall Opposite Ebony Junction Rumuola Road",
      action: "https://maps.app.goo.gl/gfmbTwTFBJGSsFLC8",
      buttonName: "Visit Us",
    },
  ];
  return (
    <div className="w-full mb-[80px] mt-[30px] lg:mt-[100px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        {itemsList.map((item, i) => (
          <div
            key={i}
            className="rounded-[30px] border p-[50px] flex flex-col "
          >
            <div className="mb-[50px] h-full">
              <div className="text-left">
                <div className="mb-[30px]">{item.icon}</div>

                <div className="text-left">
                  <h5 className="text-[26px] tracking-[0] leading-[1.23] font-bold">
                    <span>{item.title}</span>
                  </h5>

                  <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Button
                asChild
                className="w-full h-full rounded-[30px] py-3.5 px-[30px] capitalize font-sm font-bold leading-[1.7] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
             hover:bg-neutral-800 dark:hover:bg-neutral-900 hover:text-white"
              >
                <a
                  href={item.action}
                  target={item.title === "Our Location" ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                >
                  {item.buttonName}
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfoSection;
