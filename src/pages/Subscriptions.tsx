
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar, DollarSign, Trash2, Edit } from "lucide-react";
import { AddSubscriptionForm } from "@/components/AddSubscriptionForm";
import { EditSubscriptionModal } from "@/components/EditSubscriptionModal";
import { SubscriptionCalendar } from "@/components/SubscriptionCalendar";
import { useSubscriptions, Subscription } from "@/hooks/useSubscriptions";
import { format, parseISO } from "date-fns";

const Subscriptions = () => {
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [showEditSubscription, setShowEditSubscription] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const { 
    subscriptions, 
    isLoading, 
    deleteSubscription, 
    isDeletingSubscription 
  } = useSubscriptions();

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const totalYearly = totalMonthly * 12;

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowEditSubscription(true);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6 animate-fade-in">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscriptions</h1>
          <p className="text-gray-600">Loading your subscriptions...</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
              <div className="p-2 bg-primary/10 rounded-lg">
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
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Yearly Total</p>
                <p className="text-xl font-bold text-gray-900">${totalYearly.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No subscriptions yet</p>
              <Button onClick={() => setShowAddSubscription(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Subscription
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Payment</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.name}</TableCell>
                      <TableCell>${subscription.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {subscription.renewal_interval || 'Monthly'}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(subscription.next_payment_date)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-gray-600 max-w-[200px] truncate">
                        {subscription.description || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSubscription(subscription)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSubscription(subscription.id)}
                            disabled={isDeletingSubscription}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar View */}
      {subscriptions.length > 0 && (
        <SubscriptionCalendar subscriptions={subscriptions} />
      )}

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
        onClick={() => setShowAddSubscription(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddSubscriptionForm 
        open={showAddSubscription}
        onOpenChange={setShowAddSubscription}
      />

      <EditSubscriptionModal 
        open={showEditSubscription}
        onOpenChange={setShowEditSubscription}
        subscription={editingSubscription}
      />
    </div>
  );
};

export default Subscriptions;
