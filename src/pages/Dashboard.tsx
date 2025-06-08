
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { AddTransactionModal } from "@/components/AddTransactionModal";

const spendingData = [
  { name: "Food", value: 800, color: "#3B82F6" },
  { name: "Transport", value: 400, color: "#10B981" },
  { name: "Entertainment", value: 300, color: "#F59E0B" },
  { name: "Shopping", value: 500, color: "#EF4444" },
];

const monthlyData = [
  { month: "Jan", income: 5000, expenses: 3200 },
  { month: "Feb", income: 5200, expenses: 3400 },
  { month: "Mar", income: 4800, expenses: 3100 },
  { month: "Apr", income: 5500, expenses: 3800 },
  { month: "May", income: 5300, expenses: 3600 },
  { month: "Jun", income: 5600, expenses: 4200 },
];

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const balance = 2840.50;
  const monthlyIncome = 5600;
  const monthlyExpenses = 4200;
  const savings = monthlyIncome - monthlyExpenses;

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning! 👋</h1>
          <p className="text-gray-600">Here's your financial overview</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Balance</p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-gray-900">
                  {balanceVisible ? `$${balance.toLocaleString()}` : "••••••"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-1 h-8 w-8"
                >
                  {balanceVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-accent">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">+12.5%</span>
              </div>
              <p className="text-xs text-gray-500">vs last month</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/50 rounded-lg">
              <p className="text-xs text-gray-600">Monthly Income</p>
              <p className="text-lg font-semibold text-accent">${monthlyIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <p className="text-xs text-gray-600">Monthly Expenses</p>
              <p className="text-lg font-semibold text-red-500">${monthlyExpenses.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Savings</p>
                <p className="text-lg font-semibold text-gray-900">${savings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <TrendingDown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Daily</p>
                <p className="text-lg font-semibold text-gray-900">${(monthlyExpenses / 30).toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {spendingData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium ml-auto">${item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  formatter={(value, name) => [`$${value}`, name === 'income' ? 'Income' : 'Expenses']}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg gradient-primary z-40"
        onClick={() => setShowAddTransaction(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddTransactionModal 
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
      />
    </div>
  );
};

export default Dashboard;
