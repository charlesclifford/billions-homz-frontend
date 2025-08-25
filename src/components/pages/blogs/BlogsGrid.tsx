"use client";
import React, { useState } from "react";
import BlogCard from "../home/BlogCard";
import usePosts from "@/hooks/usePosts";
import { PostFilterInput } from "@/interfaces/blog.interface";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getPaginationRange } from "@/components/shared/DataTable";
import BlogCardSkeleton from "./BlogCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";

const BlogsGrid = () => {
  const [filter, setFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 12,
    isPublished: true,
  });

  const { posts, isPending, totalPages } = usePosts(filter);

  const onPaginationChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="my-[60px] relative">
      {/* All Posts Section */}
      <motion.h2
        className="text-4xl font-bold mb-8"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Latest Posts
      </motion.h2>

      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            key="skeleton"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <BlogCardSkeleton containerClassName="mb-2.5" />
              </motion.div>
            ))}
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            key="empty"
          >
            <h3 className="text-lg font-medium">No posts found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="posts"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] mb-8"
              variants={containerVariants}
            >
              {posts.map((post) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  containerClassName="mb-2.5"
                />
              ))}
            </motion.div>

            {posts.length > 0 && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => onPaginationChange(filter?.page - 1)}
                        aria-disabled={filter.page === 1}
                        className={cn(
                          "cursor-pointer",
                          filter.page === 1 && "pointer-events-none opacity-50"
                        )}
                      />
                    </PaginationItem>

                    {getPaginationRange(filter.page, totalPages).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === filter.page}
                          onClick={() => onPaginationChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => onPaginationChange(filter.page + 1)}
                        aria-disabled={filter.page >= totalPages}
                        className={cn(
                          "cursor-pointer",
                          filter.page >= totalPages &&
                            "pointer-events-none opacity-50"
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogsGrid;
