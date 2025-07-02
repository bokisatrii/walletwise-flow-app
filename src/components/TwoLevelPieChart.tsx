import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/CurrencyContext";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  subcategory?: string;
  type: 'income' | 'expense';
  currency?: string;
  date: string;
}

interface TwoLevelPieChartProps {
  transactions: Transaction[];
  title?: string;
}

const MAIN_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const SUB_COLORS = [
  '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA',
  '#F472B6', '#22D3EE', '#A3E635', '#FB923C', '#818CF8'
];

export const TwoLevelPieChart = ({ transactions, title = "Where did my money go?" }: TwoLevelPieChartProps) => {
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { displayCurrency, convertAmount, formatAmount } = useCurrency();

  // Process transactions data
  const { mainData, subData, insights } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group by main categories
    const categoryTotals = expenses.reduce((acc, transaction) => {
      const category = transaction.category;
      const originalAmount = Number(transaction.amount);
      const transactionCurrency = (transaction.currency as any) || 'EUR';
      const convertedAmount = convertAmount(originalAmount, transactionCurrency, displayCurrency);
      
      if (!acc[category]) {
        acc[category] = { total: 0, subcategories: {} };
      }
      acc[category].total += convertedAmount;
      
      // Group by subcategories
      const subcategory = transaction.subcategory || 'General';
      if (!acc[category].subcategories[subcategory]) {
        acc[category].subcategories[subcategory] = 0;
      }
      acc[category].subcategories[subcategory] += convertedAmount;
      
      return acc;
    }, {} as Record<string, { total: number; subcategories: Record<string, number> }>);

    // Convert to chart data
    const mainChartData = Object.entries(categoryTotals)
      .map(([category, data]) => ({
        name: category,
        value: data.total,
        subcategories: data.subcategories
      }))
      .sort((a, b) => b.value - a.value);

    // Create subcategory data for detailed view
    const subChartData = Object.entries(categoryTotals).flatMap(([category, data]) =>
      Object.entries(data.subcategories).map(([subcategory, amount]) => ({
        name: `${category} - ${subcategory}`,
        category,
        subcategory,
        value: amount
      }))
    ).sort((a, b) => b.value - a.value);

    // Generate insights
    const totalSpent = mainChartData.reduce((sum, item) => sum + item.value, 0);
    const topCategory = mainChartData[0];
    const topPercentage = totalSpent > 0 ? (topCategory?.value / totalSpent) * 100 : 0;
    
    const generatedInsights = {
      totalSpent,
      topCategory: topCategory?.name || '',
      topPercentage,
      categoriesCount: mainChartData.length
    };

    return {
      mainData: mainChartData,
      subData: subChartData,
      insights: generatedInsights
    };
  }, [transactions, convertAmount, displayCurrency]);

  if (mainData.length === 0) {
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
          <p className="text-gray-500 text-sm">
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💸</span>
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'simple' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('simple')}
              className="h-8"
            >
              <PieChartIcon className="h-3 w-3 mr-1" />
              Simple
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
              className="h-8"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Detailed
            </Button>
          </div>
        </div>
        
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
              {viewMode === 'simple' ? (
                <Pie
                  data={mainData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} (${((value / insights.totalSpent) * 100).toFixed(0)}%)`}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {mainData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={MAIN_COLORS[index % MAIN_COLORS.length]}
                      className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
              ) : (
                <>
                  {/* Outer ring - Main categories */}
                  <Pie
                    data={mainData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {mainData.map((entry, index) => (
                      <Cell 
                        key={`outer-${index}`} 
                        fill={MAIN_COLORS[index % MAIN_COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  
                  {/* Inner ring - Subcategories */}
                  <Pie
                    data={subData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#82ca9d"
                    dataKey="value"
                    label={({ subcategory, value }) => `${subcategory} (${formatAmount(value, displayCurrency)})`}
                    labelLine={false}
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {subData.map((entry, index) => (
                      <Cell 
                        key={`inner-${index}`} 
                        fill={SUB_COLORS[index % SUB_COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                </>
              )}
              <Tooltip content={renderCustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {mainData.slice(0, 6).map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 hover-scale transition-transform duration-200">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: MAIN_COLORS[index % MAIN_COLORS.length] }}
                />
                <span className="text-sm text-gray-600 truncate">
                  {item.name}: {formatAmount(item.value, displayCurrency)}
                </span>
              </div>
            ))}
            {mainData.length > 6 && (
              <div className="text-xs text-gray-400 col-span-2">
                +{mainData.length - 6} more categories
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};