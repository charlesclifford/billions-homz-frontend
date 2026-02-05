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
import useProperties from "@/hooks/useProperties";
import { formatCurrency } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { Loader2 } from "lucide-react";

export function RecentPropertiesTable() {
  const { properties, isPending, error } = useProperties({
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
            ) : properties && properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No properties found</p>
                </TableCell>
              </TableRow>
            ) : (
              properties &&
              properties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>
                    <span className="capitalize">{property.title}</span>
                  </TableCell>
                  <TableCell className="">
                    {property.location?.city && (
                      <p className="capitalize">{property.location.city}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {property.price ? formatCurrency(property.price) : "N/A"}
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
                    >
                      {property.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {property.createdAt
                      ? formatDate(property.createdAt, "MMM dd, yyyy")
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
