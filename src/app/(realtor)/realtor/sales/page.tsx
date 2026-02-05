import RealtorSalesContent from "@/components/realtor/sales/RealtorSalesTable";
import RealtorSalesHeader from "@/components/realtor/sales/RealtorSalesHeader";

const SalesPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <RealtorSalesHeader />
      <RealtorSalesContent />
    </div>
  );
};

export default SalesPage;
