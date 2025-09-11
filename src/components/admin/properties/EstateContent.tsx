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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useEstates from "@/hooks/useEstates";
import { IEstate } from "@/interfaces/estate.interface";
import { deleteEstate } from "@/lib/api/properties";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/property/estate.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Eye, Loader2, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const ActionsComp = ({ item }: { item: IEstate }) => {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteEstate,
    onSuccess: () => {
      toast.success("Estate deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allEstates"] });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error("Failed to delete post");
      console.error("Delete error:", error);
    },
  });

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="icon" className="cursor-pointer">
        <Link href={`/admin/estates/${item._id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon" className="cursor-pointer">
        <Link href={`/admin/estates/${item._id}/edit`}>
          <Edit2 className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        size="icon"
        variant="destructive"
        className="cursor-pointer"
        onClick={() => handleDelete(item._id)}
      >
        <Trash2 size={16} />
      </Button>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Estate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this estate? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
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

const EstateContent = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.estate);
  const currentPage = filter.page || 1;
  const { isPending, estates, isError, error, totalPages, totalEstates } =
    useEstates({
      ...filter,
    });

  const handlePageChange = (newPage: number) => {
    dispatch(setFilter({ page: newPage }));
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="text-center p-6">
          <h3 className="text-lg font-medium text-red-500">
            Failed to load estates
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

  return (
    <div className="">
      <Card>
        <CardHeader className="flex flex-col">
          <CardDescription>
            <p>
              {!isPending && estates ? (
                `
              Showing ${Math.min(
                (filter.page - 1) * filter.limit + 1,
                totalEstates
              )} -
                ${Math.min(filter.page * filter.limit, totalEstates)} of
                ${totalEstates}
             estates
              `
              ) : (
                <Skeleton className="h-4 w-40 mt-1" />
              )}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            // Skeleton state
            <Table>
              <TableBody>
                {[...Array(5)].map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {[...Array(9)].map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : !estates || estates.length === 0 ? (
            // ✅ Empty state component here (same pattern)
            <EmptyTableState
              title="No estates found"
              description="Create your first estate to get started."
            />
          ) : (
            <Table>
              <TableHeader className="bg-sidebar dark:bg-background">
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Estate</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estates &&
                  estates.map((estate, idx) => (
                    <TableRow key={estate._id}>
                      <TableCell>
                        <div>{(filter.page - 1) * filter.limit + idx + 1}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {estate.bannerImage?.imageUrl && (
                            <div className="relative h-10 w-16 rounded-md overflow-hidden">
                              <Image
                                src={estate.bannerImage.imageUrl}
                                alt={estate.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <Link
                              href={`/admin/estates/${estate._id}`}
                              className="font-medium hover:underline capitalize"
                            >
                              {estate.name}
                            </Link>
                            {estate.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {estate.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {estate.location.city || estate.location.state}
                            </p>
                            {estate.location.landmarks &&
                              estate.location.landmarks.length > 0 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs text-muted-foreground cursor-pointer">
                                      Near {estate.location.landmarks[0]}
                                      {estate.location.landmarks.length > 1 && (
                                        <span>
                                          {" "}
                                          +
                                          {estate.location.landmarks.length -
                                            1}{" "}
                                          more
                                        </span>
                                      )}
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="space-y-1">
                                      {estate.location.landmarks.map(
                                        (landmark, index) => (
                                          <p key={index} className="capitalize">
                                            {landmark}
                                          </p>
                                        )
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {estate.plotSize ? `${estate.plotSize} m²` : "-"}
                      </TableCell>
                      <TableCell>
                        {estate.price ? formatCurrency(estate.price) : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div>
                            <span className="font-medium">
                              {estate.soldUnits || 0}
                            </span>
                            <span className="text-muted-foreground">/</span>
                            <span>{estate.totalUnits || 0}</span>
                          </div>
                          <div className="w-16">
                            <div className="h-1.5 bg-gray-200 rounded-full">
                              <div
                                className="h-1.5 bg-green-500 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    ((estate.soldUnits || 0) /
                                      (estate.totalUnits || 1)) *
                                      100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {estate.features && estate.features.length > 0 ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {estate.features[0]}
                                    {estate.features.length > 1 && (
                                      <span className="ml-1">
                                        +{estate.features.length - 1}
                                      </span>
                                    )}
                                  </Badge>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-medium">All Features:</p>
                                  {estate.features.map((feature, index) => (
                                    <p key={index} className="capitalize">
                                      • {feature}
                                    </p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            estate.soldUnits === estate.totalUnits
                              ? "destructive"
                              : estate.soldUnits && estate.soldUnits > 0
                              ? "default"
                              : "secondary"
                          }
                        >
                          {estate.soldUnits === estate.totalUnits
                            ? "Sold Out"
                            : estate.soldUnits && estate.soldUnits > 0
                            ? "Now Selling"
                            : "Available"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionsComp item={estate} />
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

export default EstateContent;
