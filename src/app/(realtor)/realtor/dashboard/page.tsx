import RecentSales from "@/components/realtor/dashboard/RecentSales";
import SalesChart from "@/components/realtor/dashboard/SalesChart";
import StatsOverview from "@/components/realtor/dashboard/StatsOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const RealtorDashoard = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sales Dashboard</h1>

      <StatsOverview />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealtorDashoard;
