export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  currency?: string;
}

export interface SimplePieChartProps {
  transactions: Transaction[];
  title?: string;
  showInsights?: boolean;
  animationDuration?: number;
  className?: string;
}

export const ANIMATION_CONFIG = {
  duration: 1000,
  begin: 0,
} as const;

export const EMPTY_STATE_CONFIG = {
  icon: "📊",
  emoji: "💸",
  title: "No expense data to display",
  subtitle: "Add some transactions to see your spending breakdown"
} as const;