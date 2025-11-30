// src/utils/colorScale.ts

// Simple color scale based on distance ratio (0 = close, 1 = far)
export function getMarkerColor(distance: number, maxDistance: number): string {
  if (!maxDistance || distance <= 0) {
    // default blue if no distance or same location
    return "#3b82f6";
  }

  const ratio = Math.min(distance / maxDistance, 1);

  if (ratio < 0.33) {
    // near
    return "#22c55e"; // green
  } else if (ratio < 0.66) {
    // mid
    return "#eab308"; // yellow
  } else {
    // far
    return "#ef4444"; // red
  }
}
