
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

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

  // Calculate average daily expenses for the month
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => {
      const convertedAmount = convertAmount(
        Number(t.amount), 
        (t.currency as any) || 'EUR', 
        displayCurrency
      );
      return sum + convertedAmount;
    }, 0);
  
  const averageDailyExpenses = totalExpenses / daysInMonth.length;

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

    return {
      day: format(day, 'd'),
      date: dayStr,
      expenses,
      average: averageDailyExpenses
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">Day {label}</p>
          <div className="space-y-1">
            <p className="text-blue-600 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              Expenses: <span className="font-medium">{formatAmount(data.expenses, displayCurrency)}</span>
            </p>
            <p className="text-gray-500 flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              Average: <span className="font-medium">{formatAmount(data.average, displayCurrency)}</span>
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
        <CardTitle className="text-lg">Daily Spending - {format(currentMonth, 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#4169E1" 
                strokeWidth={3}
                dot={{ fill: '#4169E1', strokeWidth: 2, r: 2 }}
                activeDot={{ r: 4, stroke: '#4169E1', strokeWidth: 2 }}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#9CA3AF" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 3, stroke: '#9CA3AF', strokeWidth: 2 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
