import SalesPipeline from "@/components/realtor/sales/SalesPipeline";
import React from "react";

const SalesPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sales Pipeline</h1>
      <SalesPipeline />
    </div>
  );
};

export default SalesPage;
