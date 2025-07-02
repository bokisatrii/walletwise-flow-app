import React, { useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useChartData } from "@/hooks/useChartData";
import { ChartLegend } from "@/components/ChartLegend";
import { ChartTooltip } from "@/components/ChartTooltip";
import { getExplosionClass, CHART_COLORS, darkenColor } from "@/lib/chartUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  currency?: string;
}

interface SimplePieChartProps {
  transactions: Transaction[];
  title?: string;
  showInsights?: boolean;
  animationDuration?: number;
  className?: string;
}

// Konstante izdvojene za lakše održavanje
const ANIMATION_CONFIG = {
  duration: 1000,
  begin: 0,
} as const;

const EMPTY_STATE_CONFIG = {
  icon: "📊",
  emoji: "💸",
  title: "No expense data to display",
  subtitle: "Add some transactions to see your spending breakdown"
} as const;

export const SimplePieChart = ({ 
  transactions, 
  title = "Where did my money go?", 
  showInsights = true,
  animationDuration = ANIMATION_CONFIG.duration,
  className = ""
}: SimplePieChartProps) => {
  const { formatAmount, displayCurrency } = useCurrency();
  const { chartDataWithPercentages, insights } = useChartData(transactions);
  const isMobile = useIsMobile();

  // Memoized responsive dimensions
  const dimensions = useMemo(() => ({
    innerRadius: isMobile ? 45 : 65,
    outerRadius: isMobile ? 75 : 110,
    labelDistance: isMobile ? 18 : 40,
    fontSize: isMobile ? "13" : "11",
    containerHeight: isMobile ? "h-80" : "h-80",
    margin: isMobile 
      ? { top: 35, right: 35, bottom: 35, left: 35 } 
      : { top: 40, right: 40, bottom: 40, left: 40 }
  }), [isMobile]);

  // Memoized label renderer
  const renderOutsideLabel = useCallback((props: any) => {
    const { cx, cy, midAngle, outerRadius, value, index, name } = props;
    
    // Early return for very small percentages to avoid clutter
    if (value < 2) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + dimensions.labelDistance;
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
        fontSize={dimensions.fontSize}
        fontWeight="600"
        style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
      >
        {name} ({value.toFixed(1)}%)
      </text>
    );
  }, [dimensions.labelDistance, dimensions.fontSize]);

  // Memoized cell renderer for better performance
  const renderCell = useCallback((entry: any, index: number) => {
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

  // Memoized empty state
  const EmptyState = useMemo(() => (
    <Card className={`animate-fade-in ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>{EMPTY_STATE_CONFIG.emoji}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <PieChartIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">{EMPTY_STATE_CONFIG.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{EMPTY_STATE_CONFIG.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  ), [title, className]);

  // Early return for empty data
  if (chartDataWithPercentages.length === 0) {
    return EmptyState;
  }

  // Memoized insights badges
  const InsightsBadges = useMemo(() => {
    if (!showInsights) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="secondary" className="text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          Top: {insights.topCategory} ({insights.topPercentage.toFixed(0)}%)
        </Badge>
        {insights.categoriesCount > 1 && (
          <Badge variant="outline" className="text-xs">
            {insights.categoriesCount} categories
          </Badge>
        )}
      </div>
    );
  }, [showInsights, insights, formatAmount, displayCurrency]);

  return (
    <Card className={`animate-fade-in ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>💸</span>
          {title}
        </CardTitle>
        {InsightsBadges}
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