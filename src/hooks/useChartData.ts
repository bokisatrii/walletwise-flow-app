import { useMemo } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  currency?: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
  percentage: string;
}

export interface ChartInsights {
  totalSpent: number;
  topCategory: string;
  topPercentage: number;
  categoriesCount: number;
}

export const useChartData = (transactions: Transaction[]) => {
  const { displayCurrency, convertAmount } = useCurrency();

  return useMemo(() => {
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
    
    const insights: ChartInsights = {
      totalSpent,
      topCategory: topCategory?.name || '',
      topPercentage,
      categoriesCount: data.length
    };

    // Add percentage labels to chart data
    const chartDataWithPercentages: ChartDataItem[] = data.map(item => ({
      ...item,
      percentage: ((item.value / totalSpent) * 100).toFixed(1)
    }));

    return {
      chartData: data,
      chartDataWithPercentages,
      insights
    };
  }, [transactions, convertAmount, displayCurrency]);
};