
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

interface DailySpendingChartProps {
  transactions: Transaction[];
}

export const DailySpendingChart = ({ transactions }: DailySpendingChartProps) => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate daily spending data
  const dailySpending = daysInMonth.map(day => {
    const dayExpenses = transactions
      .filter(t => t.type === 'expense' && isSameDay(new Date(t.date), day))
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      day: format(day, 'd'),
      fullDate: format(day, 'MMM d'),
      spending: dayExpenses,
      isPastOrToday: day <= currentDate
    };
  });

  // Calculate expected daily average
  const totalSpentSoFar = dailySpending
    .filter(d => d.isPastOrToday)
    .reduce((sum, d) => sum + d.spending, 0);
  
  const daysPassed = dailySpending.filter(d => d.isPastOrToday).length;
  const daysRemaining = daysInMonth.length - daysPassed;
  
  const expectedDailyAverage = daysPassed > 0 ? totalSpentSoFar / daysPassed : 0;

  // Add expected average line for all days
  const chartData = dailySpending.map(d => ({
    ...d,
    expectedAverage: expectedDailyAverage
  }));

  const maxSpending = Math.max(...dailySpending.map(d => d.spending), expectedDailyAverage);
  const yAxisMax = Math.ceil(maxSpending * 1.1);

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data?.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'spending' && `Potrošeno: $${entry.value.toFixed(2)}`}
              {entry.dataKey === 'expectedAverage' && `Prosek: $${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0 || maxSpending === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📈</span>
            Dnevno trošenje za {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-500">Nema podataka o trošenju</p>
            <p className="text-sm text-gray-400 mt-1">Dodajte transakcije da vidite grafik</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>📈</span>
          Dnevno trošenje za {format(currentDate, 'MMMM yyyy')}
        </CardTitle>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Dnevno trošenje</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Prosečno dnevno (${expectedDailyAverage.toFixed(2)})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, yAxisMax]}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={renderCustomTooltip} />
              
              {/* Expected average line (gray) */}
              <Line
                type="monotone"
                dataKey="expectedAverage"
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls={true}
                name="Prosečno dnevno"
              />
              
              {/* Daily spending line (blue) */}
              <Line
                type="monotone"
                dataKey="spending"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
                connectNulls={false}
                name="Dnevno trošenje"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">Ukupno potrošeno</p>
            <p className="text-lg font-bold text-red-500">${totalSpentSoFar.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Prosek po danu</p>
            <p className="text-lg font-bold text-blue-500">${expectedDailyAverage.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Projekcija meseca</p>
            <p className="text-lg font-bold text-gray-700">
              ${(expectedDailyAverage * daysInMonth.length).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
