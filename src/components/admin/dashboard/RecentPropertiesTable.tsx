"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useEstates from "@/hooks/useEstates";
import { formatCurrency } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { Loader2 } from "lucide-react";

export function RecentPropertiesTable() {
  const { estates, isPending, error } = useEstates({
    page: 1,
    limit: 5,
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Properties</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-500">Failed to load properties</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error.message || "Please try again later"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-sidebar dark:bg-background">
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="py-8 flex flex-col gap-2 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Loading recent properties...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : estates && estates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No properties found</p>
                </TableCell>
              </TableRow>
            ) : (
              estates &&
              estates.map((estate) => (
                <TableRow key={estate._id}>
                  <TableCell>
                    <span className="capitalize">{estate.name}</span>
                  </TableCell>
                  <TableCell className="">
                    {estate.location?.city && (
                      <p className="capitalize">{estate.location.city}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {estate.price ? formatCurrency(estate.price) : "N/A"}
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
                        ? "Selling"
                        : "Available"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {estate.createdAt
                      ? formatDate(estate.createdAt, "MMM dd, yyyy")
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
