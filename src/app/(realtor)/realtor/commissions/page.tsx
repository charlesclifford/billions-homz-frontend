import RealtorCommissionsHeader from "@/components/realtor/commissions/RealtorCommissionsHeader";
import RealtorCommissionsTable from "@/components/realtor/commissions/RealtorCommissionsTable";

const ComissionsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <RealtorCommissionsHeader />
      {/* <RealtorCommissionsFilter /> */}
      <RealtorCommissionsTable />
    </div>
  );
};

export default ComissionsPage;
