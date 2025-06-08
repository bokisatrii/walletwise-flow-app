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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return [];
        }

        console.log('Fetching transactions for user:', user.id);

        let query = supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (month && month !== 'all') {
          const startDate = `${month}-01`;
          const year = parseInt(month.split('-')[0]);
          const monthNum = parseInt(month.split('-')[1]);
          const lastDay = new Date(year, monthNum, 0).getDate();
          const endDate = `${month}-${lastDay.toString().padStart(2, '0')}`;
          
          console.log(`Filtering by month ${month}: ${startDate} to ${endDate}`);
          query = query.gte('date', startDate).lte('date', endDate);
        }

        if (category && category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Transactions query error:', error);
          throw error;
        }
        
        console.log(`Successfully loaded ${data?.length || 0} transactions:`, data);
        return data as Transaction[] || [];
      } catch (error) {
        console.error('Error in useTransactions:', error);
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('JWT') || 
          error?.message?.includes('RLS') ||
          error?.code === 'PGRST301' || 
          error?.code === 'PGRST116') {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionInsert) => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('You must be logged in to create transactions');
        }

        console.log('Creating transaction for user:', user.id);
        console.log('Transaction data:', transaction);

        const { data, error } = await supabase
          .from('transactions')
          .insert([{ 
            ...transaction, 
            user_id: user.id 
          }])
          .select()
          .single();

        if (error) {
          console.error('Create transaction error:', error);
          throw error;
        }

        console.log('Transaction created successfully:', data);
        return data as Transaction;
      } catch (error) {
        console.error('Create transaction error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Transaction creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaction added!",
        description: "Your transaction has been recorded successfully",
      });
    },
    onError: (error: any) => {
      console.error('Transaction creation failed:', error);
      let errorMessage = "Failed to add transaction";
      
      if (error?.message?.includes('JWT') || error?.code === 'PGRST301') {
        errorMessage = "Please sign in to add transactions";
      } else if (error?.message?.includes('RLS') || error?.message?.includes('row-level security')) {
        errorMessage = "Unable to save transaction. Please ensure you're logged in.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('You must be logged in to delete transactions');
        }

        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Delete transaction error:', error);
          throw error;
        }
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
      let errorMessage = "Failed to delete transaction";
      
      if (error?.message?.includes('JWT') || error?.code === 'PGRST301') {
        errorMessage = "Please sign in to delete transactions";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
