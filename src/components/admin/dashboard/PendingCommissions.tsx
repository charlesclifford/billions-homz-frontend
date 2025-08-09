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
import { formatCurrency } from "@/utils/helpers";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function PendingCommissions() {
  const router = useRouter();
  const { commissions, isPending, error } = useAdminCommissions({
    page: 1,
    limit: 5,
    status: "pending",
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Commissions</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-500">Failed to load commissions</p>
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
        <CardTitle>Pending Commissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-sidebar dark:bg-background">
            <TableRow>
              <TableHead>Realtor</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="py-8 flex flex-col gap-2 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Loading pending commissions...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No pending commissions found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              commissions.map((commission) => (
                <TableRow key={commission._id}>
                  <TableCell>
                    <span className="capitalize">
                      {commission.realtor?.firstName}{" "}
                      {commission.realtor?.lastName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {commission.sale?.estate?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(commission.amount)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
