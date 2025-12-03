// src/App.tsx

import { useMemo, useState } from "react";
import { MapView } from "./components/MapView";
import { FilterPanel } from "./components/FilterPanel";
import { ClinicDetails } from "./components/ClinicDetails";
import { useUserLocation } from "./hooks/useUserLocation";
import { useClinicFilters } from "./hooks/useClinicFilters";

import rawData from "./data/clinics_raw.json";
import type { Clinic } from "./types/Clinic";

import "./App.css";

// FIXED name extraction
function normalizeClinics(data: any): Clinic[] {
  return data.features
    .map((f: any) => {
      const a = f.attributes ?? {};

      const lat = a.latitude ?? a.POINT_Y ?? f.geometry?.y;
      const lon = a.longitude ?? a.POINT_X ?? f.geometry?.x;
      if (!lat || !lon) return null;

      const rawName =
        (a.name ?? "").trim() ||
        (a.Name ?? "").trim() ||
        (a.org_name ?? "").trim();

      const finalName = rawName || "Unknown Program";

      return {
        id: a.OBJECTID ?? Math.random(),
        name: finalName,
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
        category1: a.cat1 ?? null,
        category2: a.cat2 ?? null,
        category3: a.cat3 ?? null,
      };
    })
    .filter(Boolean) as Clinic[];
}

function App() {
  const clinics = useMemo(() => normalizeClinics(rawData), []);

  const {
    location,
    requestLocation,
    justLocated,
    setJustLocated,
  } = useUserLocation();

  const userLocation = location.error
    ? null
    : { lat: location.lat, lon: location.lon };

  const {
    filters,
    updateFilter,
    filteredClinics,
    categories,
    cities,
  } = useClinicFilters(clinics, userLocation);

  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null); // NEW

  const programsWithin = filteredClinics
    .filter((c) => c.distanceMiles && c.distanceMiles <= filters.maxDistanceMiles)
    .sort((a, b) => Number(a.distanceMiles) - Number(b.distanceMiles));

  return (
    <div className="d-flex flex-column vh-100">
      {/* HEADER */}
      <header className="bg-primary text-white p-3 shadow-sm">
        <div className="container-fluid d-flex justify-content-between">
          <h1 className="h4 mb-0">LA County Mental Health Programs Map</h1>

          <button className="btn btn-light btn-sm" onClick={requestLocation}>
            📍 Locate Me
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex-grow-1 d-flex" style={{ overflow: "hidden" }}>
        {/* LEFT PANEL */}
        <aside className="bg-light border-end" style={{ width: 300 }}>
          <FilterPanel
            filters={filters}
            onUpdateFilter={updateFilter}
            cities={cities}
            categories={categories}
          />

          <div className="mt-3 px-3 pb-4" style={{ maxHeight: "35vh", overflowY: "auto" }}>
            <h6 className="fw-bold">
              Programs Within {filters.maxDistanceMiles} miles ({programsWithin.length})
            </h6>

            <div className="border rounded p-2">
              {programsWithin.map((p) => (
                <div
                  key={p.id}
                  className="small mb-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedClinic(p)}
                >
                  • {p.name}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAP */}
        <main className="flex-grow-1 position-relative">
          <MapView
            clinics={filteredClinics}
            selectedClinic={selectedClinic}
            onClinicSelect={setSelectedClinic}
            userLocation={userLocation}
            justLocated={justLocated}
            setJustLocated={setJustLocated}
            maxDistanceMiles={filters.maxDistanceMiles}
            setRouteDistance={setRouteDistance} // NEW
          />
        </main>

        {/* DETAILS PANEL */}
        <aside className="bg-white border-start" style={{ width: 350 }}>
          <ClinicDetails
            clinic={selectedClinic}
            userLocation={userLocation}
            routeDistance={routeDistance} // NEW
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
