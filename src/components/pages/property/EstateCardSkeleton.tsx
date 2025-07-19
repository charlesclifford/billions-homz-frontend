import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const EstateCardSkeleton = () => {
  return (
    <div className="rounded-[30px] relative overflow-hidden">
      {/* Skeleton for thumbnail */}
      <div className="pt-[122%] relative rounded-[30px] overflow-hidden">
        <Skeleton className="absolute top-0 left-0 w-full h-full rounded-[30px]" />
        {/* Gradient overlay skeleton */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent z-[1] rounded-b-[30px]" />
      </div>

      {/* Skeleton for content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end p-10 z-[3]">
        {/* Status skeleton */}
        <div className="mb-auto">
          <Skeleton className="h-6 w-20 rounded-[20px]" />
        </div>

        {/* Location skeleton */}
        <div className="border-b border-neutral-500 pb-5 mt-[30px] mb-[15px] flex items-center">
          <Skeleton className="h-4 w-4 rounded-full mr-1" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default EstateCardSkeleton;
