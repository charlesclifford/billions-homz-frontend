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

const pendingApprovals = [
  {
    id: "app-001",
    type: "property",
    name: "Beachfront Condo",
    submittedBy: "John Smith",
    date: "2023-06-14",
  },
  {
    id: "app-002",
    type: "realtor",
    name: "Alex Rodriguez",
    submittedBy: "System",
    date: "2023-06-13",
  },
  {
    id: "app-003",
    type: "property",
    name: "Historic Townhouse",
    submittedBy: "Sarah Johnson",
    date: "2023-06-12",
  },
  {
    id: "app-004",
    type: "document",
    name: "Purchase Agreement",
    submittedBy: "Michael Chen",
    date: "2023-06-11",
  },
];

// const typeVariantMap = {
//   property: "default",
//   realtor: "outline",
//   document: "destructive",
//   user: "secondary",
// } as const;

export function PendingApprovals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingApprovals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <Badge >
                    {approval.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{approval.name}</TableCell>
                <TableCell>{approval.submittedBy}</TableCell>
                <TableCell>{approval.date}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                    <Button size="sm">Approve</Button>
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
