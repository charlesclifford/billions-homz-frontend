import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import { PendingApprovals } from "@/components/admin/dashboard/PendingApprovals";
import { PendingCommissions } from "@/components/admin/dashboard/PendingCommissions";
import { SalesPerformanceChart } from "@/components/admin/dashboard/SalesPerformanceChart";
import { RecentPropertiesTable } from "@/components/admin/dashboard/RecentPropertiesTable";
import { StatsGrid } from "@/components/admin/dashboard/StatsGrid";
import { TopSellingEstatesChart } from "@/components/admin/dashboard/TopSellingEstatesChart";
import { RecentEstatesTable } from "@/components/admin/dashboard/RecentEstatesTable";

const OverviewPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader />
      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="col-span-1 lg:col-span-7">
          <SalesPerformanceChart />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <TopSellingEstatesChart />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEstatesTable />
        <RecentPropertiesTable />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingCommissions />
        <PendingApprovals />
      </div>
    </div>
  );
};

export default OverviewPage;
