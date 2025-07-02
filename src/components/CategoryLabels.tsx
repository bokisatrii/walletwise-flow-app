import { ChartDataItem } from '@/hooks/useChartData';
import { darkenColor, CHART_COLORS } from '@/lib/chartUtils';

interface CategoryLabelsProps {
  data: ChartDataItem[];
  centerX: number;
  centerY: number;
  radius: number;
}

export const CategoryLabels = ({ data, centerX, centerY, radius }: CategoryLabelsProps) => {
  // Calculate cumulative angles for positioning
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {data.map((item, index) => {
        // Calculate the angle span for this segment
        const segmentAngle = (item.value / totalValue) * 360;
        const midAngle = cumulativeAngle + segmentAngle / 2;
        
        // Convert to radians for trigonometry
        const radians = (midAngle - 90) * (Math.PI / 180); // -90 to start from top
        
        // Calculate position outside the donut
        const labelRadius = radius + 25; // Position labels 25px outside the ring
        const x = centerX + Math.cos(radians) * labelRadius;
        const y = centerY + Math.sin(radians) * labelRadius;
        
        // Get darkened color for the label
        const originalColor = CHART_COLORS[index % CHART_COLORS.length];
        const darkenedColor = darkenColor(originalColor, 25);
        
        // Update cumulative angle for next iteration
        cumulativeAngle += segmentAngle;
        
        return (
          <div
            key={item.name}
            className="absolute text-sm font-medium transition-all duration-300 animate-fade-in"
            style={{
              left: x - 50, // Center the text (approximate width compensation)
              top: y - 10,  // Center the text vertically
              color: darkenedColor,
              width: '100px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)',
              animationDelay: `${index * 100}ms`
            }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};