import { useCallback } from 'react';
import { Cell } from "recharts";
import { ChartDataItem } from "@/hooks/useChartData";
import { getExplosionClass, CHART_COLORS } from "@/lib/chartUtils";

export const usePieChartCell = (chartDataWithPercentages: ChartDataItem[]) => {
  return useCallback((entry: any, index: number) => {
    // Calculate explosion direction
    const startAngle = chartDataWithPercentages.slice(0, index).reduce((sum, item) => 
      sum + (parseFloat(item.percentage) * 3.6), 0
    );
    const endAngle = startAngle + (parseFloat(entry.percentage) * 3.6);
    const midAngle = (startAngle + endAngle) / 2;
    const explosionClass = getExplosionClass(midAngle);
    
    return (
      <Cell 
        key={`cell-${index}`} 
        fill={CHART_COLORS[index % CHART_COLORS.length]}
        className={`segment-hover ${explosionClass} transition-all duration-300 cursor-pointer`}
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          transformOrigin: "center"
        }}
      />
    );
  }, [chartDataWithPercentages]);
};