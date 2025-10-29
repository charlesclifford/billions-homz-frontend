"use client";
import { ReactNode } from "react";
import ServiceCard from "../../services/ServiceCard";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroBg from "../../../../public/images/bg/land-plot-with-nature-landscape-location-pin.jpg";
import { motion } from "framer-motion";

export interface IServiceList {
  icon: ReactNode;
  title: string;
  content: string;
}

const serviceList: IServiceList[] = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M4.265 7.999c0-2.057 1.674-3.734 3.734-3.734s3.734 1.674 3.734 3.734c0 2.057-1.674 3.734-3.734 3.734s-3.734-1.674-3.734-3.734zM0 7.999c0 4.418 3.581 7.999 7.999 7.999s7.999-3.581 7.999-7.999c0-4.418-3.581-7.999-7.999-7.999s-7.999 3.581-7.999 7.999z"></path>
        <path d="M0 24.001c0-4.418 3.581-7.999 7.999-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999s-7.999-3.583-7.999-7.999z"></path>
        <path d="M15.999 7.999c0-4.418 3.583-7.999 8.002-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999s-8.002-3.581-8.002-7.999z"></path>
        <path d="M20.266 24.001c0-2.057 1.674-3.734 3.734-3.734s3.734 1.674 3.734 3.734c0 2.060-1.674 3.734-3.734 3.734s-3.734-1.677-3.734-3.734zM15.999 24.001c0 4.418 3.581 7.999 7.999 7.999s7.999-3.581 7.999-7.999c0-4.418-3.581-7.999-7.999-7.999s-7.999 3.581-7.999 7.999z"></path>
      </svg>
    ),
    title: "Lands at strategic location",
    content:
      "Our lands are located at prime areas , your investment is 100% safe and return on investment sure.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M24.001 5.333c-1.471 0-2.666 1.195-2.666 2.666s1.195 2.667 2.666 2.667 2.666-1.195 2.666-2.667h5.333c0 4.418-3.581 7.999-7.999 7.999s-7.999-3.581-7.999-7.999c-0.002-4.418 3.581-7.999 7.999-7.999v5.333z"></path>
        <path d="M5.333 7.999c0 1.471 1.195 2.667 2.666 2.667s2.667-1.195 2.667-2.667c0-1.471-1.195-2.666-2.667-2.666v-5.333c4.418 0 7.999 3.581 7.999 7.999s-3.581 7.999-7.999 7.999c-4.418 0-7.999-3.581-7.999-7.999h5.333z"></path>
        <path d="M26.667 24.001c0-1.471-1.195-2.667-2.666-2.667s-2.667 1.195-2.667 2.667c0 1.471 1.195 2.666 2.667 2.666v5.333c-4.418 0-7.999-3.581-7.999-7.999s3.581-7.999 7.999-7.999c4.418 0 7.999 3.581 7.999 7.999h-5.333z"></path>
        <path d="M7.999 26.667c1.471 0 2.667-1.195 2.667-2.666s-1.195-2.667-2.667-2.667c-1.471 0-2.666 1.195-2.666 2.667h-5.333c0-4.418 3.581-7.999 7.999-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999v-5.333z"></path>
      </svg>
    ),
    title: "Professional services",
    content:
      "We are here for you right from when you buy from us till you move into your dream home. We are are just one call or text message away.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M15.999 24.532c4.117 0 7.466 3.348 7.466 7.466h8.533c0-8.837-7.162-15.999-15.999-15.999s-15.999 7.165-15.999 16.001h8.533c0-4.117 3.348-7.468 7.466-7.468z"></path>
        <path d="M15.999 7.466c-4.117 0-7.466-3.348-7.466-7.466h-8.533c0 8.837 7.162 15.999 15.999 15.999s16.001-7.162 16.001-15.999h-8.533c0 4.117-3.351 7.466-7.468 7.466z"></path>
      </svg>
    ),
    title: "Partnership",
    content:
      "At billionshomz ,we believe true success comes from collaboration .we work hand in hand with investors,developers to create landmarks that define luxury and provide satisfaction.",
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

const titleVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const subtitleVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.4,
    },
  },
};

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed background container */}
      <div className="fixed inset-0 -z-10 h-screen w-full">
        <Image
          src={HeroBg}
          alt="Background landscape"
          fill
          priority
          quality={isMobile ? 70 : 85}
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "top",
          }}
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content container with relative positioning */}
      <div className="relative z-10 min-h-screen pb-1">
        <div className="absolute bottom-0 left-0 w-full h-[50px]">
          <div className="bg-background rounded-t-[50px] h-full w-full"></div>
        </div>

        {/* Content */}
        <div className="container max-w-[min(100%,1290px)] mx-auto px-4 pt-[200px] lg:pt-[245px]">
          <motion.div
            className="max-w-full w-[910px] mx-auto text-center self-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-5" variants={titleVariants}>
              <h1 className="text-white font-bold text-[52px] lg:text-[90px] leading-[1]">
                Paragon of Luxury and Satisfaction
              </h1>
            </motion.div>
          </motion.div>

          <motion.div
            className="max-w-full w-[770px] mx-auto text-center self-center"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-[50px] lg:mb-[125px]">
              <h1 className="text-neutral-300 font-semibold text-[22px] leading-[1.5]">
                Making Landlords Daily, One Landlord at a Time.
              </h1>
            </div>
          </motion.div>

          <div className="py-[60px]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
            {serviceList.map((item, i) => (
              <ServiceCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
