"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const statsData = [
  {
    title: "Total Properties",
    value: 247,
    description: "+12% from last month",
    progress: null,
  },
  {
    title: "Available",
    value: 189,
    description: "76.5% of inventory",
    progress: 76.5,
  },
  {
    title: "Sold",
    value: 45,
    description: "18.2% of inventory",
    progress: 18.2,
  },

  {
    title: "Total Revenue",
    value: "$12.5M",
    description: "+24% from last quarter",
    progress: null,
  },
  {
    title: "Pending Approvals",
    value: 7,
    description: "Require attention",
    progress: null,
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            {stat.progress && (
              <Progress value={stat.progress} className="h-2 mt-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
