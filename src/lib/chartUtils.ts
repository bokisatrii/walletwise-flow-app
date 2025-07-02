// Function to determine explosion direction based on segment angle
export const getExplosionClass = (midAngle: number): string => {
  // Normalize angle to 0-360 range
  const normalizedAngle = ((midAngle % 360) + 360) % 360;
  
  if (normalizedAngle >= 0 && normalizedAngle < 45) return 'explode-right';
  if (normalizedAngle >= 45 && normalizedAngle < 90) return 'explode-bottom-right';
  if (normalizedAngle >= 90 && normalizedAngle < 135) return 'explode-bottom';
  if (normalizedAngle >= 135 && normalizedAngle < 180) return 'explode-bottom-left';
  if (normalizedAngle >= 180 && normalizedAngle < 225) return 'explode-left';
  if (normalizedAngle >= 225 && normalizedAngle < 270) return 'explode-top-left';
  if (normalizedAngle >= 270 && normalizedAngle < 315) return 'explode-top';
  return 'explode-top-right';
};

export const CHART_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C',
  '#8DD1E1', '#D084D0'
];

// Function to darken a color by a percentage
export const darkenColor = (color: string, percent: number = 20): string => {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Darken each component
  const darkenedR = Math.max(0, Math.floor(r * (100 - percent) / 100));
  const darkenedG = Math.max(0, Math.floor(g * (100 - percent) / 100));
  const darkenedB = Math.max(0, Math.floor(b * (100 - percent) / 100));
  
  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;
};