
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  type: 'income' | 'expense';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface TransactionInsert {
  amount: number;
  category: string;
  description?: string;
  date: string;
  type: 'income' | 'expense';
}

export const useTransactions = (month?: string, category?: string) => {
  return useQuery({
    queryKey: ['transactions', month, category],
    queryFn: async () => {
      try {
        let query = supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (month) {
          const startDate = `${month}-01`;
          const endDate = `${month}-31`;
          query = query.gte('date', startDate).lte('date', endDate);
        }

        if (category && category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Transactions query error:', error);
          toast({
            title: "Data Error",
            description: "Failed to load transactions. Please try again.",
            variant: "destructive",
          });
          return [];
        }
        
        return data as Transaction[] || [];
      } catch (error) {
        console.error('Unexpected error in useTransactions:', error);
        toast({
          title: "Unexpected Error",
          description: "Something went wrong while loading transactions.",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error?.message?.includes('JWT') || error?.code === 'PGRST301') {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionInsert) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('transactions')
          .insert([{ ...transaction, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        return data as Transaction;
      } catch (error) {
        console.error('Create transaction error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaction added!",
        description: "Your transaction has been recorded successfully",
      });
    },
    onError: (error: any) => {
      console.error('Transaction creation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Delete transaction error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed",
      });
    },
    onError: (error: any) => {
      console.error('Transaction deletion failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });
};
