import {
  IRealtorSalesPerformance,
  IRealtorStats,
  SalesPerformanceFilter,
} from "@/interfaces/realtor.interface";
import {
  getRealtorSalesPerformance,
  getRealtorStats,
} from "@/lib/api/realtors";
import { useQuery } from "@tanstack/react-query";

export function useRealtorStats() {
  return useQuery({
    queryKey: ["realtor-stats"],
    queryFn: getRealtorStats,
    select: (data) => data.data as IRealtorStats,
  });
}

export function useRealtorSalesPerformance(params?: SalesPerformanceFilter) {
  return useQuery({
    queryKey: ["realtor-sales-performance", params],
    queryFn: () => getRealtorSalesPerformance(params),
    select: (data) => data.data as IRealtorSalesPerformance,
  });
}
