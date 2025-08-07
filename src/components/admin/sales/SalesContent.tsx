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
import useSales from "@/hooks/useSales";
import { formatCurrency } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { useRouter } from "next/navigation";
import SalesDetails from "./SalesDetails";
import { Loader2 } from "lucide-react";

const SalesContent = () => {
  const router = useRouter();
  const { sales, isPending, error } = useSales();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="text-center p-6">
          <h3 className="text-lg font-medium text-red-500">
            Failed to load sales
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
          <CardTitle>Sales Records</CardTitle>
          <CardDescription>View and manage all property sales</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Realtor</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <div className="py-8 flex flex-col gap-2 items-center justify-center">
                      <Loader2 className="animate-spin" />
                      Loading sales records...
                    </div>
                  </TableCell>
                </TableRow>
              ) : sales && sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    No sales records found
                  </TableCell>
                </TableRow>
              ) : (
                sales?.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>
                      <div className="capitalize">
                        {sale.estate?.name || "Unknown Property"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="capitalize">{sale.buyerName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="capitalize">
                          {sale.realtor
                            ? sale.realtor?.firstName +
                              " " +
                              sale.realtor?.lastName
                            : "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{sale.units}</TableCell>
                    <TableCell>{formatCurrency(sale.amountPaid)}</TableCell>
                    <TableCell>
                      <span className="capitalize">{sale.paymentType}</span>
                    </TableCell>
                    <TableCell>
                      {formatDate(sale.createdAt, "MMM dd, yyyy hh:mm a")}
                    </TableCell>

                    <TableCell>
                      <SalesDetails id={sale._id} />
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

export default SalesContent;
