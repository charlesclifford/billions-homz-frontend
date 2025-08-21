import { Skeleton } from "@/components/ui/skeleton";

const PropertyCardSkeleton = () => {
  return (
    <div className="overflow-hidden flex flex-col h-auto group">
      {/* Image placeholder */}
      <Skeleton className="relative w-full pt-[68.5%] bg-muted rounded-[30px] mb-5">
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <CameraIcon className="w-8 h-8 text-muted-foreground" />
        </div> */}
      </Skeleton>

      {/* Status badge placeholder */}
      <div className="absolute top-4 left-4 py-2.5 px-5 rounded-[20px] bg-background/80 backdrop-blur-sm w-16 h-6" />

      {/* Info section */}
      <div className="flex flex-col flex-1">
        {/* Location */}
        <Skeleton className="h-4 w-1/3 mb-1" />

        {/* Title */}
        <Skeleton className="h-6 w-5/6 mb-2" />

        {/* Price */}
        <Skeleton className="h-5 w-1/2 mb-3" />

        {/* Property Details */}
        <div className="flex flex-wrap gap-3 mt-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
