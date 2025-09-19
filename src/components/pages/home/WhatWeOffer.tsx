"use client";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Building2,
  Layers3Icon,
  LucideIcon,
  MessageCircleIcon,
  WalletCards,
  WrenchIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SmallTitle from "../../shared/SmallTitle";
import { motion } from "framer-motion";

export interface IServiceList {
  icon: LucideIcon;
  title: string;
  content: string;
  className?: string;
}

const serviceList: IServiceList[] = [
  {
    icon: Building2,
    title: "Real Estate Development",
    content:
      "We engage as early as possible, typically during the conceptual or schematic stage.",
    className: "col-span-1 lg:col-span-2",
  },
  {
    icon: Layers3Icon,
    title: "Project Development",
    content:
      "Our comprehensive estimates also reflect available lower-price options.",
    className: "col-span-1 lg:col-span-2",
  },
  {
    icon: WalletCards,
    title: "Investment & Capital",
    content: "We are focused on improving the way capital projects get done",
    className: "col-span-1 lg:col-span-2",
  },
  {
    icon: WrenchIcon,
    title: "Construction Management",
    content:
      "From design to operations, we love to solve complex challenges and exceed expectations",
    className: "col-span-1 lg:col-span-3",
  },
  {
    icon: MessageCircleIcon,
    title: "Sales & Marketing",
    content:
      "Building a real estate development is a complicated task requiring both deep understanding..",
    className: "col-span-1 lg:col-span-3",
  },
];

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

const cardVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      duration: 0.8,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      duration: 0.7,
    },
  },
};

const WhatWeOffer = () => {
  return (
    <div className="about-section w-full bg-[#F6F3EC] dark:bg-background">
      <div className="w-full container max-w-[min(100%,1290px)] mx-auto px-4 py-16 lg:py-28 flex flex-col ">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <SmallTitle text="what we offer" className="mx-auto" />
        </motion.div>

        <motion.div
          className="max-w-full w-[760px] mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <div className="mt-[30px] mb-[60px]">
            <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
              Take a brief look at some of the services we offer
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-6 gap-[30px] mb-[30px] z-[2]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {serviceList.map(({ content, icon, title, className }, i) => {
            const Icon = icon;
            return (
              <motion.div
                key={i}
                className={cn(
                  "bg-card rounded-[30px] rounded-tr-none min-h-[370px] p-[40px] flex flex-col relative box-hover overflow-hidden group/card justify-end",
                  className
                )}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="absolute right-0 top-0 z-[3]">
                  <div className="h-full">
                    <Link
                      href={"#"}
                      className="rounded-[30px] text-sm font-bold capitalize inline-grid relative group"
                    >
                      <span className="flex items-center flex-row-reverse justify-center">
                        <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-card text-foreground group-hover/card:text-white group-hover/card:bg-primary transition-all duration-300">
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
                        <span className=""></span>
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="mt-[60px] mb-[30px] relative">
                  <div className="">
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Icon
                        size={64}
                        strokeWidth={0.75}
                        className="group-hover/card:text-white transition duration-300"
                      />
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="relative mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div>
                    <h5 className="text-foreground leading-[1] text-[26px] tracking-[0] font-bold group-hover/card:text-white transition duration-300">
                      {title}
                    </h5>
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <p className="text-lg leading-[1.55] text-ellipsis line-clamp-3 group-hover/card:text-white dark:group-hover/card:text-white transition duration-300 ">
                    {content}
                  </p>
                </motion.div>

                <div className="absolute top-0 right-0 w-[60px] h-[60px] ">
                  <div className="rounded-bl-[30px] w-full h-full bg-[#F6F3EC] dark:bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute top-0 left-[-29.5px] rotate-180 bg-[#F6F3EC] dark:bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute right-[-0.5px] bottom-[-30px] rotate-180 bg-[#F6F3EC] dark:bg-background"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default WhatWeOffer;
