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
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedPost = () => {
  const [featuredFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 3,
    isPublished: true,
    featured: true,
  });
  const { posts: featuredPosts, isPending: isFeaturedPending } =
    usePosts(featuredFilter);

  const LoadingSkeleton = () => (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "start",
          loop: false, // Disable loop for skeleton
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
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent className="-ml-0">
          {featuredPosts.map((post) => (
            <CarouselItem key={post._id} className="pl-0">
              <div className="pb-[60px] container max-w-[min(100%,1290px)] mx-auto px-4">
                {/* Maintain your original grid layout */}
                <div className="grid lg:grid-cols-2">
                  <div className="lg:mr-[69.12px] mb-6 lg:mb-0">
                    <div className="rounded-[30px] pt-[66%] relative overflow-hidden group">
                      <Image
                        src={post.image?.imageUrl || ""}
                        alt={post.title}
                        fill
                        className="w-full h-full object-cover absolute top-0 left-0 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 50vw"
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
                            ? formatDate(
                                new Date(post?.publishedAt),
                                "MMM dd, yyyy"
                              )
                            : ""}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-[36px] leading-[40px] tracking-[-1px] mb-[13px] font-bold">
                      <AnimatedLink href={`/post/${post.slug}`}>
                        {post.title}
                      </AnimatedLink>
                    </h3>
                    <span className="line-clamp-3 text-lg text-neutral-600 dark:text-neutral-400">
                      {post.excerpt}
                    </span>

                    <div className="mt-[25px] relative">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-bold text-sm leading-[1.57] relative hover:text-primary transition-colors"
                      >
                        Continue Reading
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturedPost;
