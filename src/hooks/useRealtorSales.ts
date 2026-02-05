"use client";

import { ISale, SalesFilterInput } from "@/interfaces/sales.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getMySales } from "@/lib/api/sales";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useRealtorsales = (params?: SalesFilterInput) => {
  const { data, isPending, error, isError, refetch } = useQuery<
    PaginatedResponse<ISale>
  >({
    queryKey: ["my-sales", params],
    queryFn: async () => getMySales(params),
  });

  const { sales, totalSales, totalPages, limit } = useMemo(() => {
    if (!data || isPending || isError)
      return { sales: [], totalSales: 0, totalPages: 0, limit: 0 };

    return {
      sales: data.data || [],
      totalSales: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
      limit: data.pagination.limit || 0,
    };
  }, [data, isPending, isError]);

  return {
    sales,
    isPending,
    error,
    isError,
    refetch,
    totalSales,
    totalPages,
    limit
  };
};
