
// src/components/FilterPanel.tsx

import type { ClinicFilters } from "../hooks/useClinicFilters";
import type { ExposomeSettings, EnvLayer } from "../types/Exposome";
import { ALL_LAYERS } from "../types/Exposome";

interface Props {
  filters: ClinicFilters;
  onUpdateFilter: <K extends keyof ClinicFilters>(
    key: K,
    value: ClinicFilters[K]
  ) => void;
  cities: string[];
  categories: string[];

  exposomeSettings: ExposomeSettings;
  onChangeExposome: (settings: ExposomeSettings) => void;
}

export function FilterPanel({
  filters,
  onUpdateFilter,
  cities,
  categories,
  exposomeSettings,
  onChangeExposome,
}: Props) {
  const toggleCategory = (cat: string) => {
    const exists = filters.selectedCategories.includes(cat);
    const next = exists
      ? filters.selectedCategories.filter((c) => c !== cat)
      : [...filters.selectedCategories, cat];
    onUpdateFilter("selectedCategories", next);
  };

  const toggleLayer = (layer: EnvLayer) => {
    const next: ExposomeSettings = {
      ...exposomeSettings,
      activeLayers: {
        ...exposomeSettings.activeLayers,
        [layer]: !exposomeSettings.activeLayers[layer],
      },
    };
    onChangeExposome(next);
  };

  const updateWeight = (layer: EnvLayer, value: number) => {
    const next: ExposomeSettings = {
      ...exposomeSettings,
      weights: {
        ...exposomeSettings.weights,
        [layer]: value,
      },
    };
    onChangeExposome(next);
  };

  const setVisibleLayer = (layer: EnvLayer) => {
    const next: ExposomeSettings = {
      ...exposomeSettings,
      visibleLayer: layer,
    };
    onChangeExposome(next);
  };

  return (
    <div className="p-3 border-end h-100 overflow-auto bg-light">
      <h5 className="mb-3">Find a clinic</h5>

      {/* Search */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Search</label>
        <input
          type="text"
          className="form-control"
          placeholder="Name, city, keywords…"
          value={filters.search}
          onChange={(e) => onUpdateFilter("search", e.target.value)}
        />
      </div>

      {/* City */}
      <div className="mb-3">
        <label className="form-label fw-semibold">City</label>
        <select
          className="form-select"
          value={filters.city}
          onChange={(e) => onUpdateFilter("city", e.target.value)}
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Program type</label>
        <div
          style={{
            maxHeight: "180px",
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "0.5rem 0.75rem",
            background: "#fff",
          }}
        >
          {categories.map((cat) => (
            <div className="form-check" key={cat}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`cat-${cat}`}
                checked={filters.selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <label className="form-check-label" htmlFor={`cat-${cat}`}>
                {cat}
              </label>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-muted small">No categories in data.</div>
          )}
        </div>
      </div>

      {/* Distance */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          Max commute distance ({filters.maxDistanceMiles.toFixed(0)} miles)
        </label>
        <input
          type="range"
          min={1}
          max={30}
          value={filters.maxDistanceMiles}
          onChange={(e) =>
            onUpdateFilter("maxDistanceMiles", Number(e.target.value))
          }
          className="form-range"
        />
        <div className="text-muted small">
          Applied when your location is known.
        </div>
      </div>

      {/* Environment layers */}
      <div className="mb-2">
        <h6 className="fw-semibold">Environment layers</h6>
        <p className="small text-muted mb-2">
          These mock layers approximate factors that can influence mental
          health during your commute. Toggle which ones matter to you and
          adjust their importance.
        </p>

        {ALL_LAYERS.map((layer) => (
          <div
            key={layer}
            className="d-flex align-items-center justify-content-between mb-2"
          >
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`layer-${layer}`}
                checked={exposomeSettings.activeLayers[layer]}
                onChange={() => toggleLayer(layer)}
              />
              <label
                className="form-check-label text-capitalize"
                htmlFor={`layer-${layer}`}
              >
                {layer === "green" ? "Green space (protective)" : layer}
              </label>
            </div>
            <div className="d-flex align-items-center ms-2">
              <span className="small text-muted me-1">Weight</span>
              <input
                type="number"
                className="form-control form-control-sm"
                style={{ width: 64 }}
                min={0}
                max={2}
                step={0.5}
                value={exposomeSettings.weights[layer].toString()}
                onChange={(e) =>
                  updateWeight(layer, Number(e.target.value) || 0)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Visible layer selector */}
      <div className="mt-2">
        <label className="form-label fw-semibold">Layer shown on the map</label>
        <select
          className="form-select form-select-sm"
          value={exposomeSettings.visibleLayer}
          onChange={(e) => setVisibleLayer(e.target.value as EnvLayer)}
        >
          {ALL_LAYERS.map((layer) => (
            <option key={layer} value={layer}>
              {layer === "air"
                ? "Air quality (exposure)"
                : layer === "noise"
                ? "Traffic & noise"
                : layer === "heat"
                ? "Heat / heat island"
                : layer === "green"
                ? "Green space (protective)"
                : "Safety stressors"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
