"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const commissions = [
  {
    id: "1",
    property: "Luxury Villa, Ikoyi",
    client: "John Doe",
    amount: "₦7,500,000",
    status: "Pending",
    date: "15 Jun 2023",
  },
  // ... more data
];

const CommissionsTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commissions.map((commission) => (
          <TableRow key={commission.id}>
            <TableCell>{commission.property}</TableCell>
            <TableCell>{commission.client}</TableCell>
            <TableCell>{commission.amount}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  commission.status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {commission.status}
              </span>
            </TableCell>
            <TableCell>{commission.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CommissionsTable;
