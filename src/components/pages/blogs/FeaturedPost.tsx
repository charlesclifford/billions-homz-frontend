"use client";
import { AnimatedLink } from "@/components/shared/AnimatedLink";
import usePosts from "@/hooks/usePosts";
import { PostFilterInput } from "@/interfaces/blog.interface";
import { formatDate } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const FeaturedPost = () => {
  const [featuredFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 1,
    isPublished: true,
    featured: true,
  });
  const { posts: featuredPosts, isPending: isFeaturedPending } =
    usePosts(featuredFilter);

  return (
    <div className="flex">
      {featuredPosts.map((post) => (
        <div key={post._id} className="pb-[60px]">
          <div className="grid lg:grid-cols-2">
            <div className="lg:mr-[69.12px] mb-6 lg:mb-0">
              <div className="rounded-[30px] pt-[66%] relative overflow-hidden group">
                <Image
                  src={post.image?.imageUrl || ""}
                  alt={post.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover absolute top-0 left-0 group-hover:transform-[translate3d(0,0,0)_scale(1.2)] transform-[translate3d(-6.66%,0,0)_scale(1.2)] transition duration-300 ease-in-out"
                />
              </div>
            </div>
            <div className="flex flex-col w-full justify-center lg:pr-[80px]">
              <div className="flex items-center justify-between gap-[30px] leading-[2] mb-[23px] relative before:content-[''] before:bg-border before:order-1 before:h-[1px] before:grow">
                {post.tags && post.tags?.length > 0 && (
                  <div className="bg-primary text-white py-[9px] px-5 rounded-[20px] leading-[1] font-semibold text-sm">
                    <span>{post.tags[0]}</span>
                  </div>
                )}
                <div className="text-sm font-semibold leading-[1] order-2 text-gray-500">
                  <span>
                    {post.createdAt
                      ? formatDate(new Date(post?.publishedAt), "MMM dd, yyyy")
                      : ""}
                  </span>
                </div>
              </div>
              <h3 className="text-[36px] leading-[40px] tracking-[-1px] mb-[13px] font-bold">
                <AnimatedLink href={`/post/${post.slug}`}>
                  {post.title}
                </AnimatedLink>
              </h3>
              <span className="line-clamp-3 text-lg text-neutral-600 dark:text-neutral-400">{post.excerpt}</span>

              <div className="mt-[25px] relative">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-sm leading-[1.57] relative"
                >
                  Continue Reading
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedPost;
