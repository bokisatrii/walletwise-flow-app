import { useMemo } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

export const usePieChartDimensions = () => {
  const isMobile = useIsMobile();

  return useMemo(() => ({
    innerRadius: isMobile ? 45 : 65,
    outerRadius: isMobile ? 60 : 110,
    labelDistance: isMobile ? 12 : 40,
    fontSize: isMobile ? "14" : "11",
    containerHeight: isMobile ? "h-96" : "h-80",
    margin: isMobile 
      ? { top: 25, right: 25, bottom: 25, left: 25 } 
      : { top: 40, right: 40, bottom: 40, left: 40 }
  }), [isMobile]);
};