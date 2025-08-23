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
  PropertyFilterState,
  resetFilter,
  setFilter,
} from "@/store/features/property/property.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LocationComboBox from "./LocationComboBox";

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

const PropertiesListFilter = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.property);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState("any");

  // Initialize from URL params and Redux state
  useEffect(() => {
    // Get values from URL params
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const page = searchParams.get("page");
    const search = searchParams.get("search");

    // Set local state from URL params
    if (location) {
      setSelectedLocation(location);
    }

    if (search) {
      setSearchInput(search);
    }

    // Set price range from URL params
    if (minPrice || maxPrice) {
      if (minPrice === "0" && maxPrice === "10000000") {
        setPriceRange("0-10000000");
      } else if (minPrice === "10000000" && maxPrice === "50000000") {
        setPriceRange("10000000-50000000");
      } else if (minPrice === "50000000" && maxPrice === "100000000") {
        setPriceRange("50000000-100000000");
      } else if (minPrice === "100000000" && maxPrice === "200000000") {
        setPriceRange("100000000-200000000");
      } else if (minPrice === "200000000" && maxPrice === "400000000") {
        setPriceRange("200000000-400000000");
      } else if (minPrice === "400000000" && maxPrice === "600000000") {
        setPriceRange("400000000-600000000");
      } else if (minPrice === "600000000" && maxPrice === "900000000") {
        setPriceRange("600000000-900000000");
      } else if (minPrice === "900000000" && !maxPrice) {
        setPriceRange("900000000-0");
      }
    }

    // Update Redux filter state
    const filterPayload: Partial<PropertyFilterState> = {};
    if (location) filterPayload.location = location;
    if (minPrice) filterPayload.minPrice = minPrice;
    if (maxPrice) filterPayload.maxPrice = maxPrice;
    if (page) filterPayload.page = Number(page);
    if (search) filterPayload.search = search;

    if (Object.keys(filterPayload).length > 0) {
      dispatch(setFilter(filterPayload));
    }
  }, [dispatch, searchParams]);

  // Check if any filters are active
  const isFilterActive =
    selectedLocation !== "" ||
    searchInput.trim() !== "" ||
    priceRange !== "any";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare filter payload
    const filterPayload: Partial<PropertyFilterState> = {
      ...filter,
      location: selectedLocation || undefined,
      search: searchInput.trim() || undefined,
      page: 1, // Reset to first page on new search
    };

    if (priceRange !== "any") {
      const [min, max] = priceRange.split("-").map(Number);
      filterPayload.minPrice = min === 0 ? undefined : min.toString();
      filterPayload.maxPrice = max === 0 ? undefined : max.toString();
    } else {
      // Clear price filters when "any" is selected
      filterPayload.minPrice = undefined;
      filterPayload.maxPrice = undefined;
    }

    dispatch(setFilter(filterPayload));
  };

  const handleReset = () => {
    if (!isFilterActive) return;

    dispatch(resetFilter());
    setSelectedLocation("");
    setSearchInput("");
    setPriceRange("any");
  };

  return (
    <div className="">
      <form
        onSubmit={handleSearch}
        className="w-full pb-[55px] flex flex-col lg:flex-row gap-5"
      >
        {/* Search Input */}
        <div className="flex-1 min-w-[250px]">
          <Input
            placeholder="Search properties..."
            className="focus-visible:ring-0 shadow-none bg-gray-100 rounded-[30px] py-[15px] px-[30px] leading-[1.75] h-14 w-full"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Location Input with Dropdown */}
        <div className="min-w-[250px]">
          <LocationComboBox
            value={selectedLocation}
            onChange={(val) => setSelectedLocation(val)}
          />
        </div>

        {/* Price Range Filter */}
        <div className="min-w-[250px]">
          <Select onValueChange={setPriceRange} value={priceRange}>
            <SelectTrigger className="focus-visible:ring-0 shadow-none bg-gray-100 rounded-[30px] py-[15px] px-[30px] leading-[1.75] !h-14 w-full cursor-pointer">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {priceRanges.map((range) => (
                <SelectItem
                  key={range.value}
                  value={range.value}
                  className="cursor-pointer rounded-[30px]"
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-col-reverse md:flex-row gap-5">
          <Button
            variant="outline"
            type="button"
            className={cn(
              "font-bold leading-[1.5] capitalize rounded-[30px] cursor-pointer py-[17px] px-[40px] h-14 w-full md:w-fit ms-auto",
              !isFilterActive ? "opacity-50 cursor-not-allowed" : ""
            )}
            disabled={!isFilterActive}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="font-bold leading-[1.5] capitalize rounded-[30px] cursor-pointer py-[17px] px-[40px] h-14 w-full md:w-fit"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertiesListFilter;
