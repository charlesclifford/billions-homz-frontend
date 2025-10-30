import { Skeleton } from "@/components/ui/skeleton";

const TestimonialCardSkeleton = () => {
  return (
    <div className="rounded-[30px] bg-background relative h-fit animate-pulse">
      {/* Quote Icon Skeleton */}
      <div className="absolute right-0 top-0 z-[2]">
        <div className="w-[50px] h-[50px] rounded-full bg-gray-300" />
      </div>

      {/* Media Section Skeleton */}
      <div className="relative pt-[63%] min-w-[60px] overflow-hidden rounded-t-[30px] bg-gray-300">
        <div className="absolute top-0 right-0 w-[60px] h-[60px] z-[1]">
          <div className="rounded-bl-[30px] w-full h-full bg-[#1b1f12]"></div>
          <div className="border-shape w-[30px] h-[30px] absolute top-0 left-[-29.5px] rotate-180 bg-[#1b1f12]"></div>
          <div className="border-shape w-[30px] h-[30px] absolute right-[-0.5px] bottom-[-30px] rotate-180 bg-[#1b1f12]"></div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="py-10 px-10">
        <div className="border-b border-b-neutral-200 pb-5 mb-5 min-h-[120px] space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex flex-wrap">
          <div className="flex flex-col text-base space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Featured Badge Skeleton */}
      <div className="absolute top-4 left-4 z-[2]">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
};

export default TestimonialCardSkeleton;