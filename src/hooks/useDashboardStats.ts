"use client"

import { IDashboardStats } from "@/interfaces/admin.interface";
import { getDashboardStats } from "@/lib/api/admin";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    select: (data) => data.data as IDashboardStats,
  });
}