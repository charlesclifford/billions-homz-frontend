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

const EstatesList = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.estate);
  const { estates, isPending, totalPages } = useEstates(filter);

  const onPaginationChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(setFilter({ page }));
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        {[...Array(3)].map((_, i) => (
          <EstateCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        {estates?.map((estate) => (
          <EstateCard key={estate._id} estate={estate} />
        ))}
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
                    page === filter.page && "bg-primary text-white"
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
