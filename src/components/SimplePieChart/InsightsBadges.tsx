import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { ChartInsights } from "@/hooks/useChartData";
import { useCurrency } from "@/contexts/CurrencyContext";

interface InsightsBadgesProps {
  showInsights: boolean;
  insights: ChartInsights;
}

export const InsightsBadges = ({ showInsights, insights }: InsightsBadgesProps) => {
  const { formatAmount, displayCurrency } = useCurrency();

  if (!showInsights) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="secondary" className="text-xs">
        <TrendingUp className="h-3 w-3 mr-1" />
        Top: {insights.topCategory} ({insights.topPercentage.toFixed(0)}%)
      </Badge>
      <Badge variant="outline" className="text-xs">
        Total: {formatAmount(insights.totalSpent, displayCurrency)}
      </Badge>
      {insights.categoriesCount > 1 && (
        <Badge variant="outline" className="text-xs">
          {insights.categoriesCount} categories
        </Badge>
      )}
    </div>
  );
};