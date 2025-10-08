import InspectionsContent from "@/components/admin/inspections/InspectionsContent";
import InspectionsHeader from "@/components/admin/inspections/InspectionsHeader";
import React from "react";

const InspectionsPage = () => {
  return (
    <div className="w-full">
      <InspectionsHeader />

      <div className="space-y-8">
        {/* <InspectionFilter /> */}

        <div>
          <InspectionsContent />
        </div>
      </div>
    </div>
  );
};

export default InspectionsPage;
