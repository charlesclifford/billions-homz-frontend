"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
import { resetFilter, setFilter } from "@/store/features/user/user.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { HiAdjustmentsVertical } from "react-icons/hi2";

type RoleFilter = "all" | "user" | "realtor";
type SortOption =
  | "createdAt:desc"
  | "createdAt:asc"
  | "firstName:asc"
  | "firstName:desc";

const UsersFilter = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.user);
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

  // Handle sort changes from select
  const handleSortChange = (value: SortOption) => {
    const [sortBy, sortOrder] = value.split(":") as [string, "asc" | "desc"];
    dispatch(setFilter({ sortBy, sortOrder }));
  };

  // Handle role changes from tabs
  const handleRoleChange = (role: RoleFilter) => {
    const actualRole = role === "all" ? undefined : role;
    dispatch(setFilter({ role: actualRole }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    dispatch(resetFilter());
    setLocalSearch("");
  };

  // Sync local search with Redux state on mount
  useEffect(() => {
    setLocalSearch(filter.search as string);
  }, [filter.search]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
      <div className="flex items-center w-full">
        <div className="flex items-center w-full relative">
          <SearchIcon className="mx-2 absolute text-neutral-400 dark:text-neutral-500" />
          <Input
            className=" focus:!ring-0 !shadow-none px-12"
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
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              size={"icon"}
              asChild
              className="!p-1.5 cursor-pointer ml-2 rounded-sm"
            >
              <HiAdjustmentsVertical size={16} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Advanced Filters</DrawerTitle>
              <DrawerDescription>
                Refine your user search with additional filters
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-4">
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
                    <SelectItem value="firstName:asc">Name (A-Z)</SelectItem>
                    <SelectItem value="firstName:desc">Name (Z-A)</SelectItem>
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
          value={filter.role || "all"}
          onValueChange={(value) => handleRoleChange(value as RoleFilter)}
        >
          <TabsList className="grid w-full grid-cols-3 h-full">
            <TabsTrigger value="all" className="py-1.5 px-2">
              All Users
            </TabsTrigger>
            <TabsTrigger value="user" className="py-1.5 px-2">
              Users
            </TabsTrigger>
            <TabsTrigger value="realtor" className="py-1.5 px-2">
              Realtors
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default UsersFilter;
