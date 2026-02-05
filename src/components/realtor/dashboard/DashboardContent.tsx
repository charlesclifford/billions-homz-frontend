"use client";
import { useRealtorStats } from "@/hooks/useRealtorStats";
import { formatCurrency } from "@/utils/helpers";
import { CheckCircle, Clock, FileText, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "./StatCard";
import RealtorSalesPerformanceCharts from "./RealtorsSalesPerformanceCharts";

const DashboardContent = () => {
  const router = useRouter();
  const { data: stats, isPending, error } = useRealtorStats();

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Earnings"
          value={formatCurrency(stats?.totalEarnings as number)}
          icon={<Wallet />}
          // growth={stats?.earningsGrowth}
          color="text-purple-600"
          onClick={() => router.push(`/realtor/earnings`)}
          loading={isPending}
        />
        <StatCard
          title="Total Sales"
          value={stats?.soldPropertiesCount as number}
          icon={<FileText className="w-5 h-5" />}
          // growth={stats?.salesGrowth}
          onClick={() => router.push(`/realtor/sales`)}
          loading={isPending}
        />
        <StatCard
          title="Pending Commissions"
          value={formatCurrency(stats?.pendingCommissions as number)}
          icon={<Clock className="w-5 h-5" />}
          color="text-yellow-600"
          onClick={() => router.push(`/realtor/commissions`)}
          loading={isPending}
        />
        <StatCard
          title="Assigned Properties"
          value={stats?.availablePropertiesCount as number}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-emerald-600"
          onClick={() => router.push(`/realtor/listings`)}
          loading={isPending}
        />
      </div>

      {/* Charts Section */}
      <RealtorSalesPerformanceCharts />
    </div>
  );
};

export default DashboardContent;
