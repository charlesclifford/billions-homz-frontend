"use client";
import { ISale, SalesFilterInput } from "@/interfaces/sales.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllSales } from "@/lib/api/sales";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useSales = (params?: SalesFilterInput) => {
  const { data, isPending, error, isError, refetch } = useQuery<
    PaginatedResponse<ISale>
  >({
    queryKey: ["sales", params],
    queryFn: async () => getAllSales(params),
  });

  const { sales, totalSales, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { sales: [], totalSales: 0, totalPages: 0 };

    return {
      sales: data.data || [],
      totalSales: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
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
  };
};

export default useSales;
