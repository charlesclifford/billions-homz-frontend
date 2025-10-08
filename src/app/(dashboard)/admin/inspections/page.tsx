import InspectionsContent from "@/components/admin/inspections/InspectionsContent";
import InspectionsFilter from "@/components/admin/inspections/InspectionsFilter";
import InspectionsHeader from "@/components/admin/inspections/InspectionsHeader";
import InspectionsStats from "@/components/admin/inspections/InspectionsStats";
import React from "react";

const InspectionsPage = () => {
  return (
    <div className="w-full">
      <InspectionsHeader />
      <InspectionsStats />

      <div className="space-y-8">
        <InspectionsFilter />

        <div>
          <InspectionsContent />
        </div>
      </div>
    </div>
  );
};

export default InspectionsPage;
