
// src/App.tsx

import { useMemo, useState } from "react";
import { MapView } from "./components/MapView";
import { FilterPanel } from "./components/FilterPanel";
import { ClinicDetails } from "./components/ClinicDetails";

import { useUserLocation } from "./hooks/useUserLocation";
import { useClinicFilters } from "./hooks/useClinicFilters";

import type { Clinic } from "./types/Clinic";
import { clinics as clinicsFromData } from "./data/clinics";
import {
  createDefaultExposomeSettings,
  type ExposomeSettings,
  type RouteBurdenResult,
} from "./types/Exposome";

import "./App.css";

function App() {
  // Normalised clinics
  const clinics: Clinic[] = useMemo(() => clinicsFromData, []);

  // User location
  const {
    location,
    isLoading: isLocating,
    requestLocation,
  } = useUserLocation();

  const userLocation =
    location.error || (location.lat === 0 && location.lon === 0)
      ? null
      : { lat: location.lat, lon: location.lon };

  // Filtered clinic list
  const {
    filters,
    updateFilter,
    filteredClinics,
    categories,
    cities,
  } = useClinicFilters(clinics, userLocation);

  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [routeDistanceMiles, setRouteDistanceMiles] = useState<number | null>(
    null
  );

  // Exposome settings + route burden
  const [exposomeSettings, setExposomeSettings] = useState<ExposomeSettings>(
    createDefaultExposomeSettings()
  );
  const [routeBurden, setRouteBurden] = useState<RouteBurdenResult | null>(
    null
  );

  const handleSelectClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  return (
    <div className="app-root d-flex flex-column" style={{ height: "100vh" }}>
      {/* HEADER */}
      <header className="bg-white border-bottom py-2">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">PATH: Mental‑Health Accessibility Map</h4>
            <small className="text-muted">
              Explore mental‑health programs in LA and the environmental burden
              of getting there.
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            {userLocation && !location.error && (
              <span className="badge bg-success-subtle text-success-emphasis">
                Location on
              </span>
            )}
            {location.error && (
              <span className="badge bg-danger-subtle text-danger-emphasis">
                {location.error}
              </span>
            )}
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={requestLocation}
              disabled={isLocating}
            >
              {isLocating ? "Locating…" : "Use my location"}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-grow-1 d-flex">
        {/* LEFT PANEL: filters + environment settings */}
        <div style={{ width: 340, minWidth: 320 }}>
          <FilterPanel
            filters={filters}
            onUpdateFilter={updateFilter}
            cities={cities}
            categories={categories}
            exposomeSettings={exposomeSettings}
            onChangeExposome={setExposomeSettings}
          />
        </div>

        {/* CENTER: map */}
        <div className="flex-grow-1">
          <MapView
            clinics={clinics}
            filteredClinics={filteredClinics}
            selectedClinic={selectedClinic}
            onSelectClinic={handleSelectClinic}
            userLocation={userLocation}
            onRouteDistanceChange={setRouteDistanceMiles}
            exposomeSettings={exposomeSettings}
            onRouteBurdenChange={setRouteBurden}
          />
        </div>

        {/* RIGHT PANEL: details */}
        <div style={{ width: 360, minWidth: 320 }} className="border-start">
          <ClinicDetails
            clinic={selectedClinic}
            userLocation={userLocation}
            routeDistance={routeDistanceMiles}
            routeBurden={routeBurden}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-light border-top p-2">
        <div className="container-fluid d-flex justify-content-between small">
          <span>
            Showing {filteredClinics.length} of {clinics.length} programs
          </span>
          <span className="text-muted">
            Environment layers and burden score are mocked for demonstration
            purposes only.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
