import PerformanceMetrics from "@/components/realtor/analytics/PerformanceMetrics";
import React from "react";
import SalesTrends from "./SalesTrends";

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Performance Analytics</h1>
      <PerformanceMetrics />
      <SalesTrends />
    </div>
  );
};

export default AnalyticsPage;
