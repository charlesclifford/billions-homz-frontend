"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SmallTitle from "../../shared/SmallTitle";
import BlogCard from "./BlogCard";
import { useState } from "react";
import { PostFilterInput } from "@/interfaces/blog.interface";
import usePosts from "@/hooks/usePosts";
import BlogCardSkeleton from "../blogs/BlogCardSkeleton";
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

const titleVariants = {
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

const buttonVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      duration: 0.5
    }
  }
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
      duration: 0.7
    }
  }
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
      <div className="w-full max-w-[min(100%,1290px)] mx-auto py-[150px] flex flex-col">
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={"/blogs"}
              className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group transition duration-300 dark:bg-white overflow-hidden"
            >
              <span className="flex gap-2.5 items-center flex-row-reverse justify-center">
                <motion.span 
                  className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white"
                  whileHover={{ 
                    rotate: 45,
                    transition: { duration: 0.3 }
                  }}
                >
                  <ArrowUpRight />
                </motion.span>
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
                    <BlogCard
                      post={post}
                      containerClassName="mb-2.5"
                    />
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