
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { AlertTriangle, CheckCircle, HelpCircle, TrendingUp } from "lucide-react";

type StatsProps = {
  total: number;
  fraudulent: number;
  suspicious: number;
  legitimate: number;
  fraudPercentage: number;
  suspiciousPercentage: number;
  legitimatePercentage: number;
  totalAmount: number;
  fraudAmount: number;
  topFeatures: Array<{ feature: string; count: number }>;
};

export function FraudStats({
  total,
  fraudulent,
  suspicious,
  legitimate,
  fraudPercentage,
  suspiciousPercentage,
  legitimatePercentage,
  totalAmount,
  fraudAmount,
  topFeatures,
}: StatsProps) {
  const pieData = [
    { name: "Legitimate", value: legitimate, color: "#4CAF50" },
    { name: "Suspicious", value: suspicious, color: "#FFB74D" },
    { name: "Fraudulent", value: fraudulent, color: "#FF5252" },
  ];

  const featureData = topFeatures.map(({ feature, count }) => ({
    name: feature,
    value: count,
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="card-gradient border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} transactions`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center text-legitimate gap-1">
                <CheckCircle size={14} />
                <span className="text-xs">Legitimate</span>
              </div>
              <span className="font-bold">{legitimatePercentage.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center text-suspicious gap-1">
                <HelpCircle size={14} />
                <span className="text-xs">Suspicious</span>
              </div>
              <span className="font-bold">{suspiciousPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center text-fraud gap-1">
                <AlertTriangle size={14} />
                <span className="text-xs">Fraud</span>
              </div>
              <span className="font-bold">{fraudPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Fraud Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featureData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} occurrences`, ""]}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8B5CF6" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Financial Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Transactions</span>
                <span className="font-medium">{total}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="font-medium">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fraud Transactions</span>
                <span className="font-medium">{fraudulent}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">Fraud Amount</span>
                <span className="font-medium text-fraud">{formatCurrency(fraudAmount)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fraud Prevention</span>
                <div className="flex items-center gap-1 text-legitimate font-medium">
                  <TrendingUp size={14} />
                  <span>{formatCurrency(fraudAmount)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Potential savings by preventing fraudulent transactions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
