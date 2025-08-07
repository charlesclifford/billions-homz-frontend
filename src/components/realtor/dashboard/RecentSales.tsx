"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sales = [
  {
    id: "1",
    property: "Luxury Villa, Banana Island",
    client: "James Adekunle",
    amount: "₦8,500,000",
    date: "15 Jun 2023",
    status: "Paid",
  },
  {
    id: "2",
    property: "Office Space, VI",
    client: "GT Bank Ltd",
    amount: "₦3,750,000",
    date: "10 Jun 2023",
    status: "Paid",
  },
  // ... more data
];

const RecentSales = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.property}</TableCell>
            <TableCell>{sale.client}</TableCell>
            <TableCell>{sale.amount}</TableCell>
            <TableCell>{sale.date}</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {sale.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentSales;
