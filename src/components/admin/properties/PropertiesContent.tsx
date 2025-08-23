"use client";
import { getPaginationRange } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import useProperties from "@/hooks/useProperties";
import { IProperty } from "@/interfaces/property.interface";
import { deleteProperty } from "@/lib/api/properties";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/property/property.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Eye, Loader2, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const PropertyActions = ({ property }: { property: IProperty }) => {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error("Failed to delete property");
      console.error("Delete error:", error);
    },
  });

  const confirmDelete = () => {
    deleteMutation.mutate(property._id);
  };

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="icon" className="cursor-pointer">
        <Link href={`/admin/properties/${property._id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon" className="cursor-pointer">
        <Link href={`/admin/properties/${property._id}/edit`}>
          <Edit2 className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        size="icon"
        variant="destructive"
        className="cursor-pointer"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 size={16} />
      </Button>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PropertiesContent = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.property);
  const { properties, totalPages, isPending, totalProperties, isError, error } =
    useProperties(filter);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="text-center p-6">
          <h3 className="text-lg font-medium text-red-500">
            Failed to load properties
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error?.message || "Please try again later"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const onPaginationChange = (page: number) => {
    dispatch(setFilter({ page }));
  };

  // Calculate the range of items being shown
  const startItem = (filter.page - 1) * filter.limit + 1;
  const endItem = Math.min(filter.page * filter.limit, totalProperties);

  return (
    <div className="">
      <Card>
        <CardHeader className="flex flex-col">
          <CardDescription>
            <p>
              {!isPending && properties ? (
                `
              Showing ${startItem} -
                ${endItem} of
                ${totalProperties}
             estates
              `
              ) : (
                <Skeleton className="h-4 mt-1" />
              )}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
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
              ) : properties && properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No properties found. Create one to get started.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                properties?.map((property, idx) => (
                  <TableRow key={property._id}>
                    <TableCell>
                      <div>{(filter.page - 1) * filter.limit + idx + 1}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 w-[300px] truncate">
                        {property.images[0]?.imageUrl && (
                          <div className="relative h-10 w-16 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={property.images[0]?.imageUrl}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/properties/${property._id}`}
                            className="font-medium hover:underline"
                          >
                            {property.title}
                          </Link>
                          {property.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {property.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {property.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {property.location?.city ||
                              property.location?.state}
                          </p>
                          {property.location?.address && (
                            <p className="text-xs text-muted-foreground">
                              {property.location.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {property.price ? formatCurrency(property.price) : "-"}
                    </TableCell>
                    <TableCell>
                      {property.dimensions ? `${property.dimensions} m²` : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {property.features?.slice(0, 3).map((feature) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {property.features && property.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{property.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          property.status === "available"
                            ? "default"
                            : property.status === "sold"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <PropertyActions property={property} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        {properties && properties.length > 0 && (
          <CardFooter className="flex justify-between">
            {/* Pagination controls */}
            {properties.length > 0 && totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPaginationChange(filter.page - 1)}
                      aria-disabled={filter.page === 1}
                      className={cn(
                        "cursor-pointer",
                        filter.page === 1 && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>

                  {getPaginationRange(filter.page, totalPages).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === filter.page}
                        onClick={() => onPaginationChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPaginationChange(filter.page + 1)}
                      aria-disabled={filter.page >= totalPages}
                      className={cn(
                        "cursor-pointer",
                        filter.page >= totalPages &&
                          "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PropertiesContent;
