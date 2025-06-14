
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  currency: string;
}

interface DailySpendingChartProps {
  transactions: Transaction[];
  currentMonth: Date;
}

export const DailySpendingChart = ({ transactions, currentMonth }: DailySpendingChartProps) => {
  const { displayCurrency, convertAmount, formatAmount } = useCurrency();

  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group transactions by day and convert to display currency
  const dailyData = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTransactions = transactions.filter(t => t.date === dayStr);
    
    const expenses = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => {
        const convertedAmount = convertAmount(
          Number(t.amount), 
          (t.currency as any) || 'EUR', 
          displayCurrency
        );
        return sum + convertedAmount;
      }, 0);

    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => {
        const convertedAmount = convertAmount(
          Number(t.amount), 
          (t.currency as any) || 'EUR', 
          displayCurrency
        );
        return sum + convertedAmount;
      }, 0);

    return {
      day: format(day, 'd'),
      date: dayStr,
      expenses,
      income,
      net: income - expenses
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">Day {label}</p>
          <p className="text-red-600">Expenses: {formatAmount(data.expenses, displayCurrency)}</p>
          <p className="text-green-600">Income: {formatAmount(data.income, displayCurrency)}</p>
          <p className="text-blue-600">Net: {formatAmount(data.net, displayCurrency)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">Daily Spending - {format(currentMonth, 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="expenses" fill="#EF4444" radius={[2, 2, 0, 0]} />
              <Bar dataKey="income" fill="#10B981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
