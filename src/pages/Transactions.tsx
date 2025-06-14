import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Trash2, Edit } from "lucide-react";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { DailySpendingChart } from "@/components/DailySpendingChart";
import { useTransactions, useDeleteTransaction, Transaction } from "@/hooks/useTransactions";
import { format } from "date-fns";

const Transactions = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: transactions = [], isLoading, error } = useTransactions(selectedMonth, selectedCategory);
  const deleteTransaction = useDeleteTransaction();

  // Get current month transactions for the chart
  const currentMonth = format(new Date(), 'yyyy-MM');
  const { data: currentMonthTransactions = [] } = useTransactions(currentMonth, 'all');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Food & Dining": "bg-orange-100 text-orange-700",
      "Transportation": "bg-blue-100 text-blue-700",
      "Shopping": "bg-purple-100 text-purple-700",
      "Entertainment": "bg-pink-100 text-pink-700",
      "Salary": "bg-green-100 text-green-700",
      "Bills & Utilities": "bg-red-100 text-red-700",
      "Healthcare": "bg-yellow-100 text-yellow-700",
      "Education": "bg-indigo-100 text-indigo-700",
      "Travel": "bg-cyan-100 text-cyan-700",
      "Freelance": "bg-emerald-100 text-emerald-700",
      "Investment": "bg-teal-100 text-teal-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditTransaction(true);
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const categories = [...new Set(transactions.map(t => t.category))];

  if (isLoading) {
    return (
      <div className="p-4 space-y-6 animate-fade-in">
        <div className="pt-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-6 animate-fade-in">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-600">Track your income and expenses</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-gray-500">Unable to load transactions</p>
              <p className="text-sm text-gray-400 mt-1">Please check your connection and try again</p>
              <Button 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">Track your income and expenses</p>
      </div>

      {/* Daily Spending Chart */}
      <DailySpendingChart transactions={currentMonthTransactions} />

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const value = format(date, 'yyyy-MM');
                const label = format(date, 'MMM yyyy');
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Income</p>
            <p className="text-lg font-bold text-accent">+${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Expenses</p>
            <p className="text-lg font-bold text-red-500">-${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Balance</p>
            <p className={`text-lg font-bold ${balance >= 0 ? 'text-accent' : 'text-red-500'}`}>
              ${balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-gray-500 mb-2">No transactions found</p>
              <p className="text-sm text-gray-400 mb-4">Start tracking your money by adding your first transaction</p>
              <Button 
                onClick={() => setShowAddTransaction(true)}
                className="gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {transaction.category.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description || transaction.category}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}
                      >
                        {transaction.category}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === "income" ? "text-accent" : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${Math.abs(Number(transaction.amount)).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTransaction(transaction)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTransaction.mutate(transaction.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
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

      <EditTransactionModal 
        open={showEditTransaction}
        onOpenChange={setShowEditTransaction}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
