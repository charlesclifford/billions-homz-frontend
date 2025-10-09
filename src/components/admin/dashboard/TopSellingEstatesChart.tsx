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
import { useAdminTopSellingEstates } from "@/hooks/useDashboardStats";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

export function TopSellingEstatesChart() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedType, setSelectedType] = useState<"estate" | "property">(
    "estate"
  );

  const { data, isPending, error } = useAdminTopSellingEstates({
    year: selectedYear,
    limit: 3,
    type: selectedType,
  });

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  // Transform data for the chart
  const chartData = useMemo(() => {
    if (!data?.topAssets?.length) return [];

    return data.topAssets.map((asset, index) => ({
      name: asset.name,
      type: asset.assetType,
      value: asset.totalAmount,
      count: asset.salesCount,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [data]);

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value));
  };

  // Dynamic chart config based on data
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: "Sales Amount",
      },
    };

    chartData.forEach((asset, index) => {
      config[asset.name] = {
        label: `${asset.name} (${asset.type})`,
        color: `hsl(var(--chart-${index + 1}))`,
      };
    });

    return config;
  }, [chartData]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Assets</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-red-500">Failed to load data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex gap-4 flex-col">
        <div className="flex items-center gap-2 space-y-0 sm:flex-row w-full">
          <div className="grid flex-1 gap-1">
            <CardTitle>Top Selling Assets</CardTitle>
            <CardDescription>
              {data?.year
                ? `Showing top assets for ${data.year}`
                : "Loading..."}
            </CardDescription>
          </div>
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[80px] cursor-pointer rounded-lg sm:ml-auto">
              <SelectValue placeholder="Year" />
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
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-muted rounded-lg overflow-hidden w-full shadow-sm">
          <Button
            variant={selectedType === "estate" ? "default" : "ghost"}
            className="rounded-none text-xs px-3 flex-1"
            onClick={() => setSelectedType("estate")}
          >
            Estates
          </Button>
          <Button
            variant={selectedType === "property" ? "default" : "ghost"}
            className="rounded-none text-xs px-3 flex-1"
            onClick={() => setSelectedType("property")}
          >
            Properties
          </Button>
        </div>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="mr-1 animate-spin text-primary" />
              <span>Loading data...</span>
            </div>
          ) : (
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()} ₦`,
                      name,
                    ]}
                    className="capitalize"
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                paddingAngle={5}
                strokeWidth={5}
              >
                <Label
                  position="center"
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <g>
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {chartData.length}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Top
                            </tspan>
                          </text>
                        </g>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent />}
                className="capitalize flex flex-col gap-2"
              />
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
