import { useCurrency } from '@/contexts/CurrencyContext';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
  const { formatAmount, displayCurrency } = useCurrency();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-4 border border-border rounded-lg shadow-xl animate-scale-in backdrop-blur-sm">
        <p className="font-semibold text-base mb-1">{data.name}</p>
        <p className="text-primary font-bold text-lg">{formatAmount(data.value, displayCurrency)}</p>
        <p className="text-muted-foreground text-sm">
          {data.percentage}% of total spending
        </p>
        <div className="mt-2 pt-2 border-t border-border">
          
        </div>
      </div>
    );
  }
  return null;
};