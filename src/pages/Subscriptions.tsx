
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, DollarSign } from "lucide-react";
import { AddSubscriptionModal } from "@/components/AddSubscriptionModal";

// Mock subscription data
const mockSubscriptions = [
  {
    id: 1,
    name: "Netflix",
    amount: 15.99,
    billingCycle: "monthly" as const,
    nextBilling: "2024-06-15",
    category: "Entertainment",
    color: "#E50914",
  },
  {
    id: 2,
    name: "Spotify",
    amount: 9.99,
    billingCycle: "monthly" as const,
    nextBilling: "2024-06-10",
    category: "Music",
    color: "#1DB954",
  },
  {
    id: 3,
    name: "Adobe Creative Suite",
    amount: 52.99,
    billingCycle: "monthly" as const,
    nextBilling: "2024-06-20",
    category: "Software",
    color: "#FF0000",
  },
  {
    id: 4,
    name: "Gym Membership",
    amount: 29.99,
    billingCycle: "monthly" as const,
    nextBilling: "2024-06-12",
    category: "Health",
    color: "#FF6B35",
  },
];

const Subscriptions = () => {
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [subscriptions] = useState(mockSubscriptions);

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const totalYearly = totalMonthly * 12;

  const getDaysUntilBilling = (date: string) => {
    const today = new Date();
    const billingDate = new Date(date);
    const diffTime = billingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 1) return "bg-red-100 text-red-700 border-red-200";
    if (daysUntil <= 3) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscriptions</h1>
        <p className="text-gray-600">Manage your recurring payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Total</p>
                <p className="text-xl font-bold text-gray-900">${totalMonthly.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-50 rounded-lg">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Yearly Total</p>
                <p className="text-xl font-bold text-gray-900">${totalYearly.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscriptions
              .sort((a, b) => getDaysUntilBilling(a.nextBilling) - getDaysUntilBilling(b.nextBilling))
              .slice(0, 3)
              .map((subscription) => {
                const daysUntil = getDaysUntilBilling(subscription.nextBilling);
                return (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: subscription.color }}
                      >
                        {subscription.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{subscription.name}</p>
                        <p className="text-sm text-gray-500">{formatDate(subscription.nextBilling)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${subscription.amount}</p>
                      <Badge className={getUrgencyColor(daysUntil)}>
                        {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* All Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: subscription.color }}
                  >
                    {subscription.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{subscription.name}</p>
                    <p className="text-sm text-gray-500">{subscription.category}</p>
                    <p className="text-sm text-gray-500">
                      Next billing: {formatDate(subscription.nextBilling)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">${subscription.amount}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg gradient-primary z-40"
        onClick={() => setShowAddSubscription(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddSubscriptionModal 
        open={showAddSubscription}
        onOpenChange={setShowAddSubscription}
      />
    </div>
  );
};

export default Subscriptions;
