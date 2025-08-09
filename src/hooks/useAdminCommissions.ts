"use client";
import {
  CommissionsFilterInput,
  ICommission,
} from "@/interfaces/commission.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllCommissions } from "@/lib/api/commissions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useAdminCommissions = (params?: CommissionsFilterInput) => {
  const { data, isPending, error, isError, refetch } = useQuery<
    PaginatedResponse<ICommission>
  >({
    queryKey: ["allCommissions", params],
    queryFn: async () => getAllCommissions(params),
  });

  const { commissions, totalCommissions, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { commissions: [], totalCommissions: 0, totalPages: 0 };

    return {
      commissions: data.data || [],
      totalCommissions: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    commissions,
    isPending,
    error,
    isError,
    refetch,
    totalCommissions,
    totalPages,
  };
};

export default useAdminCommissions;
