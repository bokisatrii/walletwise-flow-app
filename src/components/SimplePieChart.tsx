import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  currency?: string;
}

interface SimplePieChartProps {
  transactions: Transaction[];
  title?: string;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C',
  '#8DD1E1', '#D084D0'
];

export const SimplePieChart = ({ transactions, title = "Where did my money go?" }: SimplePieChartProps) => {
  const { displayCurrency, convertAmount, formatAmount } = useCurrency();

  // Process transactions data
  const { chartData, insights } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group by categories
    const categoryTotals = expenses.reduce((acc, transaction) => {
      const category = transaction.category;
      const originalAmount = Number(transaction.amount);
      const transactionCurrency = (transaction.currency as any) || 'EUR';
      const convertedAmount = convertAmount(originalAmount, transactionCurrency, displayCurrency);
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += convertedAmount;
      
      return acc;
    }, {} as Record<string, number>);

    // Convert to chart data
    const data = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount
      }))
      .sort((a, b) => b.value - a.value);

    // Generate insights
    const totalSpent = data.reduce((sum, item) => sum + item.value, 0);
    const topCategory = data[0];
    const topPercentage = totalSpent > 0 ? (topCategory?.value / totalSpent) * 100 : 0;
    
    const generatedInsights = {
      totalSpent,
      topCategory: topCategory?.name || '',
      topPercentage,
      categoriesCount: data.length
    };

    return {
      chartData: data,
      insights: generatedInsights
    };
  }, [transactions, convertAmount, displayCurrency]);

  if (chartData.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💸</span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-muted-foreground">No expense data to display</p>
            <p className="text-sm text-muted-foreground mt-1">Add some transactions to see your spending breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-lg animate-scale-in">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">{formatAmount(data.value, displayCurrency)}</p>
          <p className="text-muted-foreground text-sm">
            {((data.value / insights.totalSpent) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>💸</span>
          {title}
        </CardTitle>
        
        {/* Quick Insights */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Top: {insights.topCategory} ({insights.topPercentage.toFixed(0)}%)
          </Badge>
          <Badge variant="outline" className="text-xs">
            Total: {formatAmount(insights.totalSpent, displayCurrency)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {chartData.slice(0, 6).map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 hover-scale transition-transform duration-200">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-muted-foreground truncate">
                  {item.name}: {formatAmount(item.value, displayCurrency)}
                </span>
              </div>
            ))}
            {chartData.length > 6 && (
              <div className="text-xs text-muted-foreground col-span-2">
                +{chartData.length - 6} more categories
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};