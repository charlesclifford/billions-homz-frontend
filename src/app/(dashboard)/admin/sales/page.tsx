import SalesContent from "@/components/admin/sales/SalesContent";
import SalesFilter from "@/components/admin/sales/SalesFilter";
import SalesHeader from "@/components/admin/sales/SalesHeader";
import React from "react";

const SalesPage = () => {
  return (
    <div className="w-full">
      <SalesHeader />
      <div className="space-y-8">
        <SalesFilter />
        <div className="w-full">
          <SalesContent />
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
