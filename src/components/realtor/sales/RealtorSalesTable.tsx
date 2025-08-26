"use client";
import { getPaginationRange } from "@/components/shared/DataTable";
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
import { useRealtorsales } from "@/hooks/useRealtorSales";
import { ISale } from "@/interfaces/sales.interface";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const RealtorSalesTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const { sales, isPending, error, refetch, totalPages, totalSales, limit } =
    useRealtorsales({ page: currentPage });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (newPage: number) => {
    router.push(
      `/realtor/sales?${createQueryString("page", newPage.toString())}`
    );
  };

  // Helper function to get asset name based on type
  const getAssetName = (sale: ISale) => {
    if (sale.assetType === "property" && sale.property) {
      return sale.property.title || "Unknown Property";
    } else if (sale.assetType === "estate" && sale.estate) {
      return sale.estate.name || "Unknown Estate";
    }
    return "Unknown Asset";
  };

  // Helper function to get asset type display
  const getAssetTypeDisplay = (sale: ISale) => {
    if (sale.assetType === "property") {
      return "Property";
    } else if (sale.assetType === "estate") {
      return "Estate";
    }
    return "Unknown";
  };

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
        <CardHeader className="flex flex-col ">
          <CardTitle>My Sales</CardTitle>
          <CardDescription>
            {!isPending && sales ? (
              <p>{`Showing ${sales.length} of ${totalSales} sales`} </p>
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
                <TableHead>Asset Type</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Date of Purchase</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                [...Array(5)].map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {[...Array(10)].map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : sales && sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">
                        No sales records found
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
                sales.map((sale, idx) => (
                  <TableRow key={sale._id}>
                    <TableCell>
                      <div>{(currentPage - 1) * limit + idx + 1}</div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize">
                        {getAssetTypeDisplay(sale)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize">{getAssetName(sale)}</div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{sale.buyerName}</span>
                    </TableCell>
                    <TableCell>{sale.units}</TableCell>
                    <TableCell>{formatCurrency(sale.amountPaid)}</TableCell>
                    <TableCell>
                      {formatDate(sale.dateSold, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{sale.paymentType}</span>
                    </TableCell>
                    <TableCell>
                      {formatDate(sale.createdAt, "MMM dd, yyyy hh:mm a")}
                    </TableCell>
                    <TableCell>
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

export default RealtorSalesTable;
