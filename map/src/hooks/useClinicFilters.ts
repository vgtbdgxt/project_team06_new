// src/hooks/useClinicFilters.ts

import { useMemo, useState } from "react";
import type { Clinic } from "../types/Clinic";
import { calculateDistance } from "../utils/distance";

export interface ClinicFilters {
  search: string;
  city: string;
  selectedCategories: string[];
  maxDistance: number;
}

export function useClinicFilters(
  clinics: Clinic[],
  userLocation: { lat: number; lon: number } | null
) {
  const [filters, setFilters] = useState<ClinicFilters>({
    search: "",
    city: "All",
    selectedCategories: [],
    maxDistance: 10,
  });

  /** STEP 1 — Always apply Search + Distance first */
  const baseFiltered = useMemo(() => {
    let data = clinics.map((c) => ({ ...c }));

    // Distance filter
    if (userLocation) {
      data = data
        .map((c) => ({
          ...c,
          distanceKm: calculateDistance(
            userLocation.lat,
            userLocation.lon,
            c.latitude,
            c.longitude
          ),
        }))
        .filter((c) => c.distanceKm! <= filters.maxDistance);
    }

    // Search filter
    const q = filters.search.toLowerCase().trim();
    if (q !== "") {
      data = data.filter((c) => {
        const fields = [
          c.name,
          c.orgName ?? "",
          c.description ?? "",
          c.city ?? "",
        ].map((s) => s.toLowerCase());

        return fields.some((f) => f.includes(q));
      });
    }

    return data;
  }, [clinics, userLocation, filters.search, filters.maxDistance]);


  /** STEP 2 — Dynamic options: these depend on baseFiltered (NOT final filteredClinics) */

  // Dynamic city list
  const dynamicCities = useMemo(() => {
    const cities = Array.from(
      new Set(baseFiltered.map((c) => c.city).filter(Boolean))
    ).sort();
    return ["All", ...cities];
  }, [baseFiltered]);

  // Dynamic category list
  const dynamicCategories = useMemo(() => {
    const exploded = baseFiltered.flatMap((c) =>
      [c.category1, c.category2, c.category3]
        .filter(Boolean)
        .flatMap((str) =>
          str!
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        )
    );

    const unique = Array.from(new Set(exploded)).sort();
    return unique; // no "All" for checkboxes
  }, [baseFiltered]);


  /** STEP 3 — Apply City + Category filters AFTER dynamic lists are computed */

  const filteredClinics = useMemo(() => {
    let data = baseFiltered;

    // City filter
    if (filters.city !== "All") {
      data = data.filter((c) => c.city === filters.city);
    }

    // Category multiselect
    if (filters.selectedCategories.length > 0) {
      data = data.filter((c) => {
        const catList = [c.category1, c.category2, c.category3]
          .filter(Boolean)
          .flatMap((str) =>
            str!
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          );

        return filters.selectedCategories.every((cat) =>
          catList.includes(cat)
        );
      });
    }

    return data;
  }, [baseFiltered, filters.city, filters.selectedCategories]);


  /** Update function */
  function updateFilter<K extends keyof ClinicFilters>(
    key: K,
    value: ClinicFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return {
    filters,
    updateFilter,
    cities: dynamicCities,
    categories: dynamicCategories,
    filteredClinics,
  };
}
