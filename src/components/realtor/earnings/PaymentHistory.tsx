"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const payments = [
  {
    id: "1",
    date: "15 May 2023",
    amount: "₦5,200,000",
    property: "3-Bed Terrace, Banana Island",
    client: "David Wilson",
    status: "completed",
    method: "Bank Transfer",
  },
  {
    id: "2",
    date: "28 Apr 2023",
    amount: "₦3,750,000",
    property: "Office Space, Ikoyi",
    client: "GT Bank Ltd",
    status: "completed",
    method: "Check",
  },
  // ... more data
];

const PaymentHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date}</TableCell>
                <TableCell className="font-medium">{payment.amount}</TableCell>
                <TableCell>{payment.property}</TableCell>
                <TableCell>{payment.client}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
