// src/App.tsx

import { useMemo, useState } from "react";
import { MapView } from "./components/MapView";
import { FilterPanel } from "./components/FilterPanel";
import { ClinicDetails } from "./components/ClinicDetails";

import { useUserLocation } from "./hooks/useUserLocation";
import { useClinicFilters } from "./hooks/useClinicFilters";

import type { Clinic } from "./types/Clinic";

import rawData from "./data/clinics_raw.json";
import "./App.css";

function normalizeClinics(data: any): Clinic[] {
  return data.features
    .map((f: any) => {
      const a = f.attributes;

      const lat =
        a.latitude ??
        a.POINT_Y ??
        f.geometry?.y ??
        null;

      const lon =
        a.longitude ??
        a.POINT_X ??
        f.geometry?.x ??
        null;

      if (lat == null || lon == null) return null;

      return {
        id: a.OBJECTID,
        name: a.Name || a.org_name || "Unknown Program",

        orgName: a.org_name ?? null,
        address1: a.addrln1 ?? "",
        address2: a.addrln2 ?? null,
        city: a.city ?? "",
        state: a.state ?? "CA",
        zip: a.zip ?? null,

        latitude: lat,
        longitude: lon,

        phones: a.phones ?? null,
        hours: a.hours ?? null,
        url: a.url ?? a.link ?? null,
        email: a.email ?? null,

        description: a.description ?? null,
        info1: a.info1 ?? null,
        info2: a.info2 ?? null,

        category1: a.cat1 ?? null,
        category2: a.cat2 ?? null,
        category3: a.cat3 ?? null,
      };
    })
    .filter(Boolean) as Clinic[];
}

function App() {
  // Normalize the dataset
  const clinics = useMemo(() => normalizeClinics(rawData), []);

  // User location hook (with justLocated flag)
  const {
    location,
    isLoading,
    requestLocation,
    justLocated,
    setJustLocated,
  } = useUserLocation();

  const userLocation = location.error
    ? null
    : { lat: location.lat, lon: location.lon };

  // Filters hook (now includes categories)
  const {
    filters,
    filteredClinics,
    updateFilter,
    cities,
    categories,
  } = useClinicFilters(clinics, userLocation);

  const [selectedClinic, setSelectedClinic] =
    useState<Clinic | null>(null);

  return (
    <div className="app-container d-flex flex-column vh-100">
      {/* HEADER */}
      <header className="bg-primary text-white p-3 shadow-sm">
        <div className="container-fluid d-flex justify-content-between">
          <h1 className="h4 mb-0">LA County Mental Health Programs Map</h1>

          <button
            className="btn btn-light btn-sm"
            onClick={requestLocation}
            disabled={isLoading}
          >
            {isLoading ? "Locating..." : "📍 Locate Me"}
          </button>
        </div>

        {location.error && (
          <div className="alert alert-warning mt-2 py-1">
            <small>{location.error}</small>
          </div>
        )}
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-grow-1 d-flex" style={{ overflow: "hidden" }}>
        {/* LEFT – FILTER PANEL */}
        <aside className="bg-light border-end" style={{ width: 300 }}>
          <FilterPanel
            filters={filters}
            onUpdateFilter={updateFilter}
            cities={cities}
            categories={categories}   // NEW
          />
        </aside>

        {/* MAP */}
        <main className="flex-grow-1 position-relative">
          <MapView
            clinics={filteredClinics}
            selectedClinic={selectedClinic}
            userLocation={userLocation}
            maxDistance={filters.maxDistance}
            onClinicSelect={setSelectedClinic}
            justLocated={justLocated}
            setJustLocated={setJustLocated}
          />
        </main>

        {/* RIGHT – DETAILS PANEL */}
        <aside className="bg-white border-start" style={{ width: 350 }}>
          <ClinicDetails
            clinic={selectedClinic}
            userLocation={userLocation}
          />
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="bg-light border-top p-2">
        <div className="container-fluid">
          <small className="text-muted">
            Showing {filteredClinics.length} of {clinics.length} programs
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;
