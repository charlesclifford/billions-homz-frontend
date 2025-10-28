"use client";
import SmallTitle from "@/components/shared/SmallTitle";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Buildings, RulerPen, Setting2 } from "iconsax-reactjs";
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

const itemVariants = {
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

const slideInLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const slideInRight = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
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

const numberCount = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const AboutUsSection = () => {
  return (
    <>
      <div className="about-section w-full mb-[80px] mt-[30px] lg:mt-[100px]">
        <motion.div
          className="w-full container max-w-[min(100%,1290px)] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-[30px] mb-[80px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="col-span-1" variants={slideInLeft}>
            <SmallTitle text="About us" />

            <div className="max-w-full w-[520px]">
              <div className="mt-[30px]">
                <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-1px] lg:tracking-[-2px]">
                  Landlord Fits You
                </h2>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-span-1" variants={slideInRight}>
            <div>
              <div className="mb-5">
                <div className="text-[22px] font-semibold leading-[32px]">
                  At Billionshomz Properties, we don’t just sell lands , we put you right where the future is happening.
                </div>
              </div>
            </div>
            <div>
              <div className="mb-10">
                <p className="text-lg leading-[28px] mb-4">
                  We’re a fast-growing real estate and development company based in Port Harcourt, Nigeria, focused on helping individuals and investors own genuine lands and properties with ease, confidence, and peace of mind.

                </p>
                <p className="text-lg leading-[28px]">
                  Our work goes beyond transactions we build communities, and redefine what real estate means for everyday Nigerians.
                </p>
              </div>
            </div>
            <div className="">
              <Link
                href={"#team"}
                className="p-[5px] pl-[30px] bg-white rounded-[30px] text-sm font-bold capitalize inline-grid relative group border transition duration-300"
              >
                <span className="flex gap-2.5 items-center flex-row-reverse justify-center">
                  <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white">
                    <span className="flex items-center justify-center w-[18px] h-[18px] overflow-hidden relative">
                      {/* Top icon – animates out along 45deg */}
                      <span className="flex absolute items-center justify-center  transition-all duration-500 transform-3d transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] opacity-100 group-hover:transform-[translate3d(17px,-17px,0px)_scale3d(0.2,0.2,1)] group-hover:opacity-0">
                        <ArrowUpRight />
                      </span>

                      {/* Bottom icon – animates in along 45deg */}
                      <span className="flex absolute items-center justify-center  transition-all duration-500 transform-[translate3d(-17px,17px,0px)_scale3d(0.2,0.2,1)_rotate(-45deg)] opacity-0 group-hover:transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] group-hover:opacity-100">
                        <ArrowUpRight />
                      </span>
                    </span>
                  </span>
                  <span className="inline-block text-black ">
                    meet the team
                  </span>
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="about-section flex flex-col z-[1]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="w-full container max-w-[min(100%,1290px)] mx-auto px-4">
          <motion.div
            className="bg-[url(https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/h2_img1.jpg)] bg-no-repeat bg-cover bg-center w-full h-full rounded-[30px] grid grid-cols-1 lg:grid-cols-2"
            variants={scaleUp}
          >
            <div>
              <div className="max-w-full relative w-[150px] lg:w-[220px]">
                <div className="bg-background rounded-br-[30px] w-full h-full">
                  <div className="w-full h-full">
                    <div className="h-full">
                      <div className="h-[60px]"></div>
                    </div>
                  </div>
                </div>
                {/* top-right */}
                <div className="bg-background w-[30px] h-[30px] absolute top-0 right-[-30px] rotate-90 border-shape"></div>
                {/* bottom-left */}
                <div className="bg-background w-[30px] h-[30px] absolute bottom-[-30px] left-0 rotate-90 border-shape"></div>
              </div>
            </div>
            <div className="lg:pt-[130px] pb-[60px] lg:pb-2.5 px-2.5  flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                <div className="min-h-[200px] lg:min-h-[250px]"></div>

                {/* Stats Cards */}
                {[
                  {
                    icon: (
                      <Buildings
                        size="56"
                        color="var(--primary)"
                        variant="Bulk"
                      />
                    ),
                    label: "projects in development",
                    value: "40",
                  },
                  {
                    icon: (
                      <RulerPen
                        size="56"
                        color="var(--primary)"
                        variant="Bulk"
                      />
                    ),
                    label: "square feet of property",
                    value: "18m",
                  },
                  {
                    icon: (
                      <Setting2
                        size="56"
                        color="var(--primary)"
                        variant="Bulk"
                      />
                    ),
                    label: "total projects cost",
                    value: "2.5b",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-[#f5f5f5] dark:bg-card min-h-[200px] lg:min-h-[250px] flex justify-between flex-col gap-5 rounded-[25px] p-[15px] lg:py-[30px] px-10"
                    variants={itemVariants}
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.3 },
                    }}
                  >
                    {/* icon */}
                    <motion.div
                      className=""
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center justify-end">
                        {stat.icon}
                      </div>
                    </motion.div>
                    {/* text */}
                    <div>
                      <div className="flex justify-center flex-col-reverse items-stretch">
                        <motion.div
                          className="flex items-center text-lg leading-[1.5em] text-neutral-600 dark:text-neutral-400"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.1 + 0.5,
                            duration: 0.5,
                          }}
                          viewport={{ once: true }}
                        >
                          {stat.label}
                        </motion.div>
                        <motion.div
                          className="text-[60px] flex text-center font-bold leading-[1.06em] tracking-[-2px]"
                          variants={numberCount}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.6 }}
                        >
                          {/* number prefix */}
                          <span className="text-end"></span>
                          <span className="">{stat.value}</span>
                          {/* number suffix */}
                          <span className="text-start text-primary">
                            <sup>+</sup>
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default AboutUsSection;
