
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  next_payment_date: string;
  description: string | null;
  renewal_interval: string | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionUpdate {
  name?: string;
  amount?: number;
  next_payment_date?: string;
  description?: string | null;
  renewal_interval?: string | null;
  currency?: string | null;
}

export const useSubscriptions = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const subscriptionsQuery = useQuery({
    queryKey: ["subscriptions", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No user session");
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("next_payment_date", { ascending: true });

      if (error) throw error;
      return data as Subscription[];
    },
    enabled: !!session?.user?.id,
  });

  const addSubscriptionMutation = useMutation({
    mutationFn: async (subscription: Omit<Subscription, "id" | "user_id" | "created_at" | "updated_at">) => {
      if (!session?.user?.id) throw new Error("No user session");

      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          ...subscription,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription added successfully!");
    },
    onError: (error) => {
      console.error("Error adding subscription:", error);
      toast.error("Failed to add subscription");
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SubscriptionUpdate }) => {
      if (!session?.user?.id) throw new Error("No user session");

      const { data, error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id)
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    },
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription");
    },
  });

  return {
    subscriptions: subscriptionsQuery.data || [],
    isLoading: subscriptionsQuery.isLoading,
    error: subscriptionsQuery.error,
    addSubscription: addSubscriptionMutation.mutate,
    updateSubscription: updateSubscriptionMutation.mutate,
    deleteSubscription: deleteSubscriptionMutation.mutate,
    isAddingSubscription: addSubscriptionMutation.isPending,
    isUpdatingSubscription: updateSubscriptionMutation.isPending,
    isDeletingSubscription: deleteSubscriptionMutation.isPending,
  };
};
