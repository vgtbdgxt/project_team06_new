import { Route, RouteSegment, BurdenWeights, TravelMode } from '../data/types';
import { calculateDistance } from './distance';
import { getEnvironmentAtPoint, calculateBurdenScore } from './burden';
import { environmentGrid } from '../data/environment';
import { greenSpaces } from '../data/greenSpaces';
import { crowdHotspots } from '../data/crowds';

export function generateMockRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  mode: TravelMode,
  routeType: 'fastest' | 'low-stress' | 'balanced',
  weights: BurdenWeights
): Route {
  const segments: RouteSegment[] = [];
  
  // Generate intermediate waypoints based on route type
  const numSegments = 8;
  const waypoints: Array<{ lat: number; lng: number }> = [];
  
  if (routeType === 'fastest') {
    // Direct route - may pass through crowded/noisy areas for speed
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      waypoints.push({
        lat: startLat + (endLat - startLat) * t + (Math.random() - 0.5) * 0.01,
        lng: startLng + (endLng - startLng) * t + (Math.random() - 0.5) * 0.01,
      });
    }
  } else if (routeType === 'low-stress') {
    // Route that actively avoids crowds and seeks green spaces
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      // Find nearest green space
      const nearestGreen = greenSpaces.reduce((closest, gs) => {
        const dist = calculateDistance(
          startLat + (endLat - startLat) * t,
          startLng + (endLng - startLng) * t,
          gs.lat,
          gs.lng
        );
        return dist < closest.dist ? { gs, dist } : closest;
      }, { gs: greenSpaces[0], dist: Infinity });
      
      // Find nearest crowd hotspot to avoid
      const nearestCrowd = crowdHotspots.reduce((closest, ch) => {
        const dist = calculateDistance(
          startLat + (endLat - startLat) * t,
          startLng + (endLng - startLng) * t,
          ch.lat,
          ch.lng
        );
        return dist < closest.dist ? { ch, dist } : closest;
      }, { ch: crowdHotspots[0], dist: Infinity });
      
      // Bias towards green spaces and away from crowds
      const greenBias = nearestGreen.dist < 2 ? 0.4 : 0;
      const crowdAvoid = nearestCrowd.dist < 1.5 ? -0.3 : 0;
      
      waypoints.push({
        lat:
          startLat +
          (endLat - startLat) * t +
          (nearestGreen.gs.lat - (startLat + (endLat - startLat) * t)) * greenBias +
          ((startLat + (endLat - startLat) * t) - nearestCrowd.ch.lat) * crowdAvoid +
          (Math.random() - 0.5) * 0.005,
        lng:
          startLng +
          (endLng - startLng) * t +
          (nearestGreen.gs.lng - (startLng + (endLng - startLng) * t)) * greenBias +
          ((startLng + (endLng - startLng) * t) - nearestCrowd.ch.lng) * crowdAvoid +
          (Math.random() - 0.5) * 0.005,
      });
    }
  } else {
    // Balanced route - moderate avoidance
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      const nearestGreen = greenSpaces.reduce((closest, gs) => {
        const dist = calculateDistance(
          startLat + (endLat - startLat) * t,
          startLng + (endLng - startLng) * t,
          gs.lat,
          gs.lng
        );
        return dist < closest.dist ? { gs, dist } : closest;
      }, { gs: greenSpaces[0], dist: Infinity });
      
      const bias = nearestGreen.dist < 1.5 ? 0.15 : 0;
      waypoints.push({
        lat: startLat + (endLat - startLat) * t + (nearestGreen.gs.lat - (startLat + (endLat - startLat) * t)) * bias + (Math.random() - 0.5) * 0.008,
        lng: startLng + (endLng - startLng) * t + (nearestGreen.gs.lng - (startLng + (endLng - startLng) * t)) * bias + (Math.random() - 0.5) * 0.008,
      });
    }
  }
  
  // Create segments with environment data
  let totalBurden = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const midLat = (waypoints[i].lat + waypoints[i + 1].lat) / 2;
    const midLng = (waypoints[i].lng + waypoints[i + 1].lng) / 2;
    
    const env = getEnvironmentAtPoint(
      midLat,
      midLng,
      environmentGrid,
      greenSpaces,
      crowdHotspots
    );
    
    const segment: RouteSegment = {
      lat: midLat,
      lng: midLng,
      burden: 0,
      crowd: env.crowd,
      noise: env.noise / 100,
      aqi: env.aqi,
      green: env.green,
      traffic: env.traffic,
    };
    
    segment.burden = calculateBurdenScore(segment, weights);
    totalBurden += segment.burden;
    
    segments.push(segment);
  }
  
  // Calculate duration based on mode and distance
  const totalDistance = segments.reduce((sum, seg, idx) => {
    if (idx === 0) return 0;
    return sum + calculateDistance(segments[idx - 1].lat, segments[idx - 1].lng, seg.lat, seg.lng);
  }, 0);
  
  let speedMph = 3; // walking default
  if (mode === 'driving') speedMph = 25; // average city speed
  else if (mode === 'transit') speedMph = 15;
  else if (mode === 'rideshare') speedMph = 20;
  
  const duration = (totalDistance / speedMph) * 60; // minutes
  
  const avgBurden = totalBurden / segments.length;
  
  // Adjust burden based on route type to ensure differentiation
  let adjustedBurden = avgBurden;
  if (routeType === 'fastest') {
    // Fastest route typically has higher burden (may go through busy areas)
    adjustedBurden = Math.min(1.0, avgBurden * 1.3 + 0.15);
  } else if (routeType === 'low-stress') {
    // Low-stress route has lower burden (avoids stressors)
    adjustedBurden = Math.max(0.1, avgBurden * 0.6 - 0.1);
  } else {
    // Balanced route has medium burden
    adjustedBurden = Math.max(0.2, Math.min(0.8, avgBurden * 0.9 + 0.1));
  }
  
  // Generate customized explanations based on route characteristics
  const getExplanation = (type: string, burden: number, duration: number): string => {
    if (type === 'fastest') {
      if (burden < 0.4) {
        return `Quick route with minimal stress. Takes you directly to your destination in ${duration} minutes with low environmental burden.`;
      } else if (burden < 0.6) {
        return `Fastest path available. May pass through some busy areas but saves ${duration} minutes of travel time. Best for time-sensitive visits.`;
      } else {
        return `Shortest route (${duration} min) but passes through high-traffic zones. Recommended if speed is your priority over comfort.`;
      }
    } else if (type === 'low-stress') {
      if (burden < 0.3) {
        return `Most peaceful route with ${Math.round(burden * 100)}% burden. Passes through parks and quiet streets. Ideal for reducing anxiety before your appointment.`;
      } else if (burden < 0.5) {
        return `Calming route that prioritizes green spaces and avoids crowds. Takes ${duration} minutes with moderate comfort. Good for mental preparation.`;
      } else {
        return `Low-stress path that seeks quieter areas. Slightly longer at ${duration} minutes but provides a more relaxed journey.`;
      }
    } else {
      if (burden < 0.4) {
        return `Well-balanced option: ${duration} minutes with low burden. Offers a good compromise between speed and comfort.`;
      } else if (burden < 0.6) {
        return `Balanced route taking ${duration} minutes. Moderately comfortable while still being reasonably fast. Good default choice.`;
      } else {
        return `Compromise route: ${duration} minutes with moderate burden. Faster than low-stress but more comfortable than fastest.`;
      }
    }
  };
  
  const explanations = {
    fastest: getExplanation('fastest', adjustedBurden, Math.round(duration)),
    'low-stress': getExplanation('low-stress', adjustedBurden, Math.round(duration)),
    balanced: getExplanation('balanced', adjustedBurden, Math.round(duration)),
  };
  
  return {
    id: `${routeType}-${Date.now()}`,
    type: routeType,
    segments,
    duration: Math.round(duration),
    burdenScore: adjustedBurden,
    explanation: explanations[routeType],
  };
}

