"use client";
import { getPaginationRange } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAdminCommissions from "@/hooks/useAdminCommissions";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/commissions/commisson.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatCurrency, formatRate } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { useRouter } from "next/navigation";
import ApproveCommission from "./ApproveCommission";
import ConfirmPayout from "./ConfirmPayout";

const statusClassMap = {
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  requested:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
  approved:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  paid: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  processed:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
} as const;

const CommissionsContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.commission);
  const currentPage = filter.page || 1;
  const { commissions, isPending, error, totalCommissions, totalPages } =
    useAdminCommissions({ ...filter });

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
          <CardDescription>
            {!isPending && commissions ? (
              <p>
                {`
              Showing ${Math.min(
                (filter.page - 1) * filter.limit + 1,
                totalCommissions
              )} -
                ${Math.min(filter.page * filter.limit, totalCommissions)} of
                ${totalCommissions}
             sales
              `}
              </p>
            ) : (
              <Skeleton className="h-4 w-40 mt-1" />
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-sidebar dark:bg-background">
              <TableRow>
                <TableHead>S/N</TableHead>
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
                [...Array(5)].map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {[...Array(9)].map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : commissions && commissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No commission records found
                  </TableCell>
                </TableRow>
              ) : (
                commissions?.map((commission, idx) => (
                  <TableRow key={commission._id}>
                    <TableCell>
                      <div>{(filter.page - 1) * filter.limit + idx + 1}</div>
                    </TableCell>
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
                      {formatRate(commission.rate, {
                        decimalPlaces: 0,
                      })}
                    </TableCell>
                    <TableCell>{formatCurrency(commission.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          statusClassMap[commission.paymentRequest?.status] ||
                            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
                          "capitalize"
                        )}
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
                      {commission.paymentRequest?.status === "approved" && (
                        <ConfirmPayout commission={commission} />
                      )}
                      {commission.paymentRequest?.status === "requested" && (
                        <ApproveCommission commission={commission} />
                      )}
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
