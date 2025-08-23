"use client";
import DateRangePicker from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSales from "@/hooks/useSales";
import {
  initialFilterState,
  resetFilter,
  setFilter,
} from "@/store/features/sales/sale.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { endOfDay, startOfDay } from "date-fns";
import { RefreshCcw, SearchIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const SalesFilter = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.sale);
  const { refetch } = useSales(initialFilterState);
  const [localSearch, setLocalSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filter.startDate ? new Date(filter.startDate) : undefined,
    to: filter.endDate ? new Date(filter.endDate) : undefined,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setFilter({ search: localSearch }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setFilter({ search: undefined }));
  };

  // Handle date range changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // Only dispatch when both from & to are selected
    if (range?.from && range?.to) {
      dispatch(
        setFilter({
          startDate: startOfDay(range.from).toISOString(),
          endDate: endOfDay(range.to).toISOString(),
        })
      );
    }
  };

  // Sync local search with Redux state on mount
  useEffect(() => {
    setLocalSearch(filter.search as string);
    setDateRange({
      from: filter.startDate ? new Date(filter.startDate) : undefined,
      to: filter.endDate ? new Date(filter.endDate) : undefined,
    });
  }, [filter.search, filter.startDate, filter.endDate]);

  const handleResetFilters = () => {
    dispatch(resetFilter());
    setLocalSearch("");
    setDateRange(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative col-span-1 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                className="cursor-pointer"
                aria-label="Refresh results"
                onClick={() => refetch()}
              >
                <RefreshCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
          <div className="flex items-center w-full relative">
            <SearchIcon className="mx-2 absolute text-neutral-400 dark:text-neutral-500" />
            <Input
              className="focus:!ring-0  px-12 rounded-sm"
              placeholder="Search by name..."
              value={localSearch}
              onChange={handleSearchChange}
            />
            {localSearch && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-1 lg:flex gap-4 items-center  grid grid-cols-1 justify-end">
          <div className="lg:w-[280px] w-full">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              placeholder="Filter by date range"
              className=" rounded-sm"
            />
          </div>

          <Button
            variant="secondary"
            className="rounded-sm cursor-pointer"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesFilter;
