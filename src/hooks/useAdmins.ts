"use client";
import { IAdmin } from "@/interfaces/admin.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllAdmins } from "@/lib/api/admin";
import { AdminFilterState } from "@/store/features/admin/admin.slice";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useAdmins = (params?: AdminFilterState) => {
  const { data, isPending, isError, refetch } = useQuery<
    PaginatedResponse<IAdmin>
  >({
    queryKey: ["allAdmins", params],
    queryFn: async () => getAllAdmins(params),
  });

  const { admins, totalAdmins, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { admins: [], totalAdmins: 0, totalPages: 0 };

    return {
      admins: data.data || [],
      totalAdmins: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    admins,
    totalAdmins,
    totalPages,
    isPending,
    isError,
    refetch,
  };
};

export default useAdmins;
