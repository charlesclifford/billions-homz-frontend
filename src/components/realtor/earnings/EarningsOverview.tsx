"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EarningsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₦24,500,000</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₦7,500,000</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">12</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsOverview;
