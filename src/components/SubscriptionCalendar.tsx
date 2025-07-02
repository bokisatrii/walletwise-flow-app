
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Subscription } from "@/hooks/useSubscriptions";
import { useCurrency } from "@/contexts/CurrencyContext";
import { format, isSameDay, parseISO } from "date-fns";
import { CreditCard } from "lucide-react";

interface SubscriptionCalendarProps {
  subscriptions: Subscription[];
}

export const SubscriptionCalendar = ({ subscriptions }: SubscriptionCalendarProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const { displayCurrency, convertAmount, formatAmount } = useCurrency();

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
            <div 
              className="relative w-full h-full flex items-center justify-center cursor-pointer"
              onClick={() => setSelectedDate(date)}
            >
              <span className="text-sm">{format(date, 'd')}</span>
              {hasPayments && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
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
                {daySubscriptions.map((sub) => {
                  const convertedAmount = convertAmount(sub.amount, (sub.currency as any) || 'EUR', displayCurrency);
                  return (
                    <div key={sub.id} className="text-xs">
                      💳 {sub.name} – {formatAmount(convertedAmount, displayCurrency)}
                    </div>
                  );
                })}
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
      <CardContent className="space-y-6">
        {/* Larger Calendar */}
        <div className="w-full max-w-4xl mx-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
              month: "space-y-4 w-full",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-lg font-medium",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-sm text-center p-2",
              row: "flex w-full mt-2",
              cell: "flex-1 h-12 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
            }}
            modifiers={{
              hasSubscription: (date) => hasSubscriptions(date)
            }}
            modifiersStyles={{
              hasSubscription: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold'
              }
            }}
            components={{
              Day: ({ date }) => <DayContent date={date} />
            }}
          />
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Payment due</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💳</span>
            <span>Click or hover for details</span>
          </div>
        </div>
        
        {/* Selected Date Details */}
        {selectedDate && selectedDateSubscriptions.length > 0 && (
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-primary">
              Payments on {format(selectedDate, 'MMMM d, yyyy')}:
            </h4>
            <div className="space-y-3">
              {selectedDateSubscriptions.map((subscription) => {
                const convertedAmount = convertAmount(subscription.amount, (subscription.currency as any) || 'EUR', displayCurrency);
                return (
                  <div 
                    key={subscription.id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border"
                  >
                    <div>
                      <p className="font-medium text-sm">{subscription.name}</p>
                      <p className="text-xs text-gray-600">
                        {subscription.renewal_interval || 'Monthly'} • {subscription.description || 'No description'}
                      </p>
                    </div>
                    <span className="font-bold text-sm text-primary">
                      {formatAmount(convertedAmount, displayCurrency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {selectedDate && selectedDateSubscriptions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
            No payments scheduled for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
