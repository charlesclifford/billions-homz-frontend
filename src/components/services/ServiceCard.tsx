"use client";
import React from "react";
import { IServiceList } from "../pages/home/HeroSection";
import { motion } from "framer-motion";

// Animation variants for service cards
const cardVariants = {
  hidden: {
    y: 50,
    opacity: 0,
    scale: 0.95
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      duration: 0.7
    }
  }
};

const ServiceCard = ({
  item: { icon, content, title },
  index
}: {
  item: IServiceList;
  index: number;
}) => {
  return (
    <motion.div
      className="service-card bg-white dark:bg-card backdrop-blur-[30px] flex rounded-[20px] shadow-sm"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
    >
      <div>
        <div className="p-[40px] pb-[50px]">
          <motion.div 
            className="mb-[23px] mx-auto relative pb-[23px] icon-box-wrapper"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="icon-box-icon">{icon}</span>
          </motion.div>
          <div>
            <motion.h5 
              className="mb-5 text-[26px] leading-[1.23] font-bold"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span>{title}</span>
            </motion.h5>
            <motion.p 
              className="text-neutral-600 dark:text-neutral-400 text-lg"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {content}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;