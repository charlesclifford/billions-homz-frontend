import { Button } from "@/components/ui/button";
import React from "react";

const DashboardHeader = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-center">
      <div className="col-span-1">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your real estate platform
        </p>
      </div>
      <div className="col-span-1 flex items-center gap-2 lg:justify-end justify-between">
        <Button variant="outline">Export Reports</Button>
        <Button>Add Property</Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
