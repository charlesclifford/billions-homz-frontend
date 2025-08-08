import CommissionsContent from "@/components/admin/commissions/CommissionsContent";
import CommissionsHeader from "@/components/admin/commissions/CommissionsHeader";
import React from "react";

const CommissionsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <CommissionsHeader />

      <CommissionsContent />
    </div>
  );
};

export default CommissionsPage;
