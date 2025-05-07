"use client";
import { IRealtor, RealtorsFilterInput } from "@/interfaces/realtor.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllRealtors } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useRealtors = (params?: RealtorsFilterInput) => {
  const { data, isPending, isError, refetch } = useQuery<
    PaginatedResponse<IRealtor>
  >({
    queryKey: ["allRealtors", params],
    queryFn: async () => getAllRealtors(params),
  });

  const { realtors, totalRealtors, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { realtors: [], totalRealtors: 0, totalPages: 0 };

    return {
      realtors: data.data || [],
      totalRealtors: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    realtors,
    totalRealtors,
    totalPages,
    isPending,
    isError,
    refetch,
  };
};

export default useRealtors;
