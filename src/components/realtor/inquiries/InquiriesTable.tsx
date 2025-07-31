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
import { Badge } from "@/components/ui/badge";

const inquiries = [
  {
    id: "1",
    property: "4-Bed Duplex, Lekki",
    client: "Sarah Johnson",
    contact: "sarah@email.com | 08012345678",
    date: "2 hours ago",
    status: "new",
    message: "Interested in viewing this property. Available tomorrow?",
  },
  {
    id: "2",
    property: "Office Space, VI",
    client: "Michael Adebayo",
    contact: "08087654321",
    date: "1 day ago",
    status: "pending",
    message: "Need more details about lease terms",
  },
  // ... more data
];

const InquiriesTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry) => (
            <TableRow key={inquiry.id}>
              <TableCell className="font-medium">{inquiry.property}</TableCell>
              <TableCell>{inquiry.client}</TableCell>
              <TableCell>{inquiry.contact}</TableCell>
              <TableCell>{inquiry.date}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    inquiry.status === "new"
                      ? "default"
                      : inquiry.status === "pending"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {inquiry.status}
                </Badge>
              </TableCell>
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

export default InquiriesTable;
