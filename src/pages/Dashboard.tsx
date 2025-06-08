
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownRight, TrendingUp, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { useTransactions } from "@/hooks/useTransactions";
import { useDemoData } from "@/hooks/useDemoData";
import { TransactionChart } from "@/components/TransactionChart";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const currentMonth = format(new Date(), 'yyyy-MM');
  const { data: transactions = [], isLoading } = useTransactions(currentMonth);
  const { createDemoTransactions, isCreating } = useDemoData();

  useEffect(() => {
    // Check if this is the demo account
    const checkDemoUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === "demo@walletwise.com") {
        setIsDemo(true);
        // If demo user has no transactions, create demo data
        if (transactions.length === 0 && !isLoading) {
          createDemoTransactions();
        }
      }
    };
    
    checkDemoUser();
  }, [transactions.length, isLoading, createDemoTransactions]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  // Calculate totals for current month
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  if (isLoading || isCreating) {
    return (
      <div className="p-4 space-y-6 animate-fade-in">
        <div className="pt-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
        {isCreating && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up your demo experience...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Demo Banner */}
      {isDemo && (
        <Card className="border-accent bg-accent/5 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-accent">
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">
                You're viewing the demo version with sample data
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="pt-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {isDemo ? "Welcome to WalletWise Demo" : "Welcome back to WalletWise"}
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      {/* Balance Card */}
      <Card className="gradient-primary text-white animate-fade-in">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 mb-2">Current Balance</p>
              <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
              <p className="text-blue-100 text-sm mt-1">
                {format(new Date(), 'MMMM yyyy')}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      {/* Income & Expenses Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-scale transition-transform duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-accent mb-2">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm font-medium">Income</span>
            </div>
            <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-transform duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm font-medium">Expenses</span>
            </div>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Spending Chart */}
      <div className="animate-fade-in">
        <TransactionChart transactions={transactions} />
      </div>

      {/* Recent Transactions */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between animate-fade-in hover-scale transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {transaction.category.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description || transaction.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-bold text-sm ${
                      transaction.type === "income" ? "text-accent" : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}${Math.abs(Number(transaction.amount)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg gradient-primary z-40 hover-scale transition-all duration-200"
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
