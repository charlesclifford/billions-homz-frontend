"use client";

import SmallTitle from "@/components/shared/SmallTitle";
import {
  GraduationCap,
  Users,
  Laptop,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const benefitsList = [
  {
    icon: GraduationCap,
    title: "Expert-Led Training",
    content:
      "Learn directly from seasoned real estate leaders and top-performing agents.",
  },
  {
    icon: Users,
    title: "Powerful Networking",
    content:
      "Connect with investors, agents, and professionals to expand your reach.",
  },
  {
    icon: Laptop,
    title: "Flexible Learning",
    content:
      "Choose between online and in-person sessions that fit your lifestyle.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    content:
      "Gain practical skills to close deals and accelerate your real estate career.",
  },
];

export default function AcademySection() {
  // Shared fade/slide variants
  const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    visible: (i = 0) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  return (
    <section className="bg-gradient-to-t from-gray-100 via-gray-100 to-gray-50 dark:from-background dark:via-background dark:to-background py-16 lg:py-28 text-center relative about-section">
      <div className="relative z-10 container max-w-[min(100%,1290px)] mx-auto px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SmallTitle text="Our Academy" className="mx-auto" />
        </motion.div>

        {/* Small Tagline */}
        <motion.div
          className="mt-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          <p className="text-lg md:text-xl font-medium mb-4">
            Want to Build Wealth through Real Estate?
          </p>
        </motion.div>

        <motion.div
          className="mt-[30px] mb-[60px] w-full flex justify-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
        >
          <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px] max-w-5xl">
            Unlock your future with Billions Homz Academy
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          className="max-w-3xl mx-auto text-lg mb-14 leading-[1.6]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
        >
          At Billions Homz Academy, we equip aspiring realtors and investors
          with the knowledge, tools, and connections to thrive in the booming
          real estate industry. Learn how to close deals, grow your network, and
          build lasting wealth.
        </motion.p>

        {/* Why Join Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefitsList.map(({ icon: Icon, title, content }, i) => (
            <motion.div
              key={i}
              className="bg-card rounded-[30px] rounded-tr-none p-8 flex flex-col items-start text-left transition-all relative group/card box-hover overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="absolute right-0 top-0 z-[3]">
                <div className="h-full">
                  <div className="rounded-[30px] text-sm font-bold capitalize inline-grid relative group">
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
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-[60px] h-[60px] ">
                <div className="rounded-bl-[30px] w-full h-full bg-gray-100 dark:bg-background"></div>
                <div className="border-shape w-[30px] h-[30px] absolute top-0 left-[-29.5px] rotate-180 bg-gray-100 dark:bg-background"></div>
                <div className="border-shape w-[30px] h-[30px] absolute right-[-0.5px] bottom-[-30px] rotate-180 bg-gray-100 dark:bg-background"></div>
              </div>

              <div className="relative mb-6 mt-[60px] p-3 w-[70px] h-[70px] bg-primary/20 rounded-full group-hover/card:bg-white/30 transition duration-300 flex items-center justify-center">
                <Icon
                  size={36}
                  className="text-primary group-hover/card:text-white transition duration-300"
                />
              </div>
              <h4 className="relative text-2xl font-semibold mb-2 group-hover/card:text-white transition duration-300">
                {title}
              </h4>
              <p className="relative text-gray-700 dark:text-gray-300 group-hover/card:text-white transition duration-300">
                {content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="flex items-center lg:items-end justify-center pb-2.5 pt-[30px]"
          variants={buttonVariants}
        >
          <Link
            href={"/academy"}
            className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group transition duration-300 dark:bg-white overflow-hidden"
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
              <span className="inline-block text-black">
                Join Billions Homz Academy
              </span>
            </span>
          </Link>
        </motion.div>

        {/* Sub-Note */}
        <motion.p
          className="mt-6 text-sm text-neutral-600 dark:text-neutral-500"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
        >
          Limited slots available — start your journey today!
        </motion.p>
      </div>
    </section>
  );
}
