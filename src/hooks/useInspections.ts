import {
  IInspection,
  InspectionQueryParams,
} from "@/interfaces/inspection.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getInspections } from "@/lib/api/inspections";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useInspections = (params?: InspectionQueryParams) => {
  const { data, isPending, error, isError, refetch } = useQuery<
    PaginatedResponse<IInspection>
  >({
    queryKey: ["inspections", params],
    queryFn: () => getInspections(params),
  });

  const { inspections, totalInspections, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { inspections: [], totalInspections: 0, totalPages: 0 };

    return {
      inspections: data.data || [],
      totalInspections: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    inspections,
    isPending,
    error,
    isError,
    refetch,
    totalInspections,
    totalPages,
  };
};

export default useInspections;
