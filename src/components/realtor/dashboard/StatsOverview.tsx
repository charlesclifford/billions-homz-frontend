"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const stats = [
  {
    title: "Total Commission",
    value: "₦24,500,000",
    change: "+12%",
    icon: TrendingUp,
  },
  {
    title: "Pending Payments",
    value: "₦7,500,000",
    change: "+5%",
    icon: TrendingUp,
  },
  { title: "Active Deals", value: "8", change: "-2%", icon: TrendingDown },
  { title: "Avg. Payout", value: "₦2,450,000", change: "+8%", icon: Wallet },
];

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.change.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
