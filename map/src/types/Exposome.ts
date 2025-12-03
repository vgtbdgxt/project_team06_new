
// src/types/Exposome.ts

export type EnvLayer = "air" | "noise" | "heat" | "green" | "safety";

export interface ExposomeSettings {
  /** Which layers are included in the burden score */
  activeLayers: Record<EnvLayer, boolean>;
  /** Relative importance weights for each layer (0–2 recommended) */
  weights: Record<EnvLayer, number>;
  /** Single layer that is visualised as an overlay on the map */
  visibleLayer: EnvLayer;
}

export interface RouteBurdenResult {
  /** 0–100 mental‑health burden score for the route */
  score: number;
  /** Average normalised value (0–1) for each layer along the route */
  layerAverages: Record<EnvLayer, number>;
}

export const ALL_LAYERS: EnvLayer[] = ["air", "noise", "heat", "green", "safety"];

export function createDefaultExposomeSettings(): ExposomeSettings {
  const baseWeights: Record<EnvLayer, number> = {
    air: 1,
    noise: 1,
    heat: 1,
    green: 1,
    safety: 1,
  };

  const activeLayers: Record<EnvLayer, boolean> = {
    air: true,
    noise: true,
    heat: true,
    green: true,
    safety: true,
  };

  return {
    activeLayers,
    weights: baseWeights,
    visibleLayer: "air",
  };
}
