"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { name: "Total Sales", value: "₦48,750,000", change: "+12%", trend: "up" },
  { name: "Closed Deals", value: "18", change: "+5%", trend: "up" },
  { name: "Conversion Rate", value: "32%", change: "-2%", trend: "down" },
  { name: "Avg. Commission", value: "₦2,708,333", change: "+8%", trend: "up" },
];

const PerformanceMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.name}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div
              className={`text-xs ${
                metric.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {metric.change} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceMetrics;
