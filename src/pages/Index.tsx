import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { BudgetOverview } from "@/components/BudgetOverview";
import { TransactionForm } from "@/components/TransactionForm";
import { SpendingChart } from "@/components/SpendingChart";
import { TransactionList } from "@/components/TransactionList";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 75000,
      category: "Salary",
      description: "Monthly salary",
      date: "2024-01-01",
    },
    {
      id: "2",
      type: "expense",
      amount: 25000,
      category: "Housing",
      description: "Rent payment",
      date: "2024-01-02",
    },
    {
      id: "3",
      type: "expense",
      amount: 8000,
      category: "Food",
      description: "Groceries",
      date: "2024-01-03",
    },
  ]);
  
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowTransactionForm(false);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Budget Planner
            </h1>
            <p className="text-muted-foreground mt-2">
              Take control of your finances and achieve your goals
            </p>
          </div>
          <Button
            onClick={() => setShowTransactionForm(true)}
            className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all duration-300"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Overview Cards */}
        <BudgetOverview 
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending Chart */}
          <SpendingChart transactions={transactions} />
          
          {/* Recent Transactions */}
          <TransactionList transactions={transactions.slice(0, 8)} />
        </div>

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <TransactionForm
            onSubmit={addTransaction}
            onClose={() => setShowTransactionForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;