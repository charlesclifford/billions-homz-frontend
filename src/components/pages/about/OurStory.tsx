"use client";
import React from "react";
import { motion } from "framer-motion";
import SmallTitle from "@/components/shared/SmallTitle";

const OurStory = () => {
  // Animation variants

  const titleVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <div id="team" className="w-full about-section">
      <div className="w-full container max-w-[min(100%,1290px)] mx-auto px-4 pt-[150px] flex flex-col ">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <SmallTitle text="Our Story" className="mx-auto" />
        </motion.div>

        <motion.div
          className="max-w-full w-[760px] mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
          transition={{ delay: 0.2 }}
        >
          <div className="mt-[30px] mb-[60px]">
            <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
              Our Story
            </h2>
          </div>
        </motion.div>

        <div className="space-y-4 text-lg leading-[28px] text-center">
          <p>
            Billionshomz Properties was born from a simple belief that everyone
            deserves a chance to own real estate without fear or stress.
          </p>
          <p>
            What started as a small dream has grown into one of Port Harcourt’s
            trusted names in land sales and estate development, with several
            thriving projects like Elevation City Estate and Prestige Gardens
            Estate.
          </p>
          <p>
            Through the years, we’ve helped hundreds of Nigerians secure
            properties that not only bring peace of mind but also appreciate in
            value — turning land ownership into a true path to financial
            freedom.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
          <h3 className="text-[22px] font-semibold leading-[32px]">
            Why Choose Billionshomz Properties?
          </h3>

          <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
            <li>Genuine and verified properties</li>
            <li>Flexible payment options (outright or installments)</li>
            <li>Strategic locations with high returns</li>
            <li>Transparent documentation process</li>
            <li>Dedicated customer support from start to finish</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
