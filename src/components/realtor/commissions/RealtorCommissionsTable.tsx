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
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRealtorCommissions } from "@/hooks/useRealtorCommissions";
import { ICommission, StatusType } from "@/interfaces/commission.interface";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatCurrency, formatRate } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { RequestPayoutButton } from "./RequestPayoutButton";
import { setTabPage } from "@/store/features/commissions/commisson.slice";

interface RealtorCommissionsTableProps {
  title?: string;
  description?: string;
  headers: string[];
  status: StatusType;
}

const RealtorCommissionsTable = ({
  title,
  description,
  headers,
  status,
}: RealtorCommissionsTableProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tabPagination } = useAppSelector((state) => state.commission);
  const currentPage = tabPagination[status]?.page || 1;

  const {
    commissions,
    isPending,
    error,
    totalCommissions,
    totalPages,
    refetch,
  } = useRealtorCommissions({
    page: currentPage,
    status,
    limit: tabPagination[status]?.limit || 10,
  });

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);
  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  // const handlePageChange = (newPage: number) => {
  //   router.push(
  //     `/realtor/commissions?${createQueryString(pageParam, newPage.toString())}`
  //   );
  // };

  const handlePageChange = (newPage: number) => {
    dispatch(setTabPage({ status, page: newPage }));
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

  const renderTableCell = (commission: ICommission, header: string) => {
    switch (header) {
      case "Estate":
        return (
          <span className="capitalize">
            {commission.sale.estate?.name || "N/A"}
          </span>
        );
      case "Buyer":
        return commission.sale?.buyerName || "N/A";
      case "Sale Amount":
        return formatCurrency(commission.sale?.amountPaid);
      case "Commission Rate":
        return formatRate(commission.rate, { decimalPlaces: 0 });
      case "Commission Amount":
        return formatCurrency(commission.amount);
      case "Status":
        return (
          <Badge
            variant={
              commission.paymentRequest.status === "approved"
                ? "default"
                : commission.paymentRequest.status === "requested"
                ? "secondary"
                : "outline"
            }
            className="capitalize"
          >
            {commission.paymentRequest.status}
          </Badge>
        );
      case "Date":
        return formatDate(commission.createdAt || new Date(), "MMM dd, yyyy");
      case "Request Date":
        return formatDate(
          commission.paymentRequest.requestedAt || new Date(),
          "MMM dd, yyyy"
        );
      case "Payment Date":
        return commission.paymentRequest?.processedAt
          ? formatDate(commission.paymentRequest.processedAt, "MMM dd, yyyy")
          : "N/A";
      case "Action":
        return (
          <RequestPayoutButton
            commissionId={commission._id}
            disabled={commission.paymentRequest.status !== "pending"}
          />
        );
      case "Details":
        return (
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        );
      default:
        return "N/A";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col ">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description ||
              (!isPending && commissions
                ? `Showing ${commissions.length} of ${totalCommissions} commissions`
                : "Loading your commission history...")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-sidebar dark:bg-background">
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={headers.length}>
                    <div className="py-8 flex flex-col gap-2 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Loading commission records...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : commissions && commissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="text-center py-8"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">
                        No commission records found
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => refetch()}
                      >
                        Refresh
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                commissions.map((commission) => (
                  <TableRow key={commission._id}>
                    {headers.map((header) => (
                      <TableCell key={`${commission._id}-${header}`}>
                        {renderTableCell(commission, header)}
                      </TableCell>
                    ))}
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

export default RealtorCommissionsTable;
