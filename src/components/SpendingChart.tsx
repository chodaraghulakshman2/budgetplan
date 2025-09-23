import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Transaction } from "@/pages/Index";

interface SpendingChartProps {
  transactions: Transaction[];
}

const CHART_COLORS = [
  "hsl(217, 91%, 60%)",   // Primary blue
  "hsl(142, 76%, 46%)",   // Success green  
  "hsl(48, 96%, 53%)",    // Warning yellow
  "hsl(280, 100%, 70%)",  // Purple
  "hsl(0, 72%, 51%)",     // Destructive red
  "hsl(24, 100%, 60%)",   // Orange
  "hsl(200, 100%, 50%)",  // Cyan
  "hsl(300, 100%, 60%)",  // Magenta
];

export const SpendingChart = ({ transactions }: SpendingChartProps) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  
  const categoryData = expenses.reduce((acc, transaction) => {
    const existing = acc.find((item) => item.category === transaction.category);
    if (existing) {
      existing.amount += transaction.amount;
    } else {
      acc.push({
        category: transaction.category,
        amount: transaction.amount,
      });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.amount, 0);

  const chartData = categoryData.map((item, index) => ({
    ...item,
    percentage: ((item.amount / totalExpenses) * 100).toFixed(1),
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{data.category}</p>
          <p className="text-primary font-semibold">{formatCurrency(data.amount)}</p>
          <p className="text-muted-foreground text-sm">{data.percentage}% of expenses</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card to-card-secondary border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No expense data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card-secondary border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total expenses: {formatCurrency(totalExpenses)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {chartData.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm text-card-foreground truncate">
                {item.category}
              </span>
              <span className="text-sm text-muted-foreground ml-auto">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};