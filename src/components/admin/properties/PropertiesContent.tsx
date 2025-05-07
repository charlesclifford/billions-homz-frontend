"use client";
import { getPaginationRange } from "@/components/shared/DataTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import useProperties from "@/hooks/useProperties";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/property/property.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PropertyCard from "./PropertyCard";

const PropertiesContent = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.property);
  const { properties, totalPages, isPending, totalProperties } =
    useProperties(filter);

  const onPaginationChange = (page: number) => {
    dispatch(setFilter({ page }));
  };

  // Calculate the range of items being shown
  const startItem = (filter.page - 1) * filter.limit + 1;
  const endItem = Math.min(filter.page * filter.limit, totalProperties);

  return (
    <div className="">
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-80 flex flex-col space-y-4">
              <Skeleton className="w-full h-40 rounded-lg" />
              <Skeleton className="w-full h-6 rounded-lg" />
              <Skeleton className="w-2/4 h-6 rounded-lg" />
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search filters
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm mb-4 font-medium text-muted-foreground">
            Showing{" "}
            <span className=" text-primary">
              {startItem} - {endItem} of {totalProperties}
            </span>{" "}
            Users
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {properties.map((property, i) => (
              <PropertyCard key={i} property={property} />
            ))}
          </div>

          {/* Pagination controls */}
          {properties.length > 0 && totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPaginationChange(filter.page - 1)}
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

export default PropertiesContent;
