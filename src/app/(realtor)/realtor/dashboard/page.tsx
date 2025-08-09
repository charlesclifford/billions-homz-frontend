import DashboardContent from "@/components/realtor/dashboard/DashboardContent";

const RealtorDashoard = () => {
  return (
    <div className="space-y-4">
      <div className="col-span-1">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview
        </p>
      </div>

      <DashboardContent />
    </div>
  );
};

export default RealtorDashoard;
