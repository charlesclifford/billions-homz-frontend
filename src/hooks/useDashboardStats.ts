"use client";

import {
  IDashboardSalesPerformance,
  IDashboardStats,
  ITopEstateResponse,
} from "@/interfaces/admin.interface";
import { SalesPerformanceFilter } from "@/interfaces/realtor.interface";
import {
  getDashboardStats,
  getSalesPerformance,
  getTopSellingEstates,
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
    queryFn: () => getTopSellingEstates(params),
    select: (data) => data.data as ITopEstateResponse,
  });
}
