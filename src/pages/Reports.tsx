import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SpendingChart } from '@/components/SpendingChart';
import { TransactionList } from '@/components/TransactionList';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface CategoryData {
  category: string;
  amount: number;
  count: number;
}

const Reports = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last6months');

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user, timeRange]);

  const fetchReportData = async () => {
    if (!user) return;

    try {
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'last3months':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'last6months':
          startDate.setMonth(now.getMonth() - 6);
          break;
        case 'lastyear':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(now.getMonth() - 6);
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      const transactionsData = data || [];
      setTransactions(transactionsData);

      // Process monthly data
      const monthlyMap = new Map<string, { income: number; expenses: number }>();
      
      transactionsData.forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { income: 0, expenses: 0 });
        }
        
        const monthData = monthlyMap.get(monthKey)!;
        const amount = parseFloat(transaction.amount.toString());
        
        if (transaction.type === 'income') {
          monthData.income += amount;
        } else {
          monthData.expenses += amount;
        }
      });

      const processedMonthlyData: MonthlyData[] = Array.from(monthlyMap.entries())
        .map(([month, data]) => ({
          month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' }),
          income: data.income,
          expenses: data.expenses,
          balance: data.income - data.expenses,
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      setMonthlyData(processedMonthlyData);

      // Process category data (expenses only)
      const categoryMap = new Map<string, { amount: number; count: number }>();
      
      transactionsData
        .filter(t => t.type === 'expense')
        .forEach((transaction) => {
          const category = transaction.category;
          if (!categoryMap.has(category)) {
            categoryMap.set(category, { amount: 0, count: 0 });
          }
          
          const categoryInfo = categoryMap.get(category)!;
          categoryInfo.amount += parseFloat(transaction.amount.toString());
          categoryInfo.count += 1;
        });

      const processedCategoryData: CategoryData[] = Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          amount: data.amount,
          count: data.count,
        }))
        .sort((a, b) => b.amount - a.amount);

      setCategoryData(processedCategoryData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Type', 'Category', 'Description', 'Amount'],
      ...transactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.description || '',
        t.amount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">Analyze your spending patterns and trends</p>
        </div>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-input rounded-md bg-background"
          >
            <option value="last3months">Last 3 Months</option>
            <option value="last6months">Last 6 Months</option>
            <option value="lastyear">Last Year</option>
          </select>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter(t => t.type === 'income').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter(t => t.type === 'expense').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.length} total transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="income" fill="hsl(var(--success))" name="Income" />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Balance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Balance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.slice(0, 8).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(category.amount)}</div>
                    <div className="text-sm text-muted-foreground">{category.count} transactions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <TransactionList transactions={transactions.slice(0, 10)} />
      </div>
    </div>
  );
};

export default Reports;