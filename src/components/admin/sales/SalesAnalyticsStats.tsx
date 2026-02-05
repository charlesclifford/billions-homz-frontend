"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ISalesAnalytics } from "@/interfaces/sales.interface";
import { getSalesAnalytics } from "@/lib/api/sales";
import { formatCurrency } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Building2, DollarSign, Home } from "lucide-react";

export function SalesAnalyticsStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["salesAnalytics"],
    queryFn: getSalesAnalytics,
    select: (res) => res.data as ISalesAnalytics,
  });

  const salesStatsData = [
    {
      title: "Estate Sales",
      value: data?.estateSales,
      icon: <Building2 className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "Property Sales",
      value: data?.propertySales,
      icon: <Home className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(data?.totalRevenue as number),
      icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "Commission Paid",
      value: formatCurrency(data?.totalCommission as number),
      icon: <BarChart className="w-5 h-5 text-purple-500" />,
    },
  ];

  if (error) {
    return <div>Error loading sales stats</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {salesStatsData.map((stat, idx) => (
        <Card key={idx} className="">
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
}
