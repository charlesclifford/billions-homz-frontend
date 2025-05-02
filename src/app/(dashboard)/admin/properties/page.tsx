import PropertiesContent from "@/components/admin/properties/PropertiesContent";
import PropertiesFilter from "@/components/admin/properties/PropertiesFilter";
import { HomeIcon } from "lucide-react";
import React from "react";

const PropertiesPage = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="border border-primary p-3 rounded-full shrink-0">
          <HomeIcon />
        </div>
        <h1 className="text-primary text-3xl font-medium">Properties</h1>
      </div>

      <div className="space-y-8">
        <PropertiesFilter />

        <div className="w-full">
          <PropertiesContent />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
