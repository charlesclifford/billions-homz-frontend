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
import { Button } from "@/components/ui/button";

const pendingCommissions = [
  {
    id: "comm-001",
    realtor: "John Smith",
    property: "Lakeside Villa",
    amount: 12500,
    status: "pending",
    date: "2023-06-10",
  },
  {
    id: "comm-002",
    realtor: "Sarah Johnson",
    property: "Downtown Loft",
    amount: 8700,
    status: "pending",
    date: "2023-06-08",
  },
  {
    id: "comm-003",
    realtor: "Michael Chen",
    property: "Suburban Duplex",
    amount: 9600,
    status: "processing",
    date: "2023-06-05",
  },
  {
    id: "comm-004",
    realtor: "Emily Wilson",
    property: "Mountain Retreat",
    amount: 15300,
    status: "pending",
    date: "2023-06-03",
  },
];

export function PendingCommissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Commissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Realtor</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingCommissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell>{commission.realtor}</TableCell>
                <TableCell>{commission.property}</TableCell>
                <TableCell>${commission.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      commission.status === "pending" ? "outline" : "default"
                    }
                  >
                    {commission.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    {commission.status === "pending" && (
                      <Button size="sm">Pay</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
