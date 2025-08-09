"use client";

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
import { formatCurrency } from "@/utils/helpers";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function SalesPerformanceChart() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
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

    return salesPerformance.monthlyData.map((monthData) => ({
      month: monthData.name,
      total: monthData.salesAmount,
      count: monthData.salesCount,
    }));
  }, [salesPerformance]);

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value));
  };

  const chartConfig = {
    total: {
      label: "Total Sales (₦)",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Sales Count",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>
            Monthly sales for {salesPerformance?.year || selectedYear}
          </CardDescription>
        </div>
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
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {isPending ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="mr-1 animate-spin text-primary" />
              Loading data...
            </div>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
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
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    // valueFormatter={(value) => formatCurrency(value)}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                stroke="hsl(var(--chart-1))"
              />

              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillCount)"
                stroke="hsl(var(--chart-2))"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
