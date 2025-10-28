"use client";
import SmallTitle from "@/components/shared/SmallTitle";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface IExploreList {
  id: string;
  title: string;
  content: string;
  containerClassName?: string;
  linkClassName?: string;
  link: {
    href: string;
    text: string;
  };
}

const exploreList: IExploreList[] = [
  {
    id: "01",
    title: "Our Mission",
    content:
      "Our mission is simple yet profound: to provide affordable yet luxurious housing solutions to our clients.",
    link: {
      href: "#",
      text: "Our Solutions",
    },
    containerClassName: "bg-neutral-800 dark:bg-card text-white",
    linkClassName: "before:!bg-white after:!bg-white",
  },
  {
    id: "02",
    title: "Our Vision",
    content:
      "To become Africa’s most trusted and people-driven real estate brand, known for innovation, integrity, and impact.",
    link: {
      href: "#",
      text: "See Projects",
    },
    containerClassName: "bg-primary text-white",
    linkClassName: "text-white before:!bg-white after:!bg-white",
  },
  {
    id: "03",
    title: "Our Core Values",
    content: `Integrity: We do what’s right, even when no one is watching.\nTransparency: Every deal is clear, honest, and straightforward.\nInnovation: We embrace modern ideas and smarter ways to build.\nExcellence: We deliver more than we promise.\nCustomer Focus: You’re at the heart of everything we do.`,
    link: {
      href: "#",
      text: "Discover More",
    },
    containerClassName: "bg-neutral-800 dark:bg-card text-white",
    linkClassName: "before:!bg-white after:!bg-white",
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
      duration: 0.7,
    },
  },
};

const contentVariants = {
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

const ExploreCompany = () => {
  return (
    <div className="footer about-section w-full">
      <div className="w-full container max-w-[min(100%,1290px)] mx-auto px-4 py-[150px] flex flex-col">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[40%_auto]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={titleVariants}>
            <SmallTitle text="Explore company" />

            <div className="mt-[30px] mb-[45px]">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
                Learn more about us
              </h2>
            </div>
          </motion.div>
          <div></div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {exploreList.map((item, i) => {
            const { id, content, title, containerClassName } = item;
            return (
              <motion.div
                key={i}
                className={cn(
                  "rounded-[30px] rounded-br-none min-h-[500px] px-8 md:px-[40px] py-[40px] lg:p-[40px] pb-[60px] flex flex-col gap-[25px] justify-between relative",
                  "br-primary group/card",
                  containerClassName
                )}
                variants={cardVariants}
                whileHover={{
                  // y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="absolute right-0 bottom-0 z-[3]">
                  <div className="h-full">
                    <div className="rounded-[30px] text-sm font-bold capitalize inline-grid relative group">
                      <span className="flex items-center flex-row-reverse justify-center">
                        <span
                          className={cn(
                            "w-[50px] h-[50px] rounded-full flex items-center justify-center group-hover/card:text-white group-hover/card:bg-primary transition-all duration-300",
                            "bg-primary"
                          )}
                        >
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

                <motion.div className="" variants={contentVariants}>
                  <div className={cn("pb-[15px] border-b border-b-white")}>
                    <h6 className="text-[12px] font-semibold leading-[1] tracking-[0]">
                      {id}.
                    </h6>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col"
                  variants={contentVariants}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <div className="mb-2.5">
                      <h5 className="leading-[1] text-[36px] tracking-[-1px] font-bold">
                        {title}
                      </h5>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="mb-5">
                      <p className="whitespace-pre-line">{content}</p>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* <div className="">
                      <Link
                        href={link.href}
                        className={cn(
                          "relative text-sm font-bold leading-[1.7] capitalize contact-link hover:underline hover:underline-offset-4 transition-all duration-300",
                          linkClassName
                        )}
                      >
                        {link.text}
                      </Link>
                    </div> */}
                  </motion.div>
                </motion.div>

                <div className="absolute bottom-0 right-0 w-[60px] h-[60px]">
                  <div className="rounded-tl-[30px] w-full h-full bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute top-[-29.5px] right-[-0.5] -rotate-90 bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute left-[-29.5px] bottom-[-0.5] -rotate-90 bg-background"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default ExploreCompany;
