"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export function StatsGrid() {
  const { data, isPending } = useDashboardStats();

  const totalProperties = data?.totalProperties;
  const available = data?.available;
  const totalSold = data?.sold.total;
  const availableProgress = data?.availablePercentage;
  const soldProgress = data?.sold.percentage;

  const statsData = [
    {
      title: "Total Properties",
      value: totalProperties,
      description: "All listed estates",
    },
    {
      title: "Available",
      value: available,
      description: `${data?.availablePercentage}% of total`,
      progress: availableProgress,
    },
    {
      title: "Sold Units",
      value: totalSold,
      description: `${data?.sold.percentage}% of total`,
      progress: soldProgress,
    },
    {
      title: "Total Revenue",
      value: `₦${data?.totalRevenue.toLocaleString()}`,
      description: "From all sales",
    },
    {
      title: "Pending Approvals",
      value: data?.requested,
      description: "Pending commission requests",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
  );
}
