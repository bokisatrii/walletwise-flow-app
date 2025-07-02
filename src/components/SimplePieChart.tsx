import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
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
}

export const SimplePieChart = ({ transactions, title = "Where did my money go?" }: SimplePieChartProps) => {
  const { formatAmount, displayCurrency } = useCurrency();
  const { chartDataWithPercentages, insights } = useChartData(transactions);
  const isMobile = useIsMobile();

  // Responsive dimensions
  const dimensions = {
    innerRadius: isMobile ? 45 : 65,
    outerRadius: isMobile ? 75 : 110,
    labelDistance: isMobile ? 25 : 40,
    fontSize: isMobile ? "12" : "11",
    containerHeight: isMobile ? "h-64" : "h-80",
    margin: isMobile ? { top: 25, right: 25, bottom: 25, left: 25 } : { top: 40, right: 40, bottom: 40, left: 40 }
  };

  // Custom label renderer for outside labels
  const renderOutsideLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value, index, name } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + dimensions.labelDistance;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Get darkened color for this segment
    const originalColor = CHART_COLORS[index % CHART_COLORS.length];
    const labelColor = darkenColor(originalColor, 30);
    
    // Determine text anchor based on position
    let textAnchor = 'middle';
    if (x > cx) {
      textAnchor = 'start';
    } else if (x < cx) {
      textAnchor = 'end';
    }

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
  };

  if (chartDataWithPercentages.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💸</span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-muted-foreground">No expense data to display</p>
            <p className="text-sm text-muted-foreground mt-1">Add some transactions to see your spending breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>💸</span>
          {title}
        </CardTitle>
        
        {/* Quick Insights */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Top: {insights.topCategory} ({insights.topPercentage.toFixed(0)}%)
          </Badge>
          <Badge variant="outline" className="text-xs">
            Total: {formatAmount(insights.totalSpent, displayCurrency)}
          </Badge>
        </div>
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
                paddingAngle={0}
                animationBegin={0}
                animationDuration={1000}
                labelLine={false}
                label={renderOutsideLabel}
                stroke="hsl(var(--background))"
                strokeWidth={4}
              >
                {chartDataWithPercentages.map((entry, index) => {
                  // Calculate the midpoint angle for this segment to determine explosion direction
                  const startAngle = chartDataWithPercentages.slice(0, index).reduce((sum, item) => 
                    sum + (parseFloat(item.percentage) * 3.6), 0
                  );
                  const endAngle = startAngle + (parseFloat(entry.percentage) * 3.6);
                  const midAngle = (startAngle + endAngle) / 2;
                  
                  // Convert angle to determine explosion direction
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
                })}
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