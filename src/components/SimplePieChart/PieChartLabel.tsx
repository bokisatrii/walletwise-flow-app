import { useCallback } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { darkenColor, CHART_COLORS } from "@/lib/chartUtils";

export const usePieChartLabel = (labelDistance: number, fontSize: string) => {
  const isMobile = useIsMobile();

  return useCallback((props: any) => {
    const { cx, cy, midAngle, outerRadius, value, index, name } = props;
    
    // Early return for very small percentages to avoid clutter
    if (value < (isMobile ? 3 : 2)) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + labelDistance;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Get darkened color for this segment
    const originalColor = CHART_COLORS[index % CHART_COLORS.length];
    const labelColor = darkenColor(originalColor, 30);
    
    // Determine text anchor based on position
    const textAnchor = x > cx ? 'start' : x < cx ? 'end' : 'middle';

    return (
      <text 
        x={x} 
        y={y} 
        fill={labelColor}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="600"
        style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
      >
        {name} ({value.toFixed(1)}%)
      </text>
    );
  }, [labelDistance, fontSize, isMobile]);
};