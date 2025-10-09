"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StatsGrid() {
  const { data, isPending } = useDashboardStats();
  const [view, setView] = useState<"estates" | "properties">("estates");

  const isEstates = view === "estates";
  const group = isEstates ? data?.estates : data?.properties;

  const soldValue =
    view === "estates"
      ? data?.estates?.soldUnits ?? 0
      : data?.properties?.sold ?? 0;

  const statsData = [
    {
      title: "Total",
      value: group?.total,
      description: `All listed ${view}`,
    },
    {
      title: "Available",
      value: group?.available,
      description: `${group?.availablePercentage ?? 0}% available`,
      progress: group?.availablePercentage,
    },
    {
      title: "Sold Units",
      value: soldValue,
      description: `${group?.soldPercentage ?? 0}% of total`,
      progress: group?.soldPercentage,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(data?.totalRevenue ?? 0),
      description: "From all sales",
    },
    {
      title: "Pending Approvals",
      value: data?.pendingCommissionRequests ?? 0,
      description: "Pending commission requests",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex justify-end">
        <div className="inline-flex items-center gap-1 bg-muted rounded-lg overflow-hidden shadow-sm">
          <Button
            className={cn("text-xs rounded-none px-4")}
            variant={view === "estates" ? "default" : "ghost"}
            onClick={() => setView("estates")}
          >
            Estates
          </Button>
          <Button
            variant={view === "properties" ? "default" : "ghost"}
            className={cn("text-xs rounded-none px-4")}
            onClick={() => setView("properties")}
          >
            Properties
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <div className="space-y-1">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  {stat.progress !== undefined && (
                    <Progress value={stat.progress} className="h-2 mt-2" />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
