"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtorStats } from "@/hooks/useRealtorStats";
import React from "react";
import { OverviewChart } from "./OverviewChart";
import { RecentSales } from "./RecentSales";
import StatCard from "./StatCard";
import { CheckCircle, Clock, DollarSign, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardContent = () => {
  const router = useRouter();
  const { data: stats, isLoading, error } = useRealtorStats();

  console.log("stats>>>", stats);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[350px]" />
          <Skeleton className="col-span-3 h-[350px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={stats?.totalSales as number}
          icon={<FileText className="w-5 h-5" />}
          growth={stats?.salesGrowth}
          onClick={() => router.push(`/realtor/sales`)}
        />
        <StatCard
          title="Total Earnings"
          value={`₦${stats?.totalEarnings.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          growth={stats?.earningsGrowth}
          color="text-blue-600"
          onClick={() => router.push(`/realtor/commissions`)}
        />
        <StatCard
          title="Pending Commissions"
          value={`₦${stats?.pendingCommissions.toLocaleString()}`}
          icon={<Clock className="w-5 h-5" />}
          color="text-yellow-600"
          onClick={() => router.push(`/realtor/commisssions`)}
        />
        <StatCard
          title="Approved Commissions"
          value={`₦${stats?.approvedCommissions.toLocaleString()}`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-emerald-600"
          onClick={() => router.push(`/realtor/commisssions`)}
        />
      </div>
      {/* Requests Count */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequests as number}
          icon={<Clock className="w-5 h-5" />}
          color="text-orange-500"
        />
        <StatCard
          title="Approved Requests"
          value={stats?.approvedRequests as number}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-green-500"
        />
      </div>

      {/* Chart + Recent Sales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales & Commissions Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={stats?.salesChartData || []} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales sales={stats?.recentSales || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
