import RealtorHeader from "@/components/admin/realtors/RealtorHeader";
import RealtorsFilter from "@/components/admin/realtors/RealtorsFilter";
import RealtorsTable from "@/components/admin/realtors/RealtorsTable";
import React from "react";

const RealtorsPage = () => {
  return (
    <div className="w-full">
      <RealtorHeader />

      <div className="space-y-8">
        <RealtorsFilter />

        <div className="w-full">
          <RealtorsTable />
        </div>
      </div>
    </div>
  );
};

export default RealtorsPage;
