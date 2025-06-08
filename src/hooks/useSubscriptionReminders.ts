
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { toast } from "sonner";
import { format, addDays, isSameDay, parseISO } from "date-fns";

export const useSubscriptionReminders = () => {
  const { session } = useAuth();
  const { subscriptions, isLoading } = useSubscriptions();
  const [hasCheckedToday, setHasCheckedToday] = useState(false);

  useEffect(() => {
    // Only check reminders when user is logged in, subscriptions are loaded, and we haven't checked today
    if (!session?.user || isLoading || hasCheckedToday || subscriptions.length === 0) {
      return;
    }

    // Check if we've already shown reminders today
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastReminderDate = localStorage.getItem('lastReminderDate');
    
    if (lastReminderDate === today) {
      setHasCheckedToday(true);
      return;
    }

    // Get tomorrow's date
    const tomorrow = addDays(new Date(), 1);
    
    // Find subscriptions due tomorrow
    const subscriptionsDueTomorrow = subscriptions.filter(subscription => {
      const paymentDate = parseISO(subscription.next_payment_date);
      return isSameDay(paymentDate, tomorrow);
    });

    // Show toast notifications for each subscription due tomorrow
    subscriptionsDueTomorrow.forEach(subscription => {
      // Check if user has dismissed this specific reminder today
      const dismissedKey = `dismissed_${subscription.id}_${today}`;
      const isDismissed = localStorage.getItem(dismissedKey) === 'true';
      
      if (!isDismissed) {
        const amount = subscription.amount.toFixed(2);
        const message = `💸 ${subscription.name} subscription due tomorrow – $${amount}`;
        
        toast(message, {
          duration: 8000,
          action: {
            label: "Dismiss",
            onClick: () => {
              // Store dismissal in localStorage
              localStorage.setItem(dismissedKey, 'true');
            }
          }
        });
      }
    });

    // Mark that we've checked reminders today
    localStorage.setItem('lastReminderDate', today);
    setHasCheckedToday(true);

    console.log(`Checked subscription reminders: ${subscriptionsDueTomorrow.length} due tomorrow`);
  }, [session, subscriptions, isLoading, hasCheckedToday]);

  return {
    hasCheckedToday
  };
};
