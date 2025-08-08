"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtorStats } from "@/hooks/useRealtorStats";
import { formatCurrency } from "@/utils/helpers";

const EarningsOverview = () => {
  const { data: stats, isPending } = useRealtorStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Earnings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold">
                {formatCurrency(stats?.totalEarnings as number)}
              </p>
              <p className="text-xs text-muted-foreground">
                +{stats?.earningsGrowth}% from last period
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pending Payments Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold">
                {formatCurrency(stats?.pendingCommissions as number)}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats?.pendingRequests} pending requests
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Total Sales Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold">{stats?.totalSales}</p>
              <p className="text-xs text-muted-foreground">
                +{stats?.salesGrowth}% from last period
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsOverview;
