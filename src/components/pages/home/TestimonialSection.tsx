"use client";
import Autoplay from "embla-carousel-autoplay";
import SmallTitle from "../../shared/SmallTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import TestimonialCard from "./TestimonialCard";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useFeaturedTestimonials } from "@/hooks/useTestimonials";
import { ITestimonial } from "@/interfaces/testimonial.interface";
import VideoModal from "./VideoModal";
import TestimonialCardSkeleton from "./TestimonialCardSkeleton";

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

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      duration: 0.8,
    },
  },
};

const TestimonialSection = () => {
  const { data, isLoading } = useFeaturedTestimonials(6);
  const testimonials = (data?.data as ITestimonial[]) || [];
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<ITestimonial | null>(null);

  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const openVideoModal = (testimonial: ITestimonial) => {
    if (testimonial.media.type === "video") {
      setSelectedTestimonial(testimonial);
    }
  };

  const closeVideoModal = () => {
    setSelectedTestimonial(null);
  };

  if (!isLoading && (!testimonials || testimonials.length === 0)) {
    return null;
  }

  return (
    <>
      <div className="about-section w-full bg-[#1b1f12]">
        <div className="w-full container max-w-[min(100%,1290px)] mx-auto px-4 py-16 lg:py-28 flex flex-col">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[40%_auto]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={titleVariants}>
              <SmallTitle
                text="Testimonials"
                className="text-white"
                borderClass="border-white"
              />

              <div className="mt-[30px] text-white">
                <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
                  Happy users feedback
                </h2>
              </div>
            </motion.div>
            <div></div>
          </motion.div>

          <motion.div
            className="mt-[70px] relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
                slidesToScroll: 1,
              }}
              className="w-full"
              plugins={[plugin.current]}
            >
              <CarouselContent className="-ml-0">
                {isLoading
                  ? // Skeleton loading state
                    Array.from({ length: 3 }).map((_, index) => (
                      <CarouselItem
                        key={`skeleton-${index}`}
                        className="px-2 md:basis-1/2 lg:basis-1/3"
                      >
                        <TestimonialCardSkeleton />
                      </CarouselItem>
                    ))
                  : testimonials.map((item, index) => (
                      <CarouselItem
                        key={item._id}
                        className="px-2 md:basis-1/2 lg:basis-1/3"
                      >
                        <motion.div
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: "-50px" }}
                          variants={itemVariants}
                          custom={index}
                        >
                          <TestimonialCard
                            item={item}
                            onVideoClick={openVideoModal}
                          />
                        </motion.div>
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <div>
                <CarouselNext className="hidden lg:flex w-[50px] h-[50px] right-0 -top-9 bg-transparent text-white cursor-pointer hover:bg-white/10 transition-colors duration-300 rounded-full" />
                <CarouselPrevious className="hidden lg:flex w-[50px] h-[50px] -top-9 left-[calc(100%-110px)] bg-transparent text-white cursor-pointer hover:bg-white/10 transition-colors duration-300 rounded-full" />
              </div>
            </Carousel>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        testimonial={selectedTestimonial}
        isOpen={!!selectedTestimonial}
        onClose={closeVideoModal}
      />
    </>
  );
};

export default TestimonialSection;
