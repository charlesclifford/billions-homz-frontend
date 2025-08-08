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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAdminCommissions from "@/hooks/useAdminCommissions";
import { formatCurrency, formatRate } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const CommissionsContent = () => {
  const router = useRouter();
  const { commissions, isPending, error } = useAdminCommissions();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="text-center p-6">
          <h3 className="text-lg font-medium text-red-500">
            Failed to load commissions
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error.message || "Please try again later"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.refresh()}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col">
          <CardTitle>Commissions Records</CardTitle>
          <CardDescription>
            View and manage all realtor commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-sidebar dark:bg-background">
              <TableRow>
                <TableHead>Realtor</TableHead>
                <TableHead>Estate</TableHead>
                <TableHead>Sale Amount</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Commission Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="py-8 flex flex-col gap-2 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      Loading commission records...
                    </div>
                  </TableCell>
                </TableRow>
              ) : commissions && commissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No commission records found
                  </TableCell>
                </TableRow>
              ) : (
                commissions?.map((commission) => (
                  <TableRow key={commission._id}>
                    <TableCell>
                      <div className="capitalize">
                        {commission.realtor?.firstName}{" "}
                        {commission.realtor?.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize">
                        {commission.sale?.estate?.name || "Unknown Property"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(commission.sale?.amountPaid)}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {formatRate(commission.rate, {
                        decimalPlaces: 0,
                      })}
                    </TableCell>
                    <TableCell>{formatCurrency(commission.amount)}</TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {commission.paymentRequest?.status || "pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDate(
                        commission.createdAt || new Date(),
                        "MMM dd, yyyy hh:mm a"
                      )}
                    </TableCell>
                    <TableCell>
                      {/* TODO: Implement CommissionDetails similar to SalesDetails */}
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionsContent;
