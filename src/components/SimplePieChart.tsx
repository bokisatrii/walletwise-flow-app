import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LabelList } from "recharts";
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

// Function to determine explosion direction based on segment angle
const getExplosionClass = (midAngle: number): string => {
  // Normalize angle to 0-360 range
  const normalizedAngle = ((midAngle % 360) + 360) % 360;
  
  if (normalizedAngle >= 0 && normalizedAngle < 45) return 'explode-right';
  if (normalizedAngle >= 45 && normalizedAngle < 90) return 'explode-bottom-right';
  if (normalizedAngle >= 90 && normalizedAngle < 135) return 'explode-bottom';
  if (normalizedAngle >= 135 && normalizedAngle < 180) return 'explode-bottom-left';
  if (normalizedAngle >= 180 && normalizedAngle < 225) return 'explode-left';
  if (normalizedAngle >= 225 && normalizedAngle < 270) return 'explode-top-left';
  if (normalizedAngle >= 270 && normalizedAngle < 315) return 'explode-top';
  return 'explode-top-right';
};

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

  // Add percentage labels to chart data
  const chartDataWithPercentages = useMemo(() => {
    return chartData.map(item => ({
      ...item,
      percentage: ((item.value / insights.totalSpent) * 100).toFixed(1)
    }));
  }, [chartData, insights.totalSpent]);

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-4 border border-border rounded-lg shadow-xl animate-scale-in backdrop-blur-sm">
          <p className="font-semibold text-base mb-1">{data.name}</p>
          <p className="text-primary font-bold text-lg">{formatAmount(data.value, displayCurrency)}</p>
          <p className="text-muted-foreground text-sm">
            {data.percentage}% of total spending
          </p>
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Click to view transactions in this category
            </p>
          </div>
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
        <div className="relative h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartDataWithPercentages}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={0}
                animationBegin={0}
                animationDuration={1000}
                labelLine={false}
                stroke="hsl(var(--background))"
                strokeWidth={4}
              >
                {chartDataWithPercentages.map((entry, index) => {
                  // Calculate the midpoint angle for this segment to determine explosion direction
                  const startAngle = chartDataWithPercentages.slice(0, index).reduce((sum, item) => 
                    sum + (parseFloat(item.percentage) * 3.6), 0
                  );
                  const endAngle = startAngle + (parseFloat(entry.percentage) * 3.6);
                  const midAngle = (startAngle + endAngle) / 2;
                  
                  // Convert angle to determine explosion direction
                  const explosionClass = getExplosionClass(midAngle);
                  
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className={`segment-hover ${explosionClass} transition-all duration-300 cursor-pointer`}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                        transformOrigin: "center"
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Information */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {formatAmount(insights.totalSpent, displayCurrency)}
              </p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-xs text-muted-foreground mt-1">
                Top: {insights.topCategory}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Legend */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Spending Breakdown</h4>
          <div className="grid grid-cols-1 gap-3">
            {chartDataWithPercentages.slice(0, 8).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatAmount(item.value, displayCurrency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.percentage}%
                  </p>
                </div>
              </div>
            ))}
            {chartDataWithPercentages.length > 8 && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                +{chartDataWithPercentages.length - 8} more categories
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};