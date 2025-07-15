
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { Transaction } from "@/services/mockData";

type TransactionTableProps = {
  transactions: Transaction[];
};

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for a new field
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? a.date.getTime() - b.date.getTime() 
        : b.date.getTime() - a.date.getTime();
    } else if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    } else if (sortField === 'riskScore') {
      return sortDirection === 'asc' 
        ? a.riskScore - b.riskScore 
        : b.riskScore - a.riskScore;
    }
    return 0;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="rounded-lg border border-border/40 overflow-hidden">
      <Table>
        <TableHeader className="bg-shield-surface">
          <TableRow>
            <TableHead 
              className="w-[180px] cursor-pointer" 
              onClick={() => handleSort('date')}
            >
              Date/Time {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('amount')}
            >
              Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('riskScore')}
            >
              Risk Score {sortField === 'riskScore' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-right">Features</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow key={transaction.id} className="hover:bg-shield-surface/50">
              <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
              <TableCell>{transaction.merchant}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                {transaction.status === 'legitimate' && (
                  <span className="flex items-center gap-1 text-legitimate">
                    <CheckCircle size={14} />
                    <span>Legitimate</span>
                  </span>
                )}
                {transaction.status === 'fraud' && (
                  <span className="flex items-center gap-1 text-fraud">
                    <AlertTriangle size={14} />
                    <span>Fraud</span>
                  </span>
                )}
                {transaction.status === 'suspicious' && (
                  <span className="flex items-center gap-1 text-suspicious">
                    <HelpCircle size={14} />
                    <span>Suspicious</span>
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-shield-muted/30 rounded-full h-2">
                    <div 
                      className={`risk-pill ${
                        transaction.riskScore > 70 
                          ? 'bg-fraud' 
                          : transaction.riskScore > 30 
                            ? 'bg-suspicious' 
                            : 'bg-legitimate'
                      }`} 
                      style={{ width: `${transaction.riskScore}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{transaction.riskScore}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {transaction.flaggedFeatures ? (
                  <span className="text-xs text-muted-foreground">
                    {transaction.flaggedFeatures.slice(0, 2).join(", ")}
                    {transaction.flaggedFeatures.length > 2 && "..."}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
