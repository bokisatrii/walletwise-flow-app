
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Suspense } from "react";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  currency?: string;
}

interface TransactionChartProps {
  transactions: Transaction[];
  title?: string;
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const ChartLoadingSkeleton = () => (
  <div className="h-80 flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
  </div>
);

export const TransactionChart = ({ transactions, title = "Spending Breakdown" }: TransactionChartProps) => {
  const { displayCurrency, convertAmount, formatAmount } = useCurrency();

  // Group expenses by category and convert to display currency
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const originalAmount = Number(transaction.amount);
      const transactionCurrency = (transaction.currency as any) || 'EUR';
      
      // Convert amount to display currency
      const convertedAmount = convertAmount(originalAmount, transactionCurrency, displayCurrency);
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += convertedAmount;
      
      return acc;
    }, {} as Record<string, number>);

  // Convert to chart data format
  const chartData = Object.entries(expenseData)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: 0 // Will be calculated below
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate percentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  chartData.forEach(item => {
    item.percentage = total > 0 ? (item.value / total) * 100 : 0;
  });

  if (chartData.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-500">No expense data to display</p>
            <p className="text-sm text-gray-400 mt-1">Add some transactions to see your spending breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg animate-scale-in">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">{formatAmount(data.value, displayCurrency)}</p>
          <p className="text-gray-500 text-sm">{data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>📊</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ChartLoadingSkeleton />}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Suspense>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.slice(0, 6).map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 hover-scale transition-transform duration-200">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-600 truncate">
                {item.name}: {formatAmount(item.value, displayCurrency)}
              </span>
            </div>
          ))}
          {chartData.length > 6 && (
            <div className="text-xs text-gray-400 col-span-2">
              +{chartData.length - 6} more categories
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
