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
import { useRealtorSalesPerformance } from "@/hooks/useRealtorStats";
import { formatCurrency } from "@/utils/helpers";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  salesCount: {
    label: "Sales Count",
    color: "hsl(var(--chart-1))",
  },
  salesAmount: {
    label: "Sales Amount (₦)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const RealtorSalesPerformanceCharts = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const { data: salesPerformance, isPending } = useRealtorSalesPerformance({
    year: selectedYear,
  });

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  // Format data for charts
  const formattedData = useMemo(() => {
    if (!salesPerformance?.monthlyData) return [];

    return salesPerformance.monthlyData.map((month) => ({
      name: month.name,
      salesCount: month.salesCount,
      salesAmount: month.salesAmount,
    }));
  }, [salesPerformance]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-left">
          <CardTitle>Monthly Sales Performance</CardTitle>
          <CardDescription>
            {isPending
              ? "Loading data..."
              : `Showing sales data for ${selectedYear}`}
          </CardDescription>
        </div>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="w-[80px] rounded-lg sm:ml-auto cursor-pointer">
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 min-h-[300px]">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {isPending ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : (
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-salesCount)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-salesCount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-salesAmount)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-salesAmount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    // formatter={(value, name) => {
                    //   return name === "salesAmount"
                    //     ? [formatCurrency(value as number), "Sales Amount"]
                    //     : [value, "Sales Count"];
                    // }}
                    indicator="dot"
                  />
                }
              />
              <Area
                yAxisId="left"
                dataKey="salesCount"
                type="monotone"
                stroke="var(--color-salesCount)"
                fill="url(#fillCount)"
                strokeWidth={1}
              />
              <Area
                yAxisId="right"
                dataKey="salesAmount"
                type="monotone"
                stroke="var(--color-salesAmount)"
                fill="url(#fillAmount)"
                strokeWidth={1}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RealtorSalesPerformanceCharts;
