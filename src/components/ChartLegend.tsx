import { useCurrency } from '@/contexts/CurrencyContext';
import { ChartDataItem } from '@/hooks/useChartData';

interface ChartLegendProps {
  data: ChartDataItem[];
  colors: string[];
  maxItems?: number;
}

export const ChartLegend = ({ data, colors, maxItems = 8 }: ChartLegendProps) => {
  const { formatAmount, displayCurrency } = useCurrency();

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-foreground mb-3">Spending Breakdown</h4>
      <div className="grid grid-cols-1 gap-3">
        {data.slice(0, maxItems).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {formatAmount(item.value, displayCurrency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.percentage}%
              </p>
            </div>
          </div>
        ))}
        {data.length > maxItems && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            +{data.length - maxItems} more categories
          </div>
        )}
      </div>
    </div>
  );
};