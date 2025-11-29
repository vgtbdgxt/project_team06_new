import { useState, useMemo } from 'react';
import { Clinic } from '../data/clinics';
import { calculateDistance } from '../utils/distance';

export interface ClinicFilters {
  types: string[];
  specialties: string[];
  maxDistance: number;
  online: boolean | null;
  multilingual: boolean | null;
  acceptsUndiagnosed: boolean | null;
  noGuardianRequired: boolean | null;
}

const DEFAULT_FILTERS: ClinicFilters = {
  types: ['hospital', 'outpatient', 'specialized', 'urgent_care'],
  specialties: [],
  maxDistance: 10,
  online: null,
  multilingual: null,
  acceptsUndiagnosed: null,
  noGuardianRequired: null
};

export function useClinicFilters(
  clinics: Clinic[],
  userLocation: { lat: number; lon: number } | null
) {
  const [filters, setFilters] = useState<ClinicFilters>(DEFAULT_FILTERS);

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      // Filter by type
      if (!filters.types.includes(clinic.type)) {
        return false;
      }

      // Filter by specialties (if any selected)
      if (filters.specialties.length > 0) {
        const hasMatchingSpecialty = filters.specialties.some((spec) =>
          clinic.focus.includes(spec)
        );
        if (!hasMatchingSpecialty) {
          return false;
        }
      }

      // Filter by distance (if user location is available)
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          clinic.lat,
          clinic.lon
        );
        if (distance > filters.maxDistance) {
          return false;
        }
      }

      // Filter by availability options
      if (filters.online !== null && clinic.online !== filters.online) {
        return false;
      }
      if (
        filters.multilingual !== null &&
        clinic.multilingual !== filters.multilingual
      ) {
        return false;
      }
      if (
        filters.acceptsUndiagnosed !== null &&
        clinic.acceptsUndiagnosed !== filters.acceptsUndiagnosed
      ) {
        return false;
      }
      if (
        filters.noGuardianRequired !== null &&
        clinic.noGuardianRequired !== filters.noGuardianRequired
      ) {
        return false;
      }

      return true;
    });
  }, [clinics, filters, userLocation]);

  const updateFilter = <K extends keyof ClinicFilters>(
    key: K,
    value: ClinicFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type]
    }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFilters((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  return {
    filters,
    filteredClinics,
    updateFilter,
    toggleType,
    toggleSpecialty
  };
}

