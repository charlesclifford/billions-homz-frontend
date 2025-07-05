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

const BlogsGrid = () => {
  const [filter, setFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 9,
    isPublished: true,
  });
  const [featuredFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 3,
    isPublished: true,
    featured: true,
  });

  const { posts, isPending, totalPages } = usePosts(filter);
  const { posts: featuredPosts, isPending: isFeaturedPending } =
    usePosts(featuredFilter);

  const onPaginationChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  return (
    <div className="mt-[60px] relative">
      {/* Featured Posts Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>

        {isFeaturedPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <BlogCardSkeleton key={`featured-skeleton-${index}`} />
            ))}
          </div>
        ) : featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard
                key={`featured-${post._id}`}
                post={post}
                containerClassName="mb-2.5"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No featured posts available</p>
          </div>
        )}
      </div>

      {/* All Posts Section */}
      <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <BlogCardSkeleton key={index} containerClassName="mb-2.5" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                containerClassName="mb-2.5"
              />
            ))}
          </div>

          {posts.length > 0 && totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
};

export default BlogsGrid;
