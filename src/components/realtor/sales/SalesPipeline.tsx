"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const salesData = [
  {
    id: "1",
    property: "Luxury Villa, Ikoyi",
    client: "John Doe",
    stage: "Negotiation",
    value: "₦250,000,000",
    commission: "₦7,500,000",
  },
  // ... more data
];

const SalesPipeline = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>Add New Deal</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Potential Commission</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesData.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.property}</TableCell>
              <TableCell>{deal.client}</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {deal.stage}
                </span>
              </TableCell>
              <TableCell>{deal.value}</TableCell>
              <TableCell>{deal.commission}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesPipeline;
