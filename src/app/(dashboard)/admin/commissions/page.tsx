import CommissionFilter from "@/components/admin/commissions/CommissionFilter";
import CommissionsContent from "@/components/admin/commissions/CommissionsContent";
import CommissionsHeader from "@/components/admin/commissions/CommissionsHeader";
import React from "react";

const CommissionsPage = () => {
  return (
    <div className="w-full">
      <CommissionsHeader />

      <div className="space-y-8">
        <CommissionFilter />
        <div>
          <CommissionsContent />
        </div>
      </div>
    </div>
  );
};

export default CommissionsPage;
