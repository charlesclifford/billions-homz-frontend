"use client";
import { IGallery, PhotosFilterInput } from "@/interfaces/photos.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllPhotos } from "@/lib/api/gallery";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useGallery = (params?: PhotosFilterInput) => {
  const { data, isPending, isError, refetch } = useQuery<
    PaginatedResponse<IGallery>
  >({
    queryKey: ["allPhotos", params],
    queryFn: async () => getAllPhotos(params),
  });

  // Infinite query version
  const infiniteQuery = useInfiniteQuery<PaginatedResponse<IGallery>, Error>({
    queryKey: ["photos-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      getAllPhotos({
        ...params,
        page: pageParam as number,
        limit: params?.limit || 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

  const { photos, totalPhotos, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { photos: [], totalPhotos: 0, totalPages: 0 };

    return {
      photos: data.data || [],
      totalPhotos: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    photos,
    totalPhotos,
    totalPages,
    isPending,
    isError,
    refetch,

    // Infinite query methods
    infiniteQuery: {
      ...infiniteQuery,
      photos: infiniteQuery.data?.pages.flatMap((page) => page.data) || [],
      isLoadingInfinite: infiniteQuery.isPending,
      isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    },

    // Helper methods
    hasMore: infiniteQuery.hasNextPage,
    loadMore: infiniteQuery.fetchNextPage,
  };
};

export default useGallery;
