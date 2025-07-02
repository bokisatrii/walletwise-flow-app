import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { EMPTY_STATE_CONFIG } from './types';

interface EmptyStateProps {
  title: string;
  className: string;
}

export const EmptyState = ({ title, className }: EmptyStateProps) => (
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
);