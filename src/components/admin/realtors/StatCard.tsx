import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  growth,
  color = "text-green-600",
  onClick,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  growth?: number;
  color?: string;
  onClick?: () => void;
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-6 w-6 ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {growth !== undefined && (
          <p className="text-xs text-muted-foreground">
            {growth >= 0 ? "+" : ""}
            {growth}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
