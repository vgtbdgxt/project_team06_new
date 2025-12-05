import { useState, useMemo } from 'react';
import { Clinic, ClinicType, TreatmentFocus, PrivacyLevel } from '../data/types';
import { calculateDistance } from '../utils/distance';

export interface Filters {
  clinicTypes: ClinicType[];
  treatmentFocus: TreatmentFocus[];
  maxDistance: number | null;
  waitTime: string[];
  privacyLevel: PrivacyLevel[];
  languages: string[];
  insurance: string[];
  allowsAnonymous: boolean | null;
  telehealth: boolean | null;
}

const DEFAULT_FILTERS: Filters = {
  clinicTypes: [],
  treatmentFocus: [],
  maxDistance: 15, // Default preset value: 15 miles
  waitTime: [],
  privacyLevel: [],
  languages: [],
  insurance: [],
  allowsAnonymous: null,
  telehealth: null,
};

export function useFilters(userLat: number, userLng: number) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [maxDistanceMax, setMaxDistanceMax] = useState<number>(50); // Default max limit: 50 miles

  const updateFilter = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filterClinics = (clinics: Clinic[]): Clinic[] => {
    return clinics.filter(clinic => {
      // Clinic type filter
      if (
        filters.clinicTypes.length > 0 &&
        !filters.clinicTypes.includes(clinic.type)
      ) {
        return false;
      }

      // Treatment focus filter
      if (
        filters.treatmentFocus.length > 0 &&
        !filters.treatmentFocus.some(tf => clinic.treatmentFocus.includes(tf))
      ) {
        return false;
      }

      // Distance filter (soft exclusion handled in component)
      if (filters.maxDistance !== null) {
        const distance = calculateDistance(
          userLat,
          userLng,
          clinic.lat,
          clinic.lng
        );
        // Still include, but will be faded
      }

      // Privacy level filter
      if (
        filters.privacyLevel.length > 0 &&
        !filters.privacyLevel.includes(clinic.privacyLevel)
      ) {
        return false;
      }

      // Language filter
      if (
        filters.languages.length > 0 &&
        !filters.languages.some(lang => clinic.languages.includes(lang))
      ) {
        return false;
      }

      // Insurance filter
      if (
        filters.insurance.length > 0 &&
        !filters.insurance.some(ins => clinic.insurance.includes(ins))
      ) {
        return false;
      }

      // Anonymous visits filter
      if (
        filters.allowsAnonymous !== null &&
        clinic.allowsAnonymous !== filters.allowsAnonymous
      ) {
        return false;
      }

      // Telehealth filter
      if (
        filters.telehealth !== null &&
        clinic.telehealth !== filters.telehealth
      ) {
        return false;
      }

      return true;
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    filters,
    updateFilter,
    filterClinics,
    resetFilters,
    maxDistanceMax,
    setMaxDistanceMax,
  };
}

