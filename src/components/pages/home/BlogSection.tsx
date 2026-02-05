"use client";
import usePosts from "@/hooks/usePosts";
import { PostFilterInput } from "@/interfaces/blog.interface";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SmallTitle from "../../shared/SmallTitle";
import BlogCardSkeleton from "../blogs/BlogCardSkeleton";
import BlogCard from "./BlogCard";

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

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      duration: 0.7,
    },
  },
};

const BlogSection = () => {
  const [featuredFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 3,
    isPublished: true,
    featured: true,
  });

  const { posts: featuredPosts, isPending: isFeaturedPending } =
    usePosts(featuredFilter);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <div className="about-section w-full container mx-auto px-4">
      <div className="w-full max-w-[min(100%,1290px)] mx-auto py-16 lg:py-28 flex flex-col">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={titleVariants}>
            <SmallTitle
              text="Articles & insights"
              className="mx-auto lg:mx-0"
            />

            <div className="mt-[30px] text-center lg:text-left">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
                Discover inspiration and trends
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center lg:items-end justify-center lg:justify-end pb-2.5 pt-[30px]"
            variants={buttonVariants}
          >
            <Link
              href={"/blogs"}
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
                <span className="inline-block text-black">view All Posts</span>
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-[60px] relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
        >
          {isFeaturedPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={`featured-skeleton-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCardSkeleton />
                </motion.div>
              ))}
            </div>
          ) : (
            featuredPosts.length > 0 && (
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    variants={cardVariants}
                    custom={index}
                  >
                    <BlogCard post={post} containerClassName="mb-2.5" />
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogSection;
