"use client";
import { getPaginationRange } from "@/components/shared/DataTable";
import { EmptyTableState } from "@/components/shared/EmptyTableState";
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
import useInspections from "@/hooks/useInspections";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/inspections/inspection.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Eye, Mail, MapPin, Phone } from "lucide-react";

const InspectionsContent = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.inspection);
  const currentPage = filter.page || 1;

  const { inspections, isPending, error, totalInspections, totalPages } =
    useInspections(filter);

  const handlePageChange = (newPage: number) => {
    dispatch(setFilter({ page: newPage }));
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { variant: "secondary" as const, label: "Pending" },
      Confirmed: { variant: "default" as const, label: "Confirmed" },
      Cancelled: { variant: "destructive" as const, label: "Cancelled" },
      Completed: { variant: "outline" as const, label: "Completed" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      label: status,
    };

    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-center text-destructive">
            <p className="font-medium">Error loading inspections</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message || "Please try again later"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col">
        <CardDescription>
          {!isPending && inspections ? (
            <p>
              {`
                    Showing ${Math.min(
                      (filter.page - 1) * filter.limit + 1,
                      totalInspections
                    )} -
                      ${Math.min(
                        filter.page * filter.limit,
                        totalInspections
                      )} of
                      ${totalInspections}
                   site inspections
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
                  {[...Array(8)].map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : inspections.length === 0 ? (
          <EmptyTableState
            title="No inspections found"
            // description={`Once sales are recorded, they will appear here.${
            //   filter.assetType ? ` Filtered by: ${filter.assetType}s` : ""
            // }`}
          />
        ) : (
          <Table>
            <TableHeader className="bg-sidebar dark:bg-background">
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Estate</TableHead>
                <TableHead>Preferred Day</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection, idx) => (
                <TableRow key={inspection._id}>
                  <TableCell>
                    <div>{(filter.page - 1) * filter.limit + idx + 1}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {inspection.firstName} {inspection.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(inspection.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{inspection.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{inspection.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="capitalize">{inspection.estate}</span>
                    </div>
                    {inspection.realtor && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Realtor: {inspection.realtor}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="capitalize">{inspection.day}</TableCell>
                  <TableCell className="capitalize">
                    {inspection.source}
                  </TableCell>
                  <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
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
  );
};

export default InspectionsContent;
