"use client";
import { IPost } from "@/interfaces/blog.interface";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AnimatedLink } from "../../shared/AnimatedLink";

const BlogCard = ({
  post,
  containerClassName,
}: {
  post: IPost;
  containerClassName?: string;
}) => {
  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  };

  const tagVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={cn("flex flex-col", containerClassName)}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/post/${post.slug}`}>
        <div className="mb-5 relative overflow-hidden rounded-[30px] group pt-[68.5%]">
          <Image
            src={post.image?.imageUrl || ""}
            alt={post.title || "Blog post image"}
            width={300}
            height={300}
            className="w-full h-full object-cover absolute top-0 left-0 group-hover:transform-[translate3d(0,0,0)_scale(1.2)] transform-[translate3d(-6.66%,0,0)_scale(1.2)] transition duration-300 ease-in-out"
          />
        </div>
      </Link>

      <motion.div
        variants={contentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between gap-[30px] leading-[2] mb-[23px] relative before:content-[''] before:bg-border before:order-1 before:h-[1px] before:grow">
          {post.tags && post.tags?.length > 0 && (
            <motion.div
              className="bg-primary text-white py-[6px] px-4 rounded-[20px] leading-[1] font-semibold text-xs"
              variants={tagVariants}
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
                ? formatDate(new Date(post?.publishedAt), "MMM dd, yyyy")
                : ""}
            </span>
          </motion.div>
        </div>

        <motion.h3
          className="text-[26px] leading-[1.23] tracking-[0] mb-[13px] font-bold"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <AnimatedLink href={`/post/${post.slug}`}>{post.title}</AnimatedLink>
        </motion.h3>

        <motion.span
          className="line-clamp-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {post.excerpt}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default BlogCard;
