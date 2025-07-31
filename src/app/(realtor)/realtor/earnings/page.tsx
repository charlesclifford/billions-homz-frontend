import EarningsOverview from "@/components/realtor/earnings/EarningsOverview";
import PaymentHistory from "@/components/realtor/earnings/PaymentHistory";
import React from "react";

const EarningsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Earnings Overview</h1>
      <EarningsOverview />
      <PaymentHistory />
    </div>
  );
};

export default EarningsPage;
