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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useEstates from "@/hooks/useEstates";
import { IEstate } from "@/interfaces/estate.interface";
import { deleteEstate } from "@/lib/api/properties";
import { formatCurrency } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Loader2, MapPin, Trash2 } from "lucide-react";
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
  const { isPending, estates, isError, error } = useEstates();

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
          <CardTitle>Estate List</CardTitle>
          <CardDescription>
            Manage all your properties and plots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estate</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Plots</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : estates && estates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No estates found. Create one to get started.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                estates &&
                estates.map((estate) => (
                  <TableRow key={estate._id}>
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
                          {estate.location.landmark && (
                            <p className="text-xs text-muted-foreground">
                              Near {estate.location.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {estate.area ? `${estate.area} m²` : "-"}
                    </TableCell>
                    <TableCell>
                      {estate.price ? formatCurrency(estate.price) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {estate.soldPlots || 0}
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <span>{estate.totalPlots || 0}</span>
                        <div className="ml-2 w-16">
                          <div className="h-1.5 bg-gray-200 rounded-full">
                            <div
                              className="h-1.5 bg-green-500 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((estate.soldPlots || 0) /
                                    (estate.totalPlots || 1)) *
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
                        {estate.features?.slice(0, 3).map((feature) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {estate.features && estate.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{estate.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          estate.soldPlots === estate.totalPlots
                            ? "destructive"
                            : estate.soldPlots && estate.soldPlots > 0
                            ? "default"
                            : "secondary"
                        }
                      >
                        {estate.soldPlots === estate.totalPlots
                          ? "Sold Out"
                          : estate.soldPlots && estate.soldPlots > 0
                          ? "Selling"
                          : "Available"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionsComp item={estate} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        {estates && estates.length > 0 && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {estates.length}{" "}
              {estates.length === 1 ? "estate" : "estates"}
            </div>
            {/* Pagination would go here */}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default EstateContent;
