"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useRealtorSalesPerformance } from "@/hooks/useRealtorStats";
import { formatCurrency } from "@/utils/helpers";

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

  const pieData = useMemo(() => {
    if (!salesPerformance?.topEstates) return [];

    return salesPerformance.topEstates.map((estate, index) => ({
      name: estate.estateName,
      value: estate.totalAmount,
      fill: `var(--color-chart-${index + 1})`,
    }));
  }, [salesPerformance]);

  const totalSalesAmount = useMemo(() => {
    return (
      salesPerformance?.monthlyData.reduce(
        (sum, m) => sum + m.salesAmount,
        0
      ) || 0
    );
  }, [salesPerformance]);

  return (
    <Tabs defaultValue="trends">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="trends">Sales Trends</TabsTrigger>
        <TabsTrigger value="estates">Top Estates</TabsTrigger>
      </TabsList>

      <TabsContent value="trends">
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
            {isPending ? (
              <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
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
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
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
                    type="monotone"
                    dataKey="salesCount"
                    stroke="var(--color-salesCount)"
                    fill="url(#fillCount)"
                    strokeWidth={1}
                    stackId="a"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="salesAmount"
                    stroke="var(--color-salesAmount)"
                    fill="url(#fillAmount)"
                    strokeWidth={1}
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="estates">
        <Card className="flex flex-col h-full">
          <CardHeader className="items-center pb-0">
            <CardTitle>Top Performing Estates</CardTitle>
            <CardDescription>
              {isPending
                ? "Loading data..."
                : `By total sales revenue in ${selectedYear}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pb-0 min-h-[300px]">
            {isPending ? (
              <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        formatter={(value) => [
                          formatCurrency(value as number),
                          "Revenue",
                        ]}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        stroke="var(--background)"
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-3xl font-bold"
                                  >
                                    {totalSalesAmount.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                  >
                                    Total Revenue
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={salesPerformance?.topEstates?.map((e) => ({
                        name: e.estateName,
                        revenue: e.totalAmount,
                        count: e.count,
                      }))}
                    >
                      <CartesianGrid horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <ChartTooltip
                        formatter={(value, name) => {
                          return name === "revenue"
                            ? [formatCurrency(value as number), "Revenue"]
                            : [value, "Sales Count"];
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="var(--color-chart-1)"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            {isPending ? null : (
              <div className="flex items-center gap-2 font-medium leading-none">
                <TrendingUp className="h-4 w-4" />
                Showing top {salesPerformance?.topEstates?.length || 0}{" "}
                performing estates
              </div>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default RealtorSalesPerformanceCharts;
