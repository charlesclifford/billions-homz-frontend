"use client";
import { getPaginationRange } from "@/components/shared/DataTable";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import usePosts from "@/hooks/usePosts";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/blog/blog.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PostCard from "./PostCard";

const BlogsList = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.blog);
  const { posts, isPending, totalPages, totalPosts } = usePosts(filter);

  const onPaginationChange = (page: number) => {
    dispatch(setFilter({ page }));
  };

  // Calculate the range of items being shown
  const startItem = (filter.page - 1) * filter.limit + 1;
  const endItem = Math.min(filter.page * filter.limit, totalPosts);

  return (
    <div className="">
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm mb-4 font-medium text-muted-foreground">
            Showing{" "}
            <span className=" text-primary">
              {startItem} - {endItem} of {totalPosts}
            </span>{" "}
            Users
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination controls */}
          {posts.length > 0 && totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPaginationChange(filter.page - 1)}
                    aria-disabled={filter.page === 1}
                    className={cn(
                      "cursor-pointer",
                      filter.page === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {getPaginationRange(filter.page, totalPages).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === filter.page}
                      onClick={() => onPaginationChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPaginationChange(filter.page + 1)}
                    aria-disabled={filter.page >= totalPages}
                    className={cn(
                      "cursor-pointer",
                      filter.page >= totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default BlogsList;
