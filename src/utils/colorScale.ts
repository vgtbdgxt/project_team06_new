/**
 * Generate a color based on distance from user location
 * Closer clinics = darker/saturated colors
 * Farther clinics = lighter/grey colors
 * @param distance Distance in kilometers
 * @param maxDistance Maximum distance threshold
 * @returns Hex color string
 */
export function getDistanceColor(distance: number, maxDistance: number): string {
  // Normalize distance to 0-1 range
  const normalized = Math.min(distance / maxDistance, 1);
  
  // Closer = darker blue/purple, farther = light grey
  if (normalized <= 0.25) {
    // Very close: dark saturated blue
    return '#1e40af'; // blue-800
  } else if (normalized <= 0.5) {
    // Close: medium blue
    return '#3b82f6'; // blue-500
  } else if (normalized <= 0.75) {
    // Medium: light blue
    return '#60a5fa'; // blue-400
  } else {
    // Far: light grey
    return '#9ca3af'; // gray-400
  }
}

/**
 * Get marker icon color based on distance
 * @param distance Distance in kilometers
 * @param maxDistance Maximum distance threshold
 * @returns Color name for Leaflet icon
 */
export function getMarkerColor(distance: number, maxDistance: number): string {
  const normalized = Math.min(distance / maxDistance, 1);
  
  if (normalized <= 0.25) return 'darkblue';
  if (normalized <= 0.5) return 'blue';
  if (normalized <= 0.75) return 'lightblue';
  return 'gray';
}

