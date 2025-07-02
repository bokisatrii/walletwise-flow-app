import { useCurrency } from '@/contexts/CurrencyContext';
import { ChartInsights } from '@/hooks/useChartData';

interface ChartCenterInfoProps {
  insights: ChartInsights;
}

export const ChartCenterInfo = ({ insights }: ChartCenterInfoProps) => {
  const { formatAmount, displayCurrency } = useCurrency();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">
          {formatAmount(insights.totalSpent, displayCurrency)}
        </p>
        <p className="text-sm text-muted-foreground">Total Spent</p>
        <p className="text-xs text-muted-foreground mt-1">
          Top: {insights.topCategory}
        </p>
      </div>
    </div>
  );
};