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
import { Skeleton } from "@/components/ui/skeleton";
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
import { setTabPage } from "@/store/features/commissions/commisson.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatCurrency, formatRate } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { useRouter } from "next/navigation";
import { RequestPayoutButton } from "./RequestPayoutButton";

interface RealtorCommissionsTableProps {
  title?: string;
  description?: string;
  headers: string[];
  status: StatusType;
}

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
  const limit = tabPagination[status]?.limit || 10;

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
    limit,
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

  // Helper function to get asset name based on type
  const getAssetName = (commission: ICommission) => {
    if (commission.sale.assetType === "property" && commission.sale.property) {
      return commission.sale.property.title || "Unknown Property";
    } else if (
      commission.sale.assetType === "estate" &&
      commission.sale.estate
    ) {
      return commission.sale.estate.name || "Unknown Estate";
    }
    return "Unknown Asset";
  };

  // Helper function to get asset type display
  const getAssetTypeDisplay = (commission: ICommission) => {
    if (commission.sale.assetType === "property") {
      return "Property";
    } else if (commission.sale.assetType === "estate") {
      return "Estate";
    }
    return "Unknown";
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

  const renderTableCell = (
    commission: ICommission,
    header: string,
    idx: number
  ) => {
    switch (header) {
      case "S/N":
        return <div>{(currentPage - 1) * limit + idx + 1}</div>;
      case "Asset Type":
        return (
          <span className="capitalize">{getAssetTypeDisplay(commission)}</span>
        );
      case "Asset Name":
        return <span className="capitalize">{getAssetName(commission)}</span>;
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
            className={cn(
              statusClassMap[commission.paymentRequest?.status] ||
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
              "capitalize"
            )}
          >
            {commission.paymentRequest?.status}
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
          ? formatDate(
              commission.paymentRequest.processedAt,
              "MMM dd, yyyy hh:mm a"
            )
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
              (!isPending && commissions ? (
                <p>
                  {`Showing ${commissions.length} of ${totalCommissions} commissions`}
                </p>
              ) : (
                <Skeleton className="h-4 w-40 mt-1" />
              ))}
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
                [...Array(headers.length)].map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {[...Array(10)].map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
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
                commissions.map((commission, idx) => (
                  <TableRow key={commission._id}>
                    {headers.map((header) => (
                      <TableCell key={`${commission._id}-${header}`}>
                        {renderTableCell(commission, header, idx)}
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
