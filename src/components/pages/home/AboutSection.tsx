"use client";
import { DiamondIcon, RocketIcon } from "lucide-react";
import React from "react";
import SmallTitle from "../../shared/SmallTitle";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const slideInLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const slideInRight = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const numberCount = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const AboutSection = () => {
  return (
    <div className="about-section w-full container mx-auto px-4 pt-[150px] lg:pb-[150px]">
      <motion.div 
        className="w-full max-w-[min(100%,1290px)] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-[30px] mb-[80px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div className="col-span-1" variants={itemVariants}>
          <SmallTitle text="Who we are" />
        </motion.div>
        
        <motion.div className="col-span-2 flex flex-col" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <div className="mb-5 lg:mb-10">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
                The largest privately held real estate investors and managers in
                the world
              </h2>
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-y-[30px] gap-x-[70px] pr-10"
            variants={containerVariants}
          >
            <motion.div className="flex flex-col" variants={slideInLeft}>
              <div className="mb-[15px] inline-flex items-center">
                <motion.span 
                  className="pr-[5px]"
                  whileHover={{ rotate: 180, transition: { duration: 0.5 } }}
                >
                  <DiamondIcon />
                </motion.span>
                <span className="text-[26px] font-bold text-primary pl-[5px]">
                  Our vision
                </span>
              </div>

              <div className="text-neutral-600 dark:text-neutral-400">
                <p className="text-lg">
                  To empower businesses with cutting-edge web solutions that
                  enhance their digital presence and drive growth.
                </p>
              </div>
            </motion.div>

            <motion.div className="flex flex-col" variants={slideInRight}>
              <div className="mb-[15px] inline-flex items-center">
                <motion.span 
                  className="pr-[5px]"
                  whileHover={{ rotate: 180, transition: { duration: 0.5 } }}
                >
                  <RocketIcon />
                </motion.span>
                <span className="text-[26px] font-bold text-primary pl-[5px]">
                  Our mission
                </span>
              </div>

              <div className="text-neutral-600 dark:text-neutral-400">
                <p className="text-lg">
                  Our solutions are designed to meet the needs of modern
                  enterprises, ensuring they thrive in today&apos;s competitive
                  online landscape.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="w-full max-w-[min(100%,1290px)] mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px]">
          <motion.div 
            className="bg-[url(/images/bg/h1_img-1.jpg)] bg-cover bg-center bg-no-repeat rounded-[30px] min-h-[350px]"
            variants={scaleUp}
          >
            <div className="max-w-full relative w-[150px] lg:w-[220px]">
              <div className="bg-background rounded-br-[30px] w-full h-full">
                <div className="w-full h-full">
                  <div className="h-[60px]"></div>
                </div>
              </div>
              {/* top-right */}
              <div className="bg-background w-[30px] h-[30px] absolute top-0 right-[-30px] rotate-90 border-shape"></div>
              {/* bottom-left */}
              <div className="bg-background w-[30px] h-[30px] absolute bottom-[-30px] left-0 rotate-90 border-shape"></div>
            </div>
          </motion.div>
          
          {/* grids */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] grid-flow-row"
            variants={containerVariants}
          >
            <motion.div 
              className="bg-gray-100 dark:bg-card min-h-[200px] lg:min-h-[350px] py-[30px] lg:py-[40px] px-[15px] lg:px-[30px] pb-[30px] flex justify-between flex-col rounded-[25px] gap-5"
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.3 } 
              }}
            >
              <div className="">
                <div className="pb-[15px] border-b border-b-gray-200 dark:border-b-border">
                  <h6 className="text-[12px] font-semibold uppercase leading-[1.167em] text-primary">
                    global reach
                  </h6>
                </div>
              </div>
              <div className="">
                <div className="flex justify-center flex-col-reverse items-stretch">
                  <div className="flex items-center text-lg leading-[1.5em] text-neutral-500">
                    offices worldwide
                  </div>
                  <motion.div 
                    className="text-[60px] flex text-center font-bold leading-[1.06em] tracking-[-2px]"
                    variants={numberCount}
                  >
                    {/* number prefix */}
                    <span className="text-end"></span>
                    <span className="">85</span>
                    {/* number suffix */}
                    <span className="text-start text-primary">
                      <sup>+</sup>
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gray-100 dark:bg-card min-h-[200px] lg:min-h-[350px] py-[30px] lg:py-[40px] px-[15px] lg:px-[30px] pb-[30px] flex justify-between flex-col rounded-[25px] gap-5"
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.3 } 
              }}
            >
              <div className="">
                <div className="pb-[15px] border-b border-b-gray-200 dark:border-b-border">
                  <h6 className="text-[12px] font-semibold uppercase leading-[1.167em] text-primary">
                    local expertise
                  </h6>
                </div>
              </div>
              <div className="">
                <div className="flex justify-center flex-col-reverse items-stretch">
                  <div className="flex items-center text-lg leading-[1.5em] text-neutral-500">
                    employees
                  </div>
                  <motion.div 
                    className="text-[60px] flex text-center font-bold leading-[1.06em] tracking-[-2px]"
                    variants={numberCount}
                  >
                    {/* number prefix */}
                    <span className="text-end"></span>
                    <span className="">1500</span>
                    {/* number suffix */}
                    <span className="text-start text-primary">
                      <sup>+</sup>
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gray-100 dark:bg-card min-h-[200px] lg:min-h-[350px] py-[30px] lg:py-[40px] px-[15px] lg:px-[30px] pb-[30px] flex justify-between flex-col rounded-[25px] gap-5"
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.3 } 
              }}
            >
              <div className="">
                <div className="pb-[15px] border-b border-b-gray-200 dark:border-b-border">
                  <h6 className="text-[12px] font-semibold uppercase leading-[1.167em] text-primary">
                    our impact
                  </h6>
                </div>
              </div>
              <div className="">
                <div className="flex justify-center flex-col-reverse items-stretch">
                  <div className="flex items-center text-lg leading-[1.5em] text-neutral-500">
                    projects done
                  </div>
                  <motion.div 
                    className="text-[60px] flex text-center font-bold leading-[1.06em] tracking-[-2px]"
                    variants={numberCount}
                  >
                    {/* number prefix */}
                    <span className="text-end"></span>
                    <span className="">248</span>
                    {/* number suffix */}
                    <span className="text-start text-primary">
                      <sup>+</sup>
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* hide on mobile */}
            <motion.div 
              className="bg-[url(/images/bg/h1_img-2.jpg)] bg-no-repeat bg-center bg-cover min-h-[200px] lg:min-h-[350px] rounded-[25px] hidden md:block"
              variants={scaleUp}
            ></motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutSection;