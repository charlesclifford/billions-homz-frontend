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
import useEstates from "@/hooks/useEstates";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/property/estate.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import EstateCard from "./EstateCard";
import EstateCardSkeleton from "./EstateCardSkeleton";
import { Home } from "lucide-react";

const EstatesList = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.estate);
  const { estates, isPending, totalPages } = useEstates(filter);

  const onPaginationChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(setFilter({ page }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        {isPending ? (
          [...Array(3)].map((_, i) => <EstateCardSkeleton key={i} />)
        ) : estates && estates.length > 0 ? (
          estates?.map((estate) => (
            <EstateCard key={estate._id} estate={estate} />
          ))
        ) : (
          // ✅ Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <Home className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-lg font-semibold">No estates found</h3>
            <p className="text-sm">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </div>

      {estates && estates?.length > 0 && totalPages > 1 && (
        <Pagination className="mt-[60px] justify-start gap-2.5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPaginationChange(filter.page - 1)}
                aria-disabled={filter.page === 1}
                className={cn(
                  "cursor-pointer rounded-full w-[50px] h-[50px]",
                  filter.page === 1 && "pointer-events-none opacity-50 hidden"
                )}
              />
            </PaginationItem>

            {getPaginationRange(filter.page, totalPages).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === filter.page}
                  className={cn(
                    "cursor-pointer rounded-full w-[50px] h-[50px] hover:bg-primary hover:text-white",
                    page === filter.page &&
                      "bg-primary dark:bg-primary text-white"
                  )}
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
                  "cursor-pointer rounded-full w-[50px] h-[50px]",
                  filter.page >= totalPages &&
                    "pointer-events-none opacity-50 hidden"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default EstatesList;
