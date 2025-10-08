"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useEstates from "@/hooks/useEstates";
import {
  initialFilterState,
  resetFilter,
  setFilter,
} from "@/store/features/property/estate.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RefreshCcw, SearchIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type SortOption =
  | "createdAt:desc"
  | "createdAt:asc"
  | "price:asc"
  | "price:desc"
  | "title:asc"
  | "title:desc";

const EstateFilter = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.estate);
  const { refetch } = useEstates(initialFilterState);
  const [localSearch, setLocalSearch] = useState(filter.search || "");
  const [localMinPrice, setLocalMinPrice] = useState(
    filter.minPrice?.toString() || ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    filter.maxPrice?.toString() || ""
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const min = localMinPrice === "" ? undefined : Number(localMinPrice);
      const max = localMaxPrice === "" ? undefined : Number(localMaxPrice);

      dispatch(setFilter({ search: localSearch }));
      dispatch(
        setFilter({
          minPrice: min,
          maxPrice: max,
        })
      );
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, dispatch, localMaxPrice, localMinPrice]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setFilter({ search: undefined }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilter());
    setLocalSearch("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
  };

  const handleSortChange = (value: SortOption) => {
    const [sortBy, sortOrder] = value.split(":") as [string, "asc" | "desc"];
    dispatch(setFilter({ sortBy, sortOrder }));
  };

  useEffect(() => {
    setLocalSearch(filter.search as string);
  }, [filter.search]);

  const getSortDisplayText = () => {
    if (!filter.sortBy || !filter.sortOrder) return "Sort by";

    switch (`${filter.sortBy}:${filter.sortOrder}`) {
      case "createdAt:desc":
        return "Newest First";
      case "createdAt:asc":
        return "Oldest First";
      case "price:asc":
        return "Price: Low to High";
      case "price:desc":
        return "Price: High to Low";
      case "title:asc":
        return "Title (A-Z)";
      case "title:desc":
        return "Title (Z-A)";
      default:
        return "Sort by";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              className="focus:!ring-0 px-12 rounded-sm"
              placeholder="Search name, location..."
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

        <div className="col-span-1 lg:col-span-2 lg:flex gap-4 items-center grid grid-cols-1 justify-end">
          <div className="flex gap-4">
            <Input
              placeholder="Min price"
              type="number"
              min="0"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full focus:!ring-0 rounded-sm"
            />
            <Input
              placeholder="Max price"
              type="number"
              min="0"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full focus:!ring-0 rounded-sm"
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
              <SelectItem value="price:asc">Price: Low to High</SelectItem>
              <SelectItem value="price:desc">Price: High to Low</SelectItem>
              <SelectItem value="title:asc">Title (A-Z)</SelectItem>
              <SelectItem value="title:desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>

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

export default EstateFilter;
