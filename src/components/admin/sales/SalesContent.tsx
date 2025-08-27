"use client";
import { getPaginationRange } from "@/components/shared/DataTable";
import { EmptyTableState } from "@/components/shared/EmptyTableState";
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
import useSales from "@/hooks/useSales";
import { ISale } from "@/interfaces/sales.interface";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/sales/sale.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SalesDetails from "./SalesDetails";

const SalesContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.sale);
  const currentPage = filter.page || 1;

  const { sales, isPending, error, totalSales, totalPages } = useSales(filter);

  useEffect(() => {
    if (!filter.assetType) {
      dispatch(setFilter({ assetType: "estate", page: currentPage }));
    }
  }, [filter.assetType, dispatch, currentPage]);

  const handlePageChange = (newPage: number) => {
    dispatch(setFilter({ page: newPage }));
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
        <CardHeader className="flex flex-col">
          <CardDescription>
            {!isPending && sales ? (
              <p>
                {`
              Showing ${Math.min(
                (filter.page - 1) * filter.limit + 1,
                totalSales
              )} -
                ${Math.min(filter.page * filter.limit, totalSales)} of
                ${totalSales}
             sales
             `}
              </p>
            ) : (
              <Skeleton className="h-4 w-40 mt-1" />
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            // Skeleton state
            <Table>
              <TableBody>
                {[...Array(5)].map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {[...Array(11)].map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : !sales || sales.length === 0 ? (
            // ✅ Empty state component here (same pattern as CommissionsContent)
            <EmptyTableState
              title="No sales records found"
              description={`Once sales are recorded, they will appear here.${
                filter.assetType ? ` Filtered by: ${filter.assetType}s` : ""
              }`}
            />
          ) : (
            <Table>
              <TableHeader className="bg-sidebar dark:bg-background">
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Asset Type</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Realtor</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Date of Purchase</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales?.map((sale, idx) => (
                  <TableRow key={sale._id}>
                    <TableCell>
                      <div>{(filter.page - 1) * filter.limit + idx + 1}</div>
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
                      {formatDate(sale.dateSold, "MMM dd, yyyy")}
                    </TableCell>
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
                ))}
              </TableBody>
            </Table>
          )}
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

export default SalesContent;
