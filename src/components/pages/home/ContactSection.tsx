"use client";
import React from "react";
import SmallTitle from "../../shared/SmallTitle";
import QuickContactForm from "./QuickContactForm";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const slideInUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const ContactSection = () => {
  return (
    <div className="about-section w-full container mx-auto lg:px-4">
      <div className="w-full max-w-[min(100%,1290px)] mx-auto py-16 lg:py-28 flex flex-col">
        <motion.div
          className="bg-[url(https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/h1_bg-1.jpg)] bg-center bg-cover bg-no-repeat relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full flex rounded-[30px] flex-col overflow-hidden rounded-bl-none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleUp}
        >
          <div className="px-2 lg:px-5 pt-[60px] lg:pt-[100px] pb-10 flex flex-col z-[2] ">
            <motion.div
              className="bg-card rounded-[30px] px-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="max-w-[630px] mx-auto py-[60px] lg:py-[100px]">
                <motion.div variants={slideInUp}>
                  <SmallTitle text="Quick enquiry" className="mx-auto" />
                </motion.div>

                <motion.div className="my-10" variants={slideInUp}>
                  <h4 className="leading-[1] text-3xl lg:text-4xl font-bold clear-both text-center">
                    Get specialist advice for residential, commercial or
                    property
                  </h4>
                </motion.div>

                <motion.div className="z-[2]" variants={slideInUp}>
                  <div>
                    <QuickContactForm />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-full relative w-[150px] lg:w-[220px]">
            <div className="bg-background rounded-tr-[30px] w-full h-full">
              <div className="w-full h-full">
                <div className="h-full">
                  <div className="h-[60px]"></div>
                </div>
              </div>
            </div>
            {/* top-right */}
            <div className="bg-background w-[30px] h-[30px] absolute top-[-29.5px] left-[-0.5px] rotate-0 border-shape"></div>
            {/* bottom-left */}
            <div className="bg-background w-[30px] h-[30px] absolute bottom-[-0.5px] right-[-29.5px] rotate-0 border-shape"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactSection;
