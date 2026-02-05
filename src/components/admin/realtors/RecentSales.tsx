"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentSale {
  id: string;
  estate: string;
  buyer: string;
  amount: number;
  date: string;
}

interface RecentSalesProps {
  sales: RecentSale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Estate</TableHead>
          <TableHead>Buyer</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.estate}</TableCell>
            <TableCell>{sale.buyer}</TableCell>
            <TableCell className="text-right">
              ${sale.amount.toLocaleString()}
            </TableCell>
            <TableCell>{sale.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}