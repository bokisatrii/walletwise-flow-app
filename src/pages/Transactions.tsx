
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { AddTransactionModal } from "@/components/AddTransactionModal";

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    amount: -45.50,
    category: "Food & Dining",
    description: "Lunch at Cafe Central",
    date: "2024-06-07",
    type: "expense" as const,
  },
  {
    id: 2,
    amount: 2500.00,
    category: "Salary",
    description: "Monthly salary",
    date: "2024-06-01",
    type: "income" as const,
  },
  {
    id: 3,
    amount: -120.00,
    category: "Shopping",
    description: "Grocery shopping",
    date: "2024-06-05",
    type: "expense" as const,
  },
  {
    id: 4,
    amount: -25.00,
    category: "Transportation",
    description: "Uber ride",
    date: "2024-06-06",
    type: "expense" as const,
  },
  {
    id: 5,
    amount: -89.99,
    category: "Entertainment",
    description: "Movie tickets",
    date: "2024-06-04",
    type: "expense" as const,
  },
];

const Transactions = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions] = useState(mockTransactions);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">Track your income and expenses</p>
      </div>

      {/* Search and Filter */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-lg font-bold text-accent">+$2,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Expenses</p>
            <p className="text-lg font-bold text-red-500">-$280</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Balance</p>
            <p className="text-lg font-bold text-primary">$2,220</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTransactions.map((transaction) => (
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
                  <p className="font-medium text-gray-900">{transaction.description}</p>
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
              <div className="text-right">
                <p
                  className={`font-bold text-lg ${
                    transaction.type === "income" ? "text-accent" : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
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

export default Transactions;
