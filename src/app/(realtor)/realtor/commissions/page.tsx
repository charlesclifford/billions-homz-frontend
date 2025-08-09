import RealtorCommissionContent from "@/components/realtor/commissions/RealtorCommissionContent";
import RealtorCommissionsHeader from "@/components/realtor/commissions/RealtorCommissionsHeader";

const ComissionsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <RealtorCommissionsHeader />
      {/* <RealtorCommissionsFilter /> */}
      <RealtorCommissionContent />
    </div>
  );
};

export default ComissionsPage;
