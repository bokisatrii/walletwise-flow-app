
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

  // Custom day content to show payment indicators
  const DayContent = ({ date }: { date: Date }) => {
    const daySubscriptions = getSubscriptionsForDate(date);
    const hasPayments = daySubscriptions.length > 0;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-sm">{format(date, 'd')}</span>
              {hasPayments && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          </TooltipTrigger>
          {hasPayments && (
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-medium text-xs">
                  {format(date, 'MMM d, yyyy')}
                </p>
                {daySubscriptions.map((sub) => (
                  <div key={sub.id} className="text-xs">
                    💳 {sub.name} – ${sub.amount.toFixed(2)}
                  </div>
                ))}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

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
          className="rounded-md border w-full"
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
          components={{
            Day: ({ date }) => <DayContent date={date} />
          }}
        />
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Payment due</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💳</span>
            <span>Upcoming payment</span>
          </div>
        </div>
        
        {selectedDate && selectedDateSubscriptions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">
              Payments on {format(selectedDate, 'MMMM d, yyyy')}:
            </h4>
            <div className="space-y-2">
              {selectedDateSubscriptions.map((subscription) => (
                <div 
                  key={subscription.id}
                  className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                >
                  <div>
                    <p className="font-medium text-sm">{subscription.name}</p>
                    <p className="text-xs text-gray-600">
                      {subscription.renewal_interval || 'Monthly'} • {subscription.description || 'No description'}
                    </p>
                  </div>
                  <span className="font-bold text-sm text-blue-700">${subscription.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedDate && selectedDateSubscriptions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No payments scheduled for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
