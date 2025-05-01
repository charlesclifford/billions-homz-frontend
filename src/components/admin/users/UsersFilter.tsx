"use client";
import { Badge } from "@/components/ui/badge";
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
import {
  resetFilters,
  setRole,
  setSearch,
  setSort,
} from "@/store/features/user/user.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { HiAdjustmentsVertical } from "react-icons/hi2";

const UsersFilter = () => {
  const dispatch = useAppDispatch();
  const { filter, users } = useAppSelector((state) => state.user);
  const [localSearch, setLocalSearch] = useState(filter.search);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(localSearch);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch]);

  useEffect(() => {
    dispatch(setSearch(debouncedSearchValue));
  }, [debouncedSearchValue, dispatch]);

  const handleRoleChange = (value: "user" | "realtor" | "all") => {
    dispatch(setRole(value));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(":");
    dispatch(
      setSort({ field: sortBy, direction: sortOrder as "asc" | "desc" })
    );
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setLocalSearch("");
  };

  const getRoleCount = (role: string) => {
    return users.filter((user) => role === "all" || user.role === role).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
      <div className="flex items-center w-full">
        <div className="flex items-center border-b py-2 w-full">
          <SearchIcon className="mx-2" />
          <Input
            className="!bg-transparent border-0 focus:!ring-0 !shadow-none"
            placeholder="Search by name..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
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
      <div className="w-full flex">
        <Tabs
          value={filter.role}
          onValueChange={(value) =>
            handleRoleChange(value as "user" | "realtor" | "all")
          }
          className="w-full border-b "
        >
          <TabsList className=" bg-transparent rounded-none py-0 !h-full">
            <TabsTrigger
              value="all"
              className="text-base py-2.5 px-8 h-full rounded-none !border-b-2 data-[state=active]:!text-red-500 data-[state=active]:!border-b-red-500 data-[state=active]:!border-b-2 data-[state=active]:!shadow-none data-[state=active]:!bg-transparent data-[state=active]:border-0"
            >
              All Users{" "}
              <Badge className="ml-2 !rounded-xs ">
                {users.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="user"
              className="text-base py-2.5 px-8 h-full rounded-none !border-b-2 data-[state=active]:!text-red-500 data-[state=active]:!border-b-red-500 data-[state=active]:!border-b-2 data-[state=active]:!shadow-none data-[state=active]:!bg-transparent data-[state=active]:border-0"
            >
              Users{" "}
              <Badge className="ml-2 !rounded-xs ">
                {getRoleCount("user")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="realtor"
              className="text-base py-2.5 px-8 h-full rounded-none !border-b-2 data-[state=active]:!text-red-500 data-[state=active]:!border-b-red-500 data-[state=active]:!border-b-2 data-[state=active]:!shadow-none data-[state=active]:!bg-transparent data-[state=active]:border-0"
            >
              Realtors{" "}
              <Badge className="ml-2 !rounded-xs">
                {getRoleCount("realtor")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default UsersFilter;
