// src/hooks/useClinicFilters.ts

import { useMemo, useState } from "react";
import type { Clinic } from "../types/Clinic";

export interface ClinicFilters {
  search: string;
  city: string;
  maxDistanceMiles: number;
  selectedCategories: string[];
}

export function useClinicFilters(
  clinics: Clinic[],
  userLocation: { lat: number; lon: number } | null
) {
  const [filters, setFilters] = useState<ClinicFilters>({
    search: "",
    city: "All",
    maxDistanceMiles: 7,
    selectedCategories: [],
  });

  const updateFilter = <K extends keyof ClinicFilters>(
    key: K,
    value: ClinicFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Compute categories from dataset
  const categories = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach((c) => {
      [c.category1, c.category2, c.category3]
        .filter(Boolean)
        .forEach((cat: any) => {
          cat
            .split(",")
            .map((x: string) => x.trim())
            .forEach((x) => set.add(x));
        });
    });
    return Array.from(set).sort();
  }, [clinics]);

  // Compute cities for dropdown
  const cities = useMemo(() => {
    const set = new Set<string>(["All"]);
    clinics.forEach((c) => c.city && set.add(c.city));
    return Array.from(set).sort();
  }, [clinics]);

  // Great-circle distance (miles)
  function distanceMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 3958.8; // Earth radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Filtering logic
  const filteredClinics = useMemo(() => {
    return clinics
      .map((c) => {
        let dist = null;
        if (userLocation) {
          dist = distanceMiles(
            userLocation.lat,
            userLocation.lon,
            c.latitude,
            c.longitude
          );
        }

        return { ...c, distanceMiles: dist };
      })
      .filter((c) => {
        // Search filter
        if (
          filters.search &&
          !(
            c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.city.toLowerCase().includes(filters.search.toLowerCase())
          )
        ) {
          return false;
        }

        // City filter
        if (filters.city !== "All" && c.city !== filters.city) {
          return false;
        }

        // OR category logic
        if (filters.selectedCategories.length > 0) {
          const clinicCats = [
            c.category1,
            c.category2,
            c.category3,
          ]
            .filter(Boolean)
            .flatMap((cc) => cc!.split(",").map((x) => x.trim()));

          const matches = filters.selectedCategories.some((cat) =>
            clinicCats.includes(cat)
          );

          if (!matches) return false;
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
