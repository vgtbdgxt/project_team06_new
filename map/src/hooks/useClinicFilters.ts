
// src/hooks/useClinicFilters.ts
//
// Central place for handling search / filter state for clinics
// as well as deriving helper lists such as the available cities
// and categories.

import { useMemo, useState } from "react";
import type { Clinic } from "../types/Clinic";
import { calculateDistance } from "../utils/distance";

export interface ClinicFilters {
  /** Free‑text search across name and city */
  search: string;
  /** Selected city, or "All" when empty */
  city: string;
  /** Maximum commute distance in miles (if user location is known) */
  maxDistanceMiles: number;
  /** One or more selected categories – clinic must match at least one */
  selectedCategories: string[];
}

export function useClinicFilters(
  clinics: Clinic[],
  userLocation: { lat: number; lon: number } | null
) {
  const [filters, setFilters] = useState<ClinicFilters>({
    search: "",
    city: "",
    maxDistanceMiles: 15,
    selectedCategories: [],
  });

  const updateFilter = <K extends keyof ClinicFilters>(
    key: K,
    value: ClinicFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Derive city + category lists from the data
  const { cities, categories } = useMemo(() => {
    const citySet = new Set<string>();
    const categorySet = new Set<string>();

    clinics.forEach((c) => {
      if (c.city) citySet.add(c.city);
      [c.category1, c.category2, c.category3]
        .filter(Boolean)
        .forEach((cat) => categorySet.add(String(cat)));
    });

    return {
      cities: Array.from(citySet).sort(),
      categories: Array.from(categorySet).sort(),
    };
  }, [clinics]);

  // Apply filters and compute distances when user location is known
  const filteredClinics = useMemo(() => {
    return clinics
      .map((c) => {
        if (userLocation) {
          const km = calculateDistance(
            userLocation.lat,
            userLocation.lon,
            c.latitude,
            c.longitude
          );
          c.distanceKm = km;
          c.distanceMiles = km * 0.621371;
        }
        return c;
      })
      .filter((c) => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const haystack =
            (c.name + " " + c.city + " " + (c.description ?? "")).toLowerCase();
          if (!haystack.includes(searchLower)) {
            return false;
          }
        }

        // City filter
        if (filters.city && c.city !== filters.city) {
          return false;
        }

        // Category filter: match any of the selected categories
        if (filters.selectedCategories.length > 0) {
          const clinicCats = [
            c.category1,
            c.category2,
            c.category3,
          ].filter(Boolean) as string[];

          const hasMatch = filters.selectedCategories.some((cat) =>
            clinicCats.includes(cat)
          );
          if (!hasMatch) {
            return false;
          }
        }

        // Distance filter
        if (userLocation && filters.maxDistanceMiles > 0 && c.distanceMiles) {
          if (c.distanceMiles > filters.maxDistanceMiles) {
            return false;
          }
        }

        return true;
      });
  }, [clinics, filters, userLocation]);

  return {
    filters,
    updateFilter,
    filteredClinics,
    categories,
    cities,
  };
}
