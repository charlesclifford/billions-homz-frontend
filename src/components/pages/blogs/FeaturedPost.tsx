"use client";
import { AnimatedLink } from "@/components/shared/AnimatedLink";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import usePosts from "@/hooks/usePosts";
import { PostFilterInput } from "@/interfaces/blog.interface";
import { formatDate } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hidden: { scale: 1.05, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const FeaturedPost = () => {
  const [featuredFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 3,
    isPublished: true,
    featured: true,
  });
  const { posts: featuredPosts, isPending: isFeaturedPending } =
    usePosts(featuredFilter);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const LoadingSkeleton = () => (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {[...Array(3)].map((_, index) => (
            <CarouselItem key={`skeleton-${index}`} className="pl-0">
              <div className="pb-[60px] container max-w-[min(100%,1290px)] mx-auto px-4">
                <div className="grid lg:grid-cols-2">
                  {/* Image skeleton */}
                  <div className="lg:mr-[69.12px] mb-6 lg:mb-0">
                    <Skeleton className="rounded-[30px] w-full aspect-[4/3]" />
                  </div>

                  {/* Content skeleton */}
                  <div className="flex flex-col w-full justify-center lg:pr-[80px] gap-4">
                    <div className="flex items-center justify-between gap-[30px] relative before:content-[''] before:bg-border before:order-1 before:h-[1px] before:grow">
                      <Skeleton className="h-8 w-24 rounded-[20px]" />
                      <Skeleton className="h-4 w-20 order-2" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-4/5" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                    <Skeleton className="h-4 w-32 mt-6" />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );

  if (isFeaturedPending) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="relative w-full">
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
          {featuredPosts.map((post) => (
            <CarouselItem key={post._id} className="pl-0">
              <motion.div 
                className="pb-[60px] container max-w-[min(100%,1290px)] mx-auto px-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
              >
                <div className="grid lg:grid-cols-2">
                  <motion.div 
                    className="lg:mr-[69.12px] mb-6 lg:mb-0"
                    variants={imageVariants}
                  >
                    <div className="rounded-[30px] pt-[66%] relative overflow-hidden group">
                      <Image
                        src={post.image?.imageUrl || ""}
                        alt={post.title}
                        fill
                        className="w-full h-full object-cover absolute top-0 left-0 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col w-full justify-center lg:pr-[80px]"
                    variants={containerVariants}
                  >
                    <motion.div 
                      className="flex items-center justify-between gap-[30px] leading-[2] mb-[23px] relative before:content-[''] before:bg-border before:order-1 before:h-[1px] before:grow"
                      variants={itemVariants}
                    >
                      {post.tags && post.tags?.length > 0 && (
                        <motion.div 
                          className="bg-primary text-white py-[9px] px-5 rounded-[20px] leading-[1] font-semibold text-sm"
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <span>{post.tags[0]}</span>
                        </motion.div>
                      )}
                      <motion.div 
                        className="text-sm font-semibold leading-[1] order-2 text-gray-500"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <span>
                          {post.createdAt
                            ? formatDate(
                                new Date(post?.publishedAt),
                                "MMM dd, yyyy"
                              )
                            : ""}
                        </span>
                      </motion.div>
                    </motion.div>

                    <motion.h3 
                      className="text-[36px] leading-[40px] tracking-[-1px] mb-[13px] font-bold"
                      variants={itemVariants}
                      transition={{ delay: 0.4 }}
                    >
                      <AnimatedLink href={`/post/${post.slug}`}>
                        {post.title}
                      </AnimatedLink>
                    </motion.h3>

                    <motion.span 
                      className="line-clamp-3 text-lg text-neutral-600 dark:text-neutral-400"
                      variants={itemVariants}
                      transition={{ delay: 0.5 }}
                    >
                      {post.excerpt}
                    </motion.span>

                    <motion.div 
                      className="mt-[25px] relative"
                      variants={itemVariants}
                      transition={{ delay: 0.6 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-bold text-[15px] leading-[1.57] relative transition-colors before:content-[''] before:absolute before:bottom-0 before:left-[-1px] before:block before:w-[calc(100%+2px)] before:h-[2px] before:bg-primary before:scale-x-0 before:origin-left before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.47,0.05,0.5,0.94)] hover:before:duration-300 hover:before:ease-[cubic-bezier(0.47,0.05,0.5,0.94)] hover:before:delay-200 hover:before:bg-foreground hover:before:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-[-1px] after:block after:w-[calc(100%+2px)] after:h-[2px] after:bg-primary after:scale-x-100 after:origin-right after:transition-transform after:duration-300 after:delay-200 after:ease-[cubic-bezier(0.47,0.05,0.5,0.94)] hover:after:scale-x-0 hover:after:bg-foreground hover:after:delay-0"
                      >
                        Continue Reading
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturedPost;