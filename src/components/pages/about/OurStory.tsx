"use client";
import React from "react";
import { motion } from "framer-motion";
import SmallTitle from "@/components/shared/SmallTitle";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      title: "Verified Properties",
      description: "Genuine and verified properties with clear documentation",
      className: "col-span-1 lg:col-span-2",
    },
    {
      title: "Flexible Payments",
      description: "Choose between outright payment or convenient installments",
      className: "col-span-1 lg:col-span-2",
    },
    {
      title: "Strategic Locations",
      description:
        "Prime locations with high returns and appreciation potential",
      className: "col-span-1 lg:col-span-2",
    },
    {
      title: "Transparent Process",
      description: "Clear documentation and straightforward buying process",
      className: "col-span-1 lg:col-span-3",
    },
    {
      title: "Dedicated Support",
      description: "Personalized customer support from start to finish",
      className: "col-span-1 lg:col-span-3",
    },
  ];

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
        <div className="mt-10">
          <h3 className="leading-[1] text-[36px] tracking-[-1px] font-bold text-center my-8 mb-14">
            Why Choose Billionshomz Properties?
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-[30px] mb-[30px] z-[2]">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "bg-card rounded-[30px] rounded-tr-none min-h-[250px] p-[40px] flex flex-col relative box-hover overflow-hidden group/card justify-end",
                  feature.className
                )}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
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

                <motion.div
                  className="relative mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div>
                    <h5 className="text-foreground leading-[1] text-[26px] tracking-[0] font-bold group-hover/card:text-white transition duration-300">
                      {feature.title}
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
                  <p className="text-lg leading-[1.55] group-hover/card:text-white dark:group-hover/card:text-white transition duration-300 ">
                    {feature.description}
                  </p>
                </motion.div>

                <div className="absolute top-0 right-0 w-[60px] h-[60px] ">
                  <div className="rounded-bl-[30px] w-full h-full bg-[#F6F3EC] dark:bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute top-0 left-[-29.5px] rotate-180 bg-[#F6F3EC] dark:bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute right-[-0.5px] bottom-[-30px] rotate-180 bg-[#F6F3EC] dark:bg-background"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
