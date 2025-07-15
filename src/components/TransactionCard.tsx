
import { Transaction } from "@/services/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

type TransactionCardProps = {
  transaction: Transaction;
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const { merchant, amount, date, status, cardLast4, flaggedFeatures } = transaction;
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
  
  return (
    <Card className="card-gradient border-border/50 overflow-hidden animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-medium text-sm text-muted-foreground mb-1">
              {formattedDate}
            </div>
            <div className="font-semibold text-lg mb-1">{merchant}</div>
            <div className="text-xl font-bold">{formattedAmount}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Card ending in {cardLast4}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <StatusBadge status={status} />
            
            {flaggedFeatures && flaggedFeatures.length > 0 && (
              <div className="mt-4 text-xs">
                {flaggedFeatures.map((feature, index) => (
                  <div 
                    key={index} 
                    className="text-muted-foreground flex items-center gap-1 mt-1"
                  >
                    <AlertTriangle size={12} className="text-fraud" />
                    <span className="capitalize">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: 'legitimate' | 'fraud' | 'suspicious' }) {
  if (status === 'legitimate') {
    return (
      <div className="status-badge status-badge-legitimate flex items-center gap-1">
        <CheckCircle size={12} />
        <span>Legitimate</span>
      </div>
    );
  }
  
  if (status === 'fraud') {
    return (
      <div className="status-badge status-badge-fraud flex items-center gap-1">
        <AlertTriangle size={12} />
        <span>Fraud</span>
      </div>
    );
  }
  
  return (
    <div className="status-badge status-badge-suspicious flex items-center gap-1">
      <HelpCircle size={12} />
      <span>Suspicious</span>
    </div>
  );
}
