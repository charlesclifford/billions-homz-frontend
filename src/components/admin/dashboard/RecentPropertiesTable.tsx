"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PropertyStatus, PropertyType } from "@/interfaces/property.interface";

const recentProperties = [
  {
    id: "prop-001",
    title: "Luxury Penthouse",
    type: "apartment" as PropertyType,
    status: "available" as PropertyStatus,
    price: 3200000,
    lastUpdated: "2023-06-15",
  },
  {
    id: "prop-002",
    title: "Suburban Family Home",
    type: "house" as PropertyType,
    status: "sold" as PropertyStatus,
    price: 850000,
    lastUpdated: "2023-06-14",
  },
  {
    id: "prop-003",
    title: "Downtown Office Space",
    type: "commercial" as PropertyType,
    status: "under contract" as PropertyStatus,
    price: 2500000,
    lastUpdated: "2023-06-12",
  },
  {
    id: "prop-004",
    title: "Beachfront Villa",
    type: "villa" as PropertyType,
    status: "available" as PropertyStatus,
    price: 4200000,
    lastUpdated: "2023-06-10",
  },
  {
    id: "prop-005",
    title: "Development Land",
    type: "land" as PropertyType,
    status: "available" as PropertyStatus,
    price: 1200000,
    lastUpdated: "2023-06-08",
  },
];

const statusVariantMap = {
  available: "default",
  sold: "destructive",
  "under contract": "outline",
  rented: "secondary",
} as const;

export function RecentPropertiesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell className="capitalize">{property.type}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[property.status]}>
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${property.price.toLocaleString()}
                </TableCell>
                <TableCell>{property.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
