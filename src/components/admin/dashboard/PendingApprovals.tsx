"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function PendingApprovals() {
  const router = useRouter();
  const { commissions, isPending, error } = useAdminCommissions({
    page: 1,
    limit: 5,
    status: "requested",
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-500">Failed to load pending approvals</p>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-sidebar dark:bg-background">
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Commission Rate</TableHead>
              <TableHead>Commission Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="py-8 flex flex-col gap-2 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Loading pending approvals...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No pending approvals found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              commissions.map((commission) => (
                <TableRow key={commission._id}>
                  <TableCell>
                    <span className="capitalize">
                      {commission.sale?.estate?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {commission.realtor?.firstName}{" "}
                      {commission.realtor?.lastName}
                    </span>
                  </TableCell>
                  <TableCell>{formatRate(commission.rate)}</TableCell>
                  <TableCell>{formatCurrency(commission.amount)}</TableCell>
                  <TableCell>
                    {commission.paymentRequest.requestedAt
                      ? formatDate(
                          commission.paymentRequest.requestedAt,
                          "MMM dd, yyyy  hh:mm a"
                        )
                      : "N/A"}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      {commission.paymentRequest?.status === "requested" && (
                        <Button size="sm" className="cursor-pointer">
                          Approve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
