"use client";
import { Button } from "@/components/ui/button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  resetFilter,
  setFilter,
} from "@/store/features/property/property.slice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SearchIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { HiAdjustmentsVertical } from "react-icons/hi2";

const PropertiesFilter = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.property);
  const [localSearch, setLocalSearch] = useState(filter.search || "");

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

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(":") as [string, "asc" | "desc"];
    dispatch(setFilter({ sortBy, sortOrder }));
  };

  const handleListingTypeChange = (value: string) => {
    dispatch(setFilter({ listingType: value }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilter());
    setLocalSearch("");
  };

  // Add these handlers
  const handlePriceChange = (type: "min" | "max", value: string) => {
    dispatch(setFilter({ [type === "min" ? "minPrice" : "maxPrice"]: value }));
  };

  const handleBedBathChange = (
    type: "bedrooms" | "bathrooms",
    value: string
  ) => {
    dispatch(setFilter({ [type]: value }));
  };

  // const handleTypeChange = (value: string) => {
  //   dispatch(setFilter({ type: value }));
  // };

  useEffect(() => {
    setLocalSearch(filter.search as string);
  }, [filter.search]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
      <div className="flex items-center w-full">
        <div className="flex items-center w-full relative">
          <SearchIcon className="mx-2 absolute text-neutral-400 dark:text-neutral-500" />
          <Input
            className=" focus:!ring-0 !shadow-none px-10 rounded-sm"
            placeholder="Search properties..."
            aria-label="Search properties"
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
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              size={"icon"}
              asChild
              aria-label="Open filters"
              className="!p-1.5 cursor-pointer ml-2 rounded-sm"
            >
              <HiAdjustmentsVertical size={16} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="">
            <DrawerHeader>
              <DrawerTitle>Advanced Filters</DrawerTitle>
              <DrawerDescription>Refine your property search</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Price</Label>
                  <Input
                    type="number"
                    placeholder="$ Min"
                    value={filter.minPrice || ""}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Price</Label>
                  <Input
                    type="number"
                    placeholder="$ Max"
                    value={filter.maxPrice || ""}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select
                    value={filter.bedrooms || ""}
                    onValueChange={(value) =>
                      handleBedBathChange("bedrooms", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Select
                    value={filter.bathrooms || ""}
                    onValueChange={(value) =>
                      handleBedBathChange("bathrooms", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select value={filter.type || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={`${filter.sortBy}:${filter.sortOrder}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt:desc">Newest First</SelectItem>
                    <SelectItem value="createdAt:asc">Oldest First</SelectItem>
                    <SelectItem value="price:asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price:desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="size:asc">
                      Size: Small to Large
                    </SelectItem>
                    <SelectItem value="size:desc">
                      Size: Large to Small
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DrawerFooter className="flex-row gap-3 justify-end">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button onClick={handleResetFilters} variant="secondary">
                Reset Filters
              </Button>
              <DrawerClose asChild>
                <Button>Apply Filters</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* tabs */}
      <div className="w-full flex ms-auto">
        <Tabs
          value={filter.listingType || "all"}
          onValueChange={handleListingTypeChange}
        >
          <TabsList className="grid w-full grid-cols-4 h-full">
            <TabsTrigger value="all" className="py-1.5 px-2">
              All
            </TabsTrigger>
            <TabsTrigger value="sale" className="py-1.5 px-2">
              For Sale
            </TabsTrigger>
            <TabsTrigger value="rent" className="py-1.5 px-2">
              For Rent
            </TabsTrigger>
            <TabsTrigger value="lease" className="py-1.5 px-2">
              For Lease
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertiesFilter;
