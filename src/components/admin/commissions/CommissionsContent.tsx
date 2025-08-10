"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { setFilter } from "@/store/features/commissions/commisson.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatCurrency, formatRate } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getPaginationRange } from "@/components/shared/DataTable";

const CommissionsContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.commission);
  const currentPage = filter.page || 1;
  const { commissions, isPending, error, totalCommissions, totalPages } =
    useAdminCommissions({ ...filter, status: undefined });

  const handlePageChange = (newPage: number) => {
    dispatch(setFilter({ page: newPage }));
  };

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
            <p>View and manage all realtor commissions</p>
            <p>
              {!isPending && commissions
                ? `
              Showing ${Math.min(
                (filter.page - 1) * filter.limit + 1,
                totalCommissions
              )} -
                ${Math.min(filter.page * filter.limit, totalCommissions)} of
                ${totalCommissions}
             sales
              `
                : "Loading commissions..."}
            </p>
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
                      <Badge
                        variant={
                          commission.paymentRequest.status === "approved"
                            ? "default"
                            : commission.paymentRequest.status === "requested"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {commission.paymentRequest?.status}
                      </Badge>
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

        {totalPages > 1 && (
          <CardFooter>
            <div className="text-sm text-muted-foreground text-nowrap">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination className="justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    isActive={currentPage > 1}
                    aria-disabled={currentPage <= 1}
                    className={cn(
                      "cursor-pointer",
                      currentPage <= 1 && "pointer-events-none opacity-50"
                    )}
                    size={"icon"}
                  />
                </PaginationItem>
                {getPaginationRange(currentPage, totalPages).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof page === "number") {
                          handlePageChange(page);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    isActive={currentPage < totalPages}
                    aria-disabled={currentPage >= totalPages}
                    className={cn(
                      "cursor-pointer",
                      currentPage >= totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                    size={"icon"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CommissionsContent;
