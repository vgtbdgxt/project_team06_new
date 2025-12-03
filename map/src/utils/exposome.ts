
// src/utils/exposome.ts
//
// Mocked environment / exposome layer generator and simple
// mental‑health burden scoring for a commute route.
//
// This file intentionally does **not** use any external data source.
// Instead, it synthesises plausible‑looking spatial patterns for LA
// so that the UI and interaction design can be demonstrated.

import type { EnvLayer, ExposomeSettings, RouteBurdenResult } from "../types/Exposome";

// Rough LA bounding box used to scatter mock sampling points
// (Downtown roughly at 34.05, −118.25)
const LA_BOUNDS = {
  latMin: 33.7,
  latMax: 34.35,
  lonMin: -118.7,
  lonMax: -118.0,
};

export interface GridPoint {
  id: string;
  lat: number;
  lon: number;
}

/**
 * Deterministic pseudo‑random number based on coordinates.
 * This makes the mock layers stable between renders while
 * still looking spatially heterogeneous.
 */
function coordNoise(lat: number, lon: number): number {
  const x = Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Mock exposome value for a given layer at a location.
 * Returns a value in [0, 1], where higher = worse for
 * mental health **except** the `green` layer which is
 * interpreted as protective.
 */
export function mockLayerValue(layer: EnvLayer, lat: number, lon: number): number {
  const n = coordNoise(lat, lon);

  // Simple gradients to make patterns easy to see:
  // - closer to downtown (34.05, -118.25) = more traffic/noise
  // - inland tends to be hotter
  const dLat = lat - 34.05;
  const dLon = lon + 118.25;
  const distFromDowntown = Math.sqrt(dLat * dLat + dLon * dLon); // degrees, not km – just for pattern

  // Base value shaped by noise
  let base = 0.4 + 0.6 * n;

  switch (layer) {
    case "air":
      base += 0.5 * Math.exp(-distFromDowntown); // worse near downtown/freeways
      break;
    case "noise":
      base += 0.6 * Math.exp(-distFromDowntown * 1.5);
      break;
    case "heat":
      base += 0.4 * (lat - LA_BOUNDS.latMin) / (LA_BOUNDS.latMax - LA_BOUNDS.latMin);
      break;
    case "green":
      // More greenery towards the hills / outer areas, less downtown
      base = 1 - (base + 0.5 * Math.exp(-distFromDowntown));
      break;
    case "safety":
      // Slightly more "risk" in a ring away from downtown to create contrast
      base += 0.5 * Math.exp(-Math.pow(distFromDowntown - 0.25, 2) / 0.08);

      break;
  }

  // Clamp to [0, 1]
  return Math.min(1, Math.max(0, base));
}

/**
 * Generate a simple grid of points over LA used for the overlay dots.
 */
export function generateMockGrid(rows = 12, cols = 12): GridPoint[] {
  const points: GridPoint[] = [];
  for (let r = 0; r < rows; r++) {
    const tLat = r / (rows - 1 || 1);
    const lat = LA_BOUNDS.latMin + tLat * (LA_BOUNDS.latMax - LA_BOUNDS.latMin);
    for (let c = 0; c < cols; c++) {
      const tLon = c / (cols - 1 || 1);
      const lon = LA_BOUNDS.lonMin + tLon * (LA_BOUNDS.lonMax - LA_BOUNDS.lonMin);
      points.push({
        id: `${r}-${c}`,
        lat,
        lon,
      });
    }
  }
  return points;
}

/**
 * Map a value in [0, 1] to a perceptual colour for the overlay.
 * 0   -> cool green
 * 0.5 -> yellow
 * 1   -> red
 */
export function valueToColor(v: number): string {
  const clamped = Math.min(1, Math.max(0, v));
  const r =
    clamped < 0.5 ? Math.round(255 * (clamped * 2)) : 255;
  const g =
    clamped < 0.5
      ? 255
      : Math.round(255 * (2 - clamped * 2));
  const b = 80;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Estimate a mental‑health burden score for the route between
 * user and clinic by linearly interpolating between the two
 * locations and sampling each layer along that line.
 *
 * The score is *relative* and meant only for comparison between
 * options, not as a clinical metric.
 */
export function estimateRouteBurden(
  user: { lat: number; lon: number },
  clinic: { latitude: number; longitude: number },
  settings: ExposomeSettings
): RouteBurdenResult {
  const steps = 24;
  const layerSums: Record<EnvLayer, number> = {
    air: 0,
    noise: 0,
    heat: 0,
    green: 0,
    safety: 0,
  };

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = user.lat + (clinic.latitude - user.lat) * t;
    const lon = user.lon + (clinic.longitude - user.lon) * t;

    (Object.keys(layerSums) as EnvLayer[]).forEach((layer) => {
      const v = mockLayerValue(layer, lat, lon);
      layerSums[layer] += v;
    });
  }

  const layerAverages: Record<EnvLayer, number> = {
    air: layerSums.air / (steps + 1),
    noise: layerSums.noise / (steps + 1),
    heat: layerSums.heat / (steps + 1),
    green: layerSums.green / (steps + 1),
    safety: layerSums.safety / (steps + 1),
  };

  // Combine into a single 0–1 score using the chosen weights
  let weightedSum = 0;
  let totalWeight = 0;

  (Object.keys(layerAverages) as EnvLayer[]).forEach((layer) => {
    if (!settings.activeLayers[layer]) {
      return;
    }
    const w = settings.weights[layer] ?? 0;
    totalWeight += w;
    // For the protective green layer we invert the effect
    const v =
      layer === "green" ? 1 - layerAverages[layer] : layerAverages[layer];
    weightedSum += v * w;
  });

  if (totalWeight === 0) {
    return {
      score: 0,
      layerAverages,
    };
  }

  const normalised = weightedSum / totalWeight;
  return {
    score: Math.round(normalised * 100),
    layerAverages,
  };
}
