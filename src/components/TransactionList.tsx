import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import type { Transaction } from "@/pages/Index";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string, type: "income" | "expense") => {
    if (type === "income") return "bg-success/10 text-success hover:bg-success/20";
    
    const colors = {
      "Housing": "bg-primary/10 text-primary hover:bg-primary/20",
      "Food": "bg-warning/10 text-warning hover:bg-warning/20",
      "Transportation": "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      "Utilities": "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
      "Entertainment": "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
      "Healthcare": "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      "Shopping": "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
      "Education": "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20",
      "Travel": "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    };
    
    return colors[category as keyof typeof colors] || "bg-muted/50 text-muted-foreground hover:bg-muted";
  };

  if (transactions.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card to-card-secondary border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No transactions yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card-secondary border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Recent Transactions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your latest {transactions.length} transactions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg bg-background-secondary/30 border border-border/30 hover:bg-background-secondary/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === "income" 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {transaction.type === "income" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={getCategoryColor(transaction.category, transaction.type)}
                    >
                      {transaction.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {transaction.description || "No description"}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === "income" ? "text-success" : "text-destructive"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};