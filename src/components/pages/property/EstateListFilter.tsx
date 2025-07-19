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
import { cn } from "@/lib/utils";
import {
  EstateFilterState,
  resetFilter,
  setFilter,
} from "@/store/features/property/estate.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const priceRanges = [
  { label: "Any Price", value: "any" },
  { label: "Under ₦10M", value: "0-10000000" },
  { label: "₦10M - ₦50M", value: "10000000-50000000" },
  { label: "₦50M - ₦100M", value: "50000000-100000000" },
  { label: "₦100M - ₦200M", value: "100000000-200000000" },
  { label: "₦200M - ₦400M", value: "200000000-400000000" },
  { label: "₦400M - ₦600M", value: "400000000-600000000" },
  { label: "₦600M - ₦900M", value: "600000000-900000000" },
  { label: "Over ₦900M", value: "900000000-0" },
];

const EstateListFilter = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.estate);
  const [locationInput, setLocationInput] = useState("");
  const [priceRange, setPriceRange] = useState("any");

  // Initialize from URL params
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      dispatch(setFilter({ page: Number(page) }));
    }
  }, [dispatch, searchParams]);

  // Check if any filters are active
  const isFilterActive = locationInput.trim() !== "" || priceRange !== "any";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare filter payload
    const filterPayload: EstateFilterState = {
      ...filter,
      location: locationInput.trim() || undefined,
    };

    if (priceRange !== "any") {
      const [min, max] = priceRange.split("-").map(Number);
      filterPayload.minPrice = min || undefined;
      filterPayload.maxPrice =
        max || (priceRange.endsWith("-0") ? undefined : max);
    }

    dispatch(setFilter({ ...filterPayload, page: 1 }));
  };

  const handleReset = () => {
    if (!isFilterActive) return;

    dispatch(resetFilter());
    setLocationInput("");
    setPriceRange("any");
  };

  return (
    <div className="">
      <form
        onSubmit={handleSearch}
        className="w-full pb-[55px] flex flex-wrap gap-4"
      >
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Enter state or city"
            className="focus-visible:ring-0 shadow-none bg-gray-100 rounded-[30px] py-[15px] px-[30px] leading-[1.75] h-14 w-full"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        </div>

        <div className="min-w-[300px]">
          <Select onValueChange={setPriceRange} value={priceRange}>
            <SelectTrigger className="focus-visible:ring-0 shadow-none bg-gray-100 rounded-[30px] py-[15px] px-[30px] leading-[1.75] !h-14 w-full cursor-pointer">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-5">
          <Button
            variant="outline"
            type="button"
            className={cn(
              "font-bold leading-[1.5] capitalize rounded-[30px] cursor-pointer py-[17px] px-[40px] h-14",
              !isFilterActive ? "opacity-50 cursor-not-allowed" : ""
            )}
            disabled={!isFilterActive}
            onClick={handleReset}
          >
            Reset Filters
          </Button>
          <Button
            type="submit"
            className="font-bold leading-[1.5] capitalize rounded-[30px] cursor-pointer py-[17px] px-[40px] h-14"
          >
            Search Properties
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EstateListFilter;
