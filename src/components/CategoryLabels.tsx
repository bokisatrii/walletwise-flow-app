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
        
        // Calculate position outside the donut with better spacing
        const labelRadius = radius + 40; // Increased distance for better spacing
        const x = centerX + Math.cos(radians) * labelRadius;
        const y = centerY + Math.sin(radians) * labelRadius;
        
        // Get darkened color for the label
        const originalColor = CHART_COLORS[index % CHART_COLORS.length];
        const darkenedColor = darkenColor(originalColor, 30);
        
        // Better text positioning based on angle
        let textAlign: 'left' | 'center' | 'right' = 'center';
        let offsetX = 0;
        
        // Adjust text alignment based on position around circle
        if (radians > -Math.PI/4 && radians < Math.PI/4) {
          textAlign = 'left';
          offsetX = 10;
        } else if (radians > 3*Math.PI/4 || radians < -3*Math.PI/4) {
          textAlign = 'right';
          offsetX = -10;
        }
        
        // Update cumulative angle for next iteration
        cumulativeAngle += segmentAngle;
        
        return (
          <div
            key={item.name}
            className="absolute text-sm font-medium transition-all duration-300 animate-fade-in whitespace-nowrap"
            style={{
              left: x + offsetX - (textAlign === 'center' ? 50 : textAlign === 'right' ? 100 : 0),
              top: y - 8,
              color: darkenedColor,
              textAlign,
              fontSize: '11px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)',
              animationDelay: `${index * 100}ms`,
              minWidth: textAlign === 'center' ? '100px' : 'auto'
            }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};