
import { useCreateTransaction } from "./useTransactions";
import { toast } from "@/hooks/use-toast";

export const useDemoData = () => {
  const createTransaction = useCreateTransaction();

  const createDemoTransactions = async () => {
    try {
      const demoTransactions = [
        // Current month - December 2024
        { amount: 3500, category: "Salary", description: "Monthly salary", date: "2024-12-01", type: "income" as const },
        { amount: 800, category: "Freelance", description: "Web design project", date: "2024-12-15", type: "income" as const },
        
        // Expenses - varied and realistic
        { amount: 450, category: "Bills & Utilities", description: "Monthly rent", date: "2024-12-01", type: "expense" as const },
        { amount: 120, category: "Food & Dining", description: "Weekly shopping", date: "2024-12-02", type: "expense" as const },
        { amount: 45, category: "Food & Dining", description: "Lunch with colleagues", date: "2024-12-03", type: "expense" as const },
        { amount: 80, category: "Transportation", description: "Gas for car", date: "2024-12-04", type: "expense" as const },
        { amount: 25, category: "Entertainment", description: "Movie tickets", date: "2024-12-05", type: "expense" as const },
        { amount: 200, category: "Shopping", description: "Winter clothes", date: "2024-12-06", type: "expense" as const },
        { amount: 60, category: "Bills & Utilities", description: "Electricity bill", date: "2024-12-07", type: "expense" as const },
        { amount: 35, category: "Food & Dining", description: "Pizza delivery", date: "2024-12-08", type: "expense" as const },
        { amount: 150, category: "Healthcare", description: "Doctor visit", date: "2024-12-09", type: "expense" as const },
        { amount: 90, category: "Food & Dining", description: "Weekly shopping", date: "2024-12-10", type: "expense" as const },
        
        // November 2024
        { amount: 3500, category: "Salary", description: "Monthly salary", date: "2024-11-01", type: "income" as const },
        { amount: 500, category: "Freelance", description: "Logo design", date: "2024-11-20", type: "income" as const },
        { amount: 450, category: "Bills & Utilities", description: "Monthly rent", date: "2024-11-01", type: "expense" as const },
        { amount: 280, category: "Food & Dining", description: "Monthly shopping", date: "2024-11-15", type: "expense" as const },
        { amount: 120, category: "Entertainment", description: "Concert tickets", date: "2024-11-22", type: "expense" as const },
        { amount: 200, category: "Transportation", description: "Car maintenance", date: "2024-11-10", type: "expense" as const },
        { amount: 85, category: "Food & Dining", description: "Restaurant dinner", date: "2024-11-25", type: "expense" as const },
        
        // October 2024
        { amount: 3500, category: "Salary", description: "Monthly salary", date: "2024-10-01", type: "income" as const },
        { amount: 300, category: "Freelance", description: "Consulting work", date: "2024-10-15", type: "income" as const },
        { amount: 450, category: "Bills & Utilities", description: "Monthly rent", date: "2024-10-01", type: "expense" as const },
        { amount: 250, category: "Food & Dining", description: "Monthly shopping", date: "2024-10-12", type: "expense" as const },
        { amount: 180, category: "Shopping", description: "New laptop accessories", date: "2024-10-18", type: "expense" as const },
        { amount: 95, category: "Entertainment", description: "Streaming subscriptions", date: "2024-10-05", type: "expense" as const },
      ];

      let successCount = 0;
      const total = demoTransactions.length;

      for (const transaction of demoTransactions) {
        try {
          await new Promise(resolve => setTimeout(resolve, 200)); // Longer delay to avoid overwhelming
          await createTransaction.mutateAsync(transaction);
          successCount++;
          console.log(`Created demo transaction ${successCount}/${total}:`, transaction.description);
        } catch (error) {
          console.error("Failed to create demo transaction:", error);
          // Continue with next transaction instead of stopping
        }
      }

      if (successCount === total) {
        toast({
          title: "Demo data loaded!",
          description: `Created ${successCount} sample transactions`,
        });
      } else if (successCount > 0) {
        toast({
          title: "Demo data partially loaded",
          description: `Created ${successCount} of ${total} transactions`,
        });
      } else {
        toast({
          title: "Demo setup incomplete",
          description: "Some demo transactions couldn't be created",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating demo data:", error);
      toast({
        title: "Demo Error",
        description: "Failed to set up demo data",
        variant: "destructive",
      });
    }
  };

  return {
    createDemoTransactions,
    isCreating: createTransaction.isPending
  };
};
