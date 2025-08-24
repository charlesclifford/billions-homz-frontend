"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type BackgroundImage = StaticImageData | string;

const PageHeader = ({
  title,
  bgImage,
  containerClassName = "",
  imageClassName = "",
}: {
  title: string;
  bgImage: BackgroundImage;
  containerClassName?: string;
  imageClassName?: string;
}) => {
  const isMobile = useIsMobile();
  const [isStaticImage, setIsStaticImage] = useState(false);

  // Check if bgImage is StaticImageData or string URL
  useEffect(() => {
    // StaticImageData has a 'src' property, strings don't
    setIsStaticImage(typeof bgImage === "object" && "src" in bgImage);
  }, [bgImage]);

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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className={cn(
        `w-full h-full relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full`,
        containerClassName
      )}
    >
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          src={bgImage}
          alt="Background landscape"
          fill
          priority
          quality={isMobile ? 70 : 85}
          sizes="100vw"
          className={cn("object-cover", imageClassName)}
          placeholder={isStaticImage ? "blur" : "empty"}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/0"></div>
      </div>

      <motion.div
        className="relative container mx-auto pt-[160px] lg:pt-[175px] pb-10 px-[30px] flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={titleVariants}>
          <div className="mb-12 md:mb-16 lg:mb-[150px]">
            <h2 className="font-bold text-[48px] md:text-[52px] lg:text-[90px] leading-[1.06em] tracking-[-2px] text-white capitalize text-shadow">
              {title}
            </h2>
          </div>
        </motion.div>
        <div></div>
      </motion.div>

      <div className="h-[25px] lg:h-[50px] w-full absolute bottom-0 left-0">
        <div className="bg-background rounded-t-[50px] h-full w-full"></div>
      </div>
    </div>
  );
};

export default PageHeader;
