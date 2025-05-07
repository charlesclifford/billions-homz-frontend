import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import { PendingApprovals } from "@/components/admin/dashboard/PendingApprovals";
import { PendingCommissions } from "@/components/admin/dashboard/PendingCommissions";
import { PropertyCharts } from "@/components/admin/dashboard/PropertyCharts";
import { RecentPropertiesTable } from "@/components/admin/dashboard/RecentPropertiesTable";
import { StatsGrid } from "@/components/admin/dashboard/StatsGrid";

const OverviewPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader />
      <StatsGrid />
      <PropertyCharts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPropertiesTable />
        <PendingCommissions />
      </div>
      <PendingApprovals />
    </div>
  );
};

export default OverviewPage;
