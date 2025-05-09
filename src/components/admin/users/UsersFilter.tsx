"use client";
import DateRangePicker from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useUsers from "@/hooks/useUsers";
import { initialFilterState, resetFilter, setFilter } from "@/store/features/user/user.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { endOfDay, startOfDay } from "date-fns";
import { RefreshCcw, SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

type StatusFilter = "all" | "active" | "blocked";
type SortOption =
  | "createdAt:desc"
  | "createdAt:asc"
  | "firstName:asc"
  | "firstName:desc";

const UsersFilter = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.user);
  const { refetch } = useUsers(initialFilterState);
  const [localSearch, setLocalSearch] = useState(filter.search || "");
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

  // Handle sort changes from select
  const handleSortChange = (value: SortOption) => {
    const [sortBy, sortOrder] = value.split(":") as [string, "asc" | "desc"];
    dispatch(setFilter({ sortBy, sortOrder }));
  };

  // Handle status changes from tabs
  const handleStatusChange = (status: StatusFilter) => {
    const actualStatus = status === "all" ? undefined : status;
    dispatch(setFilter({ status: actualStatus }));
  };

  // Handle date range changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    dispatch(
      setFilter({
        startDate: range?.from
          ? startOfDay(range.from).toISOString()
          : undefined,
        endDate: range?.to ? endOfDay(range.to).toISOString() : undefined,
      })
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    dispatch(resetFilter());
    setLocalSearch("");
    setDateRange(undefined);
  };

  // Sync local search with Redux state on mount
  useEffect(() => {
    setLocalSearch(filter.search as string);
    setDateRange({
      from: filter.startDate ? new Date(filter.startDate) : undefined,
      to: filter.endDate ? new Date(filter.endDate) : undefined,
    });
  }, [filter.search, filter.startDate, filter.endDate]);

  // Get current sort display text
  const getSortDisplayText = () => {
    if (filter.sortBy === "createdAt" && filter.sortOrder === "desc")
      return "Newest First";
    if (filter.sortBy === "createdAt" && filter.sortOrder === "asc")
      return "Oldest First";
    if (filter.sortBy === "firstName" && filter.sortOrder === "asc")
      return "Name (A-Z)";
    if (filter.sortBy === "firstName" && filter.sortOrder === "desc")
      return "Name (Z-A)";
    return "Sort by";
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

        <div className="col-span-1 lg:flex gap-4 items-center grid grid-cols-1">
          <div className="w-full">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              placeholder="Filter by date range"
              className=" rounded-sm"
            />
          </div>

          <Select
            value={`${filter.sortBy}:${filter.sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="lg:w-[180px] w-full rounded-sm">
              <SelectValue>{getSortDisplayText()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest First</SelectItem>
              <SelectItem value="createdAt:asc">Oldest First</SelectItem>
              <SelectItem value="firstName:asc">Name (A-Z)</SelectItem>
              <SelectItem value="firstName:desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="secondary"
            className="rounded-sm"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="w-full">
        <Tabs
          value={filter.status || "all"}
          onValueChange={(value) => handleStatusChange(value as StatusFilter)}
        >
          <TabsList className="grid w-full grid-cols-3 h-full">
            <TabsTrigger value="all" className="py-1.5 px-2">
              All Users
            </TabsTrigger>
            <TabsTrigger value="active" className="py-1.5 px-2">
              Active Users
            </TabsTrigger>
            <TabsTrigger value="blocked" className="py-1.5 px-2">
              Blocked Users
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default UsersFilter;
