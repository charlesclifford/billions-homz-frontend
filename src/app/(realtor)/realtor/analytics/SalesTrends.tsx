"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", sales: 2, commission: 4000000 },
  { month: "Feb", sales: 3, commission: 6000000 },
  { month: "Mar", sales: 5, commission: 8500000 },
  { month: "Apr", sales: 4, commission: 7200000 },
  { month: "May", sales: 6, commission: 9800000 },
  { month: "Jun", sales: 3, commission: 5500000 },
];

const SalesTrends = () => {
  return (
     <Card className="mt-4">
      <CardHeader>
        <CardTitle>Sales Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [
                `₦${Number(value).toLocaleString()}`,
                value === value ? "Commission" : "Sales"
              ]}
            />
            <Bar dataKey="commission" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default SalesTrends