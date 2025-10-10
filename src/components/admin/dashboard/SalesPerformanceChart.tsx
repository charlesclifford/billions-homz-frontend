"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminSalesPerformance } from "@/hooks/useDashboardStats";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function SalesPerformanceChart() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [viewMode, setViewMode] = useState<"count" | "revenue">("count");

  const { data: salesPerformance, isPending } = useAdminSalesPerformance({
    year: selectedYear,
  });

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  // Transform the monthly data for the chart
  const chartData = useMemo(() => {
    if (!salesPerformance?.monthlyData) return [];

    return salesPerformance.monthlyData.map((m) => ({
      month: m.name,
      estates: m.estates,
      properties: m.properties,
      totalAmount: m.totalAmount,
    }));
  }, [salesPerformance]);

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value));
  };

  const chartConfig = {
    estates: {
      label: "Estates Sold",
      color: "hsl(var(--chart-1))",
    },
    properties: {
      label: "Properties Sold",
      color: "hsl(var(--chart-2))",
    },
    totalAmount: {
      label: "Total Sales (₦)",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-start gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>
            {viewMode === "count"
              ? `Estates and properties sold in ${
                  salesPerformance?.year || selectedYear
                }`
              : `Total revenue for ${salesPerformance?.year || selectedYear}`}
          </CardDescription>
        </div>

        <div className="flex gap-4 flex-col items-end">
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[80px] cursor-pointer rounded-lg sm:ml-auto">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {yearOptions.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="rounded-lg"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Toggle Buttons */}
          <div className="flex bg-muted rounded-lg overflow-hidden shadow-sm">
            <Button
              variant={viewMode === "count" ? "default" : "ghost"}
              className="rounded-none text-xs px-4"
              onClick={() => setViewMode("count")}
            >
              Count
            </Button>
            <Button
              variant={viewMode === "revenue" ? "default" : "ghost"}
              className="rounded-none text-xs px-4"
              onClick={() => setViewMode("revenue")}
            >
              Revenue
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {isPending ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="mr-1 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillEstates" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillProperties" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillTotalAmount"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-3))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-3))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis hide />

              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />

              {viewMode === "count"
                ? [
                    <Area
                      key="estates"
                      type="monotone"
                      dataKey="estates"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#fillEstates)"
                      strokeWidth={2}
                      name="Estates"
                    />,
                    <Area
                      key="properties"
                      type="monotone"
                      dataKey="properties"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#fillProperties)"
                      strokeWidth={2}
                      name="Properties"
                    />,
                  ]
                : [
                    <Area
                      key="revenue"
                      type="monotone"
                      dataKey="totalAmount"
                      stroke="hsl(var(--chart-3))"
                      fill="url(#fillTotalAmount)"
                      strokeWidth={2}
                      name="Total Revenue (₦)"
                    />,
                  ]}

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
