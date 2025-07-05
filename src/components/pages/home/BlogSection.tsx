"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SmallTitle from "../../shared/SmallTitle";
import BlogCard from "./BlogCard";
import { useState } from "react";
import { PostFilterInput } from "@/interfaces/blog.interface";
import usePosts from "@/hooks/usePosts";
import BlogCardSkeleton from "../blogs/BlogCardSkeleton";

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
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div>
            <SmallTitle
              text="Articles & insights"
              className="mx-auto lg:mx-0"
            />

            <div className="mt-[30px] text-center lg:text-left">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
                Discover inspiration and trends
              </h2>
            </div>
          </div>
          <div className="flex items-center lg:items-end justify-center lg:justify-end pb-2.5 pt-[30px]">
            <Link
              href={"/blogs"}
              className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group transition duration-300 dark:bg-white"
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
          </div>
        </div>

        <div className="mt-[60px] relative">
          {isFeaturedPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <BlogCardSkeleton key={`featured-skeleton-${index}`} />
              ))}
            </div>
          ) : (
            featuredPosts.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
                {featuredPosts.map((post) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                    containerClassName="mb-2.5"
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
