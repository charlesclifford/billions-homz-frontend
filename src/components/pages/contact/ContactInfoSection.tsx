"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { BiEnvelopeOpen, BiMap, BiPhoneCall } from "react-icons/bi";
import { motion } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.98 },
  };

  return (
    <div className="w-full mb-[80px] mt-[30px] lg:mt-[100px]">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {itemsList.map((item, i) => (
          <motion.div
            key={i}
            className="rounded-[30px] border p-[50px] flex flex-col"
            variants={itemVariants}
          >
            <div className="mb-[50px] h-full">
              <div className="text-left">
                <motion.div
                  className="mb-[30px]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>

                <div className="text-left">
                  <motion.h5
                    className="text-[26px] tracking-[0] leading-[1.23] font-bold mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.7, duration: 0.5 }}
                  >
                    <span>{item.title}</span>
                  </motion.h5>

                  <motion.p
                    className="text-neutral-600 dark:text-neutral-400 text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.9, duration: 0.5 }}
                  >
                    {item.value}
                  </motion.p>
                </div>
              </div>
            </div>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
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
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ContactInfoSection;
