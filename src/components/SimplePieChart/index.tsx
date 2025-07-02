import React, { useMemo } from 'react';
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import { ChartLegend } from "@/components/ChartLegend";
import { ChartTooltip } from "@/components/ChartTooltip";
import { CHART_COLORS } from "@/lib/chartUtils";
import { SimplePieChartProps, ANIMATION_CONFIG } from './types';
import { usePieChartDimensions } from './usePieChartDimensions';
import { EmptyState } from './EmptyState';
import { InsightsBadges } from './InsightsBadges';
import { usePieChartLabel } from './PieChartLabel';
import { usePieChartCell } from './PieChartCell';

export const SimplePieChart = ({ 
  transactions, 
  title = "Where did my money go?", 
  showInsights = true,
  animationDuration = ANIMATION_CONFIG.duration,
  className = ""
}: SimplePieChartProps) => {
  const { chartDataWithPercentages, insights } = useChartData(transactions);
  const dimensions = usePieChartDimensions();
  
  // Memoized label renderer
  const renderOutsideLabel = usePieChartLabel(dimensions.labelDistance, dimensions.fontSize);

  // Memoized cell renderer for better performance
  const renderCell = usePieChartCell(chartDataWithPercentages);

  // Memoized empty state
  const EmptyStateComponent = useMemo(() => (
    <EmptyState title={title} className={className} />
  ), [title, className]);

  // Early return for empty data
  if (chartDataWithPercentages.length === 0) {
    return EmptyStateComponent;
  }

  // Memoized insights badges
  const InsightsBadgesComponent = useMemo(() => (
    <InsightsBadges showInsights={showInsights} insights={insights} />
  ), [showInsights, insights]);

  return (
    <Card className={`animate-fade-in ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>💸</span>
          {title}
        </CardTitle>
        {InsightsBadgesComponent}
      </CardHeader>
      
      <CardContent>
        <div className={`relative ${dimensions.containerHeight}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={dimensions.margin}>
              <Pie
                data={chartDataWithPercentages}
                cx="50%"
                cy="50%"
                innerRadius={dimensions.innerRadius}
                outerRadius={dimensions.outerRadius}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={chartDataWithPercentages.length > 6 ? 1 : 0}
                animationBegin={ANIMATION_CONFIG.begin}
                animationDuration={animationDuration}
                labelLine={false}
                label={renderOutsideLabel}
                stroke="hsl(var(--background))"
                strokeWidth={4}
              >
                {chartDataWithPercentages.map(renderCell)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <ChartLegend 
          data={chartDataWithPercentages} 
          colors={CHART_COLORS}
          maxItems={8}
        />
      </CardContent>
    </Card>
  );
};