"use client";
import { IEstate } from "@/interfaces/estate.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllEstates } from "@/lib/api/properties";
import { EstateFilterState } from "@/store/features/property/estate.slice";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useEstates = (params?: EstateFilterState) => {
  const { data, isPending, error, isError, refetch } = useQuery<
    PaginatedResponse<IEstate>
  >({
    queryKey: ["allEstates", params],
    queryFn: async () => getAllEstates(params),
  });

  const { estates, totalEstates, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { estates: [], totalEstates: 0, totalPages: 0 };

    return {
      estates: data.data || [],
      totalEstates: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    estates,
    isPending,
    error,
    isError,
    refetch,
    totalEstates,
    totalPages,
  };
};

export default useEstates;
