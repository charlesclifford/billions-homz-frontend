import CommissionsTable from "@/components/realtor/commissions/CommissionsTable";
import React from "react";

const ComissionsPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Commissions</h1>
      <CommissionsTable />
    </div>
  );
};

export default ComissionsPage;
