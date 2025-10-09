"use client";

import {
  IDashboardSalesPerformance,
  IDashboardStats,
  ITopAssetResponse
} from "@/interfaces/admin.interface";
import { SalesPerformanceFilter } from "@/interfaces/realtor.interface";
import {
  getDashboardStats,
  getSalesPerformance,
  getTopSellingAssets
} from "@/lib/api/admin";
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

export function useAdminTopSellingEstates(
  params?: SalesPerformanceFilter & { limit: number }
) {
  return useQuery({
    queryKey: ["top-estates", params],
    queryFn: () => getTopSellingAssets(params),
    select: (data) => data.data as ITopAssetResponse,
  });
}
