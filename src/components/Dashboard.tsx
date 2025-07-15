
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionCard } from "./TransactionCard";
import { TransactionTable } from "./TransactionTable";
import { FraudStats } from "./FraudStats";
import { BankCard } from "./BankCard";
import { api } from "@/services/api";
import { Transaction } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, recentTransactionsData, statsData] = await Promise.all([
        api.getTransactions(),
        api.getRecentTransactions(5),
        api.getStats()
      ]);
      
      setTransactions(transactionsData);
      
      // Check if there are new fraud transactions
      const newFraudTransactions = recentTransactionsData.filter(
        t => t.status === 'fraud' && !recentTransactions.some(rt => rt.id === t.id)
      );
      
      if (newFraudTransactions.length > 0 && recentTransactions.length > 0) {
        // Only show toast if this isn't the initial load
        toast({
          title: `${newFraudTransactions.length} new fraud alert${newFraudTransactions.length > 1 ? 's' : ''}`,
          description: "High risk transactions detected. Please review immediately.",
          variant: "destructive",
        });
      }
      
      setRecentTransactions(recentTransactionsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: "Failed to load transaction data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Fraud Detection Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and detect suspicious transactions in real-time
        </p>
      </div>
      
      {loading && !stats ? (
        <StatsLoading />
      ) : (
        stats && <FraudStats {...stats} />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-shield-muted/30">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="fraud">Fraud</TabsTrigger>
                <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all">
              {loading ? (
                <TableLoading />
              ) : (
                <TransactionTable transactions={transactions} />
              )}
            </TabsContent>
            
            <TabsContent value="fraud">
              {loading ? (
                <TableLoading />
              ) : (
                <TransactionTable 
                  transactions={transactions.filter(t => t.status === 'fraud')} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="suspicious">
              {loading ? (
                <TableLoading />
              ) : (
                <TransactionTable 
                  transactions={transactions.filter(t => t.status === 'suspicious')} 
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <BankCard />
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <CardDescription>
                Latest activity across your accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <RecentTransactionsLoading />
              ) : (
                recentTransactions.map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="card-gradient border-border/50">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <Skeleton className="h-[180px] w-[180px] rounded-full" />
            </div>
            <div className="mt-2">
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableLoading() {
  return (
    <div className="rounded-lg border border-border/40 overflow-hidden">
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="w-full space-y-3">
          <Skeleton className="h-8 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentTransactionsLoading() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="card-gradient border-border/50">
          <CardContent className="p-4">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
