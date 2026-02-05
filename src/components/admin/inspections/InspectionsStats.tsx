"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getInspectionStats } from "@/lib/api/inspections";
import { ClipboardList, Clock3, CheckCircle2, XCircle } from "lucide-react";
import React from "react";

interface InspectionStatsResponse {
  stats: { _id: string; count: number }[];
  total: number;
}

interface StatItem {
  title: string;
  value: number | string | undefined;
  icon: React.ReactNode;
}

const InspectionsStats = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["inspectionStats"],
    queryFn: getInspectionStats,
    select: (res) => res.data as InspectionStatsResponse,
  });

  const total = data?.total ?? 0;

  const counts: Record<string, number> = {};
  data?.stats?.forEach((item) => {
    counts[item._id] = item.count;
  });

  const inspectionStatsData: StatItem[] = [
    {
      title: "Total Inspections",
      value: total,
      icon: <ClipboardList className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "Pending Inspections",
      value: counts["Pending"] ?? 0,
      icon: <Clock3 className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "Confirmed Inspections",
      value: counts["Confirmed"] ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: "Cancelled Inspections",
      value: counts["Cancelled"] ?? 0,
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
    },
  ];

  if (error) {
    return (
      <div className="text-red-600 text-sm">Error loading inspection stats</div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {inspectionStatsData.map((stat, idx) => (
        <Card key={idx}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{stat.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InspectionsStats;
