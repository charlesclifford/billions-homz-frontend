"use client";

import { IDashboardSalesPerformance, IDashboardStats } from "@/interfaces/admin.interface";
import { SalesPerformanceFilter } from "@/interfaces/realtor.interface";
import { getDashboardStats, getSalesPerformance } from "@/lib/api/admin";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    select: (data) => data.data as IDashboardStats,
  });
}

export function useAdminSalesPerformance(params?: SalesPerformanceFilter) {
  return useQuery({
    queryKey: ["sales-performance", params],
    queryFn: () => getSalesPerformance(params),
    select: (data) => data.data as IDashboardSalesPerformance,
  });
}
