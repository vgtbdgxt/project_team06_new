// src/components/FilterPanel.tsx

import type { ClinicFilters } from "../hooks/useClinicFilters";

interface Props {
  filters: ClinicFilters;
  onUpdateFilter: <K extends keyof ClinicFilters>(
    key: K,
    value: ClinicFilters[K]
  ) => void;
  cities: string[];
  categories: string[];
}

export function FilterPanel({ filters, onUpdateFilter, cities, categories }: Props) {
  const toggleCategory = (cat: string) => {
    const current = filters.selectedCategories;

    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];

    onUpdateFilter("selectedCategories", next);
  };

  return (
    <div className="p-3">
      <h5 className="mb-3">Filters</h5>

      {/* Search */}
      <div className="mb-3">
        <label className="form-label">Search</label>
        <input
          className="form-control"
          placeholder="Name, program info, city..."
          value={filters.search}
          onChange={(e) => onUpdateFilter("search", e.target.value)}
        />
      </div>

      {/* City */}
      <div className="mb-3">
        <label className="form-label">City</label>
        <select
          className="form-select"
          value={filters.city}
          onChange={(e) => onUpdateFilter("city", e.target.value)}
        >
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Categories (Dynamic) */}
      <div className="mb-3">
        <label className="form-label">Categories</label>
        <div className="border rounded p-2" style={{ maxHeight: 250, overflowY: "auto" }}>
          {categories.length === 0 && (
            <div className="text-muted small">No matching categories</div>
          )}

          {categories.map((cat) => {
            const id = `cat-${cat}`;
            const checked = filters.selectedCategories.includes(cat);

            return (
              <div className="form-check mb-1" key={cat}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={id}
                  checked={checked}
                  onChange={() => toggleCategory(cat)}
                />
                <label htmlFor={id} className="form-check-label">
                  {cat}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distance */}
      <div className="mb-3">
        <label className="form-label">
          Maximum Distance: {filters.maxDistance} km
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={filters.maxDistance}
          onChange={(e) =>
            onUpdateFilter("maxDistance", Number(e.target.value))
          }
          className="form-range"
        />
      </div>
    </div>
  );
}
