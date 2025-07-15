
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CreditCard, DollarSign } from "lucide-react";

export function BankCard() {
  return (
    <Card className="card-gradient border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bank Overview</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-shield-primary" />
            <div>
              <p className="text-sm font-bold">Total Balance</p>
              <p className="text-xl font-semibold text-shield-primary">$45,231.89</p>
            </div>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-shield-primary" />
            <div>
              <p className="text-sm font-bold">Active Cards</p>
              <p className="text-xl font-semibold text-shield-primary">3 Cards</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
