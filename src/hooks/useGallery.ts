"use client";
import { IGallery, PhotosFilterInput } from "@/interfaces/photos.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllPhotos } from "@/lib/api/gallery";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useGallery = (params?: PhotosFilterInput) => {
  const { data, isPending, isError, refetch } = useQuery<
    PaginatedResponse<IGallery>
  >({
    queryKey: ["allPhotos", params],
    queryFn: async () => getAllPhotos(params),
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
  };
};

export default useGallery;
