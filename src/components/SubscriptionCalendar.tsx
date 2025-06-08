
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@/hooks/useSubscriptions";
import { format, isSameDay, parseISO } from "date-fns";
import { CreditCard } from "lucide-react";

interface SubscriptionCalendarProps {
  subscriptions: Subscription[];
}

export const SubscriptionCalendar = ({ subscriptions }: SubscriptionCalendarProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // Get subscriptions for a specific date
  const getSubscriptionsForDate = (date: Date) => {
    return subscriptions.filter(sub => 
      isSameDay(parseISO(sub.next_payment_date), date)
    );
  };

  // Check if a date has subscriptions
  const hasSubscriptions = (date: Date) => {
    return getSubscriptionsForDate(date).length > 0;
  };

  const selectedDateSubscriptions = selectedDate ? getSubscriptionsForDate(selectedDate) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            hasSubscription: (date) => hasSubscriptions(date)
          }}
          modifiersStyles={{
            hasSubscription: {
              backgroundColor: '#3B82F6',
              color: 'white',
              fontWeight: 'bold'
            }
          }}
        />
        
        {selectedDate && selectedDateSubscriptions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">
              Payments on {format(selectedDate, 'MMMM d, yyyy')}:
            </h4>
            <div className="space-y-2">
              {selectedDateSubscriptions.map((subscription) => (
                <div 
                  key={subscription.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{subscription.name}</p>
                    {subscription.description && (
                      <p className="text-xs text-gray-600">{subscription.description}</p>
                    )}
                  </div>
                  <span className="font-bold text-sm">${subscription.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedDate && selectedDateSubscriptions.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            No payments scheduled for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
