import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserDetailSkeleton = () => {
  return (
    <ScrollArea className="overflow-x-hidden overflow-y-auto">
      <div className="space-y-6 py-4 px-4">
        {/* Profile Section Skeleton */}
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="size-32 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Basic Information Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Account Status Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* System Information Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>

        {/* Address Information Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default UserDetailSkeleton;
