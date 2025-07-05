"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BlogCardSkeleton = ({
  containerClassName,
}: {
  containerClassName?: string;
}) => {
  return (
    <div className={cn("flex flex-col", containerClassName)}>
      {/* Image placeholder */}
      <Skeleton className="mb-5 relative overflow-hidden rounded-[30px] pt-[68.5%] w-full" />

      {/* Tags and date row */}
      <div className="flex items-center justify-between gap-[30px] leading-[2] mb-[23px] relative before:content-[''] before:bg-accent before:order-1 before:h-[1px] before:grow">
        {/* Tag placeholder */}
        <Skeleton className="h-6 w-20 rounded-[20px]" />

        {/* Date placeholder */}
        <Skeleton className="h-4 w-24 order-2" />
      </div>

      {/* Title placeholder */}
      <Skeleton className="h-7 w-[70%] rounded-[20px] mb-[13px]" />
    </div>
  );
};

export default BlogCardSkeleton;
