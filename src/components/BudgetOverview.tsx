import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

interface BudgetOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const BudgetOverview = ({ totalIncome, totalExpenses, balance }: BudgetOverviewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-card to-card-secondary border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Balance
          </CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(balance)}
          </div>
          <p className={`text-xs ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
            {balance >= 0 ? '↗' : '↘'} {savingsRate.toFixed(1)}% savings rate
          </p>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="bg-gradient-to-br from-card to-card-secondary border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Income
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            Monthly earnings
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="bg-gradient-to-br from-card to-card-secondary border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            Monthly spending
          </p>
        </CardContent>
      </Card>

      {/* Savings Goal Progress */}
      <Card className="bg-gradient-to-br from-card to-card-secondary border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Savings Goal
          </CardTitle>
          <Target className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {formatCurrency(1000)}
          </div>
          <div className="mt-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-success to-success-light h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((balance / 1000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.min(((balance / 1000) * 100), 100).toFixed(0)}% of monthly goal
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};