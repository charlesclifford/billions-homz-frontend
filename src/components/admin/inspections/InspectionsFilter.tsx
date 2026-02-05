"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCcw, SearchIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  initialFilterState,
  resetFilter,
  setFilter,
} from "@/store/features/inspections/inspection.slice";
import useInspections from "@/hooks/useInspections";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["all", "Pending", "Confirmed", "Cancelled"];
const DAYS = ["Thursday", "Saturday"];

const InspectionsFilter = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.inspection);
  const { refetch } = useInspections(initialFilterState);

  const [localSearch, setLocalSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("");

  // Sync input debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setFilter({ search: localSearch || undefined }));
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocalSearch(e.target.value);

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setFilter({ search: undefined }));
  };

  const handleDayChange = (val: string) => {
    setDayFilter(val);
    dispatch(setFilter({ day: val === "all" ? undefined : val }));
  };

  const handleStatusChange = (status: string) => {
    dispatch(setFilter({ status }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilter());
    setLocalSearch("");
    setDayFilter("");
  };

  // Sync local UI with redux filter on mount
  useEffect(() => {
    setLocalSearch(filter.search ?? "");
    setDayFilter(filter.day ?? "");
  }, [filter.search, filter.day]);

  return (
    <div className="space-y-4">
      {/* Top row: Search, Estate, Day filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Search input */}
        <div className="relative col-span-1 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="cursor-pointer"
                aria-label="Refresh inspections"
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
              className="focus:!ring-0 px-12 rounded-sm"
              placeholder="Search by name or estate..."
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
          {/* Day filter */}
          <div>
            <Select value={dayFilter || "all"} onValueChange={handleDayChange}>
              <SelectTrigger className="rounded-sm">
                <SelectValue placeholder="Filter by day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Bottom row: Status tabs + Reset */}
      <div className="w-full">
        <Tabs
          value={filter.status || "all"}
          onValueChange={(value) => handleStatusChange(value)}
        >
          <TabsList className="w-full h-full grid grid-cols-2 sm:grid-cols-4">
            {STATUSES.map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="py-1.5 px-2 capitalize cursor-pointer"
              >
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default InspectionsFilter;
