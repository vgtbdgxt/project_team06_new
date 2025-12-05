import { RouteSegment, EnvironmentGrid, GreenSpace, CrowdHotspot, BurdenWeights } from '../data/types';
import { calculateDistance } from './distance';

export function calculateBurdenScore(
  segment: RouteSegment,
  weights: BurdenWeights
): number {
  const burden =
    weights.crowd * segment.crowd +
    weights.noise * segment.noise +
    weights.aqi * (segment.aqi / 300) + // normalize AQI to 0-1
    weights.traffic * segment.traffic - // traffic congestion adds burden
    weights.green * segment.green; // green spaces reduce burden
  
  return Math.max(0, Math.min(1, burden)); // clamp to 0-1
}

export function getEnvironmentAtPoint(
  lat: number,
  lng: number,
  environmentGrid: EnvironmentGrid[],
  greenSpaces: GreenSpace[],
  crowdHotspots: CrowdHotspot[]
): {
  aqi: number;
  noise: number;
  green: number;
  crowd: number;
  traffic: number;
} {
  // Find nearest environment grid point
  let nearestGrid = environmentGrid[0];
  let minDist = Infinity;
  
  environmentGrid.forEach(grid => {
    const dist = calculateDistance(lat, lng, grid.lat, grid.lng);
    if (dist < minDist) {
      minDist = dist;
      nearestGrid = grid;
    }
  });
  
  // Check proximity to green spaces
  let green = 0;
  greenSpaces.forEach(gs => {
    const dist = calculateDistance(lat, lng, gs.lat, gs.lng);
    if (dist < 0.5) { // within 0.5 miles
      green = Math.max(green, gs.size * (1 - dist / 0.5));
    }
  });
  
  // Check proximity to crowd hotspots
  let crowd = 0;
  crowdHotspots.forEach(ch => {
    const dist = calculateDistance(lat, lng, ch.lat, ch.lng);
    if (dist < 1.0) { // within 1 mile
      crowd = Math.max(crowd, ch.density * (1 - dist / 1.0));
    }
  });
  
  return {
    aqi: nearestGrid.aqi,
    noise: nearestGrid.noise,
    green,
    crowd,
    traffic: nearestGrid.traffic,
  };
}

