"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter, resetFilter } from "@/store/features/blog/blog.slice";
import { initialFilterState } from "@/store/features/blog/blog.slice";
import { Search, X, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePosts from "@/hooks/usePosts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SortOption =
  | "createdAt:desc"
  | "createdAt:asc"
  | "title:asc"
  | "title:desc";

const BlogsFilter = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.blog);
  const { refetch } = usePosts(initialFilterState);
  const [localSearch, setLocalSearch] = useState(filter.search || "");

  // Sync local search with Redux filter with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filter.search) {
        dispatch(setFilter({ search: localSearch, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, dispatch, filter.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setFilter({ search: undefined, page: 1 }));
  };

  const handleSortChange = (value: SortOption) => {
    const [sortBy, sortOrder] = value.split(":") as [string, "asc" | "desc"];
    dispatch(setFilter({ sortBy, sortOrder }));
  };

  const handleStatusChange = (value: string) => {
    let isPublished: boolean | undefined;

    if (value === "published") {
      isPublished = true;
    } else if (value === "unpublished") {
      isPublished = false;
    } else {
      isPublished = undefined; // "all" case
    }

    dispatch(
      setFilter({
        isPublished,
        page: 1, // Reset to first page when status changes
      })
    );
  };

  const handleFeaturedChange = (value: string) => {
    let featured: boolean | undefined;

    if (value === "featured") {
      featured = true;
    } else if (value === "not-featured") {
      featured = false;
    } else {
      featured = undefined; // "all" case
    }

    dispatch(
      setFilter({
        featured,
        page: 1,
      })
    );
  };

  const handleResetFilters = () => {
    setLocalSearch("");
    dispatch(resetFilter());
  };

  const getSortDisplayText = () => {
    if (!filter.sortBy || !filter.sortOrder) return "Sort By";

    switch (`${filter.sortBy}:${filter.sortOrder}`) {
      case "createdAt:desc":
        return "Newest First";
      case "createdAt:asc":
        return "Oldest First";
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
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
          <div className="flex items-center w-full relative">
            <Search className="h-4 w-4 mx-2 absolute text-muted-foreground" />
            <Input
              className="focus:!ring-0 pl-8 pr-8 rounded-sm"
              placeholder="Search posts..."
              value={localSearch}
              onChange={handleSearchChange}
            />
            {localSearch && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:flex gap-4 items-center grid grid-cols-1">
          {/* Featured Filter */}
          <div className="w-full">
            <Select
              value={
                filter.featured === undefined
                  ? "all"
                  : filter.featured
                  ? "featured"
                  : "not-featured"
              }
              onValueChange={handleFeaturedChange}
            >
              <SelectTrigger className="w-full rounded-sm">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="not-featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="w-full">
            <Select
              value={`${filter.sortBy || "createdAt"}:${
                filter.sortOrder || "desc"
              }`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full rounded-sm">
                <SelectValue>{getSortDisplayText()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt:desc">Newest First</SelectItem>
                <SelectItem value="createdAt:asc">Oldest First</SelectItem>
                <SelectItem value="title:asc">Title (A-Z)</SelectItem>
                <SelectItem value="title:desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="rounded-sm cursor-pointer"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Status Tabs - Simplified for blog posts */}
      <Tabs
        value={
          filter.isPublished === undefined
            ? "all"
            : filter.isPublished
            ? "published"
            : "unpublished"
        }
        onValueChange={(value) =>
          handleStatusChange(value as "all" | "published" | "unpublished")
        }
      >
        <TabsList className="grid w-full grid-cols-3 h-full">
          <TabsTrigger value="all" className="py-1.5 px-2 cursor-pointer">
            All Posts
          </TabsTrigger>
          <TabsTrigger value="published" className="py-1.5 px-2 cursor-pointer">
            Published
          </TabsTrigger>
          <TabsTrigger
            value="unpublished"
            className="py-1.5 px-2 cursor-pointer"
          >
            Drafts
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BlogsFilter;
