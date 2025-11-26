import { useState } from 'react';
import { MapView } from './components/MapView';
import { FilterPanel } from './components/FilterPanel';
import { ClinicDetails } from './components/ClinicDetails';
import { useUserLocation } from './hooks/useUserLocation';
import { useClinicFilters } from './hooks/useClinicFilters';
import { CLINICS, Clinic } from './data/clinics';
import './App.css';

function App() {
  const { location, isLoading, requestLocation } = useUserLocation();
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const { filters, filteredClinics, updateFilter, toggleType, toggleSpecialty } =
    useClinicFilters(CLINICS, location);

  const userLocation = location.error ? null : { lat: location.lat, lon: location.lon };

  return (
    <div className="app-container d-flex flex-column vh-100">
      {/* Header */}
      <header className="bg-primary text-white p-3 shadow-sm">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">Mental Health Clinic Accessibility Dashboard</h1>
            <button
              className="btn btn-light btn-sm"
              onClick={requestLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Locating...
                </>
              ) : (
                '📍 Locate Me'
              )}
            </button>
          </div>
          {location.error && (
            <div className="alert alert-warning alert-sm mt-2 mb-0 py-1" role="alert">
              <small>{location.error}</small>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex" style={{ overflow: 'hidden' }}>
        {/* Left Sidebar - Filters */}
        <aside className="bg-light border-end" style={{ width: '300px', minWidth: '250px' }}>
          <FilterPanel
            filters={filters}
            onToggleType={toggleType}
            onToggleSpecialty={toggleSpecialty}
            onUpdateFilter={updateFilter}
          />
        </aside>

        {/* Center - Map */}
        <main className="flex-grow-1 position-relative">
          <MapView
            clinics={filteredClinics}
            selectedClinic={selectedClinic}
            userLocation={userLocation}
            maxDistance={filters.maxDistance}
            onClinicSelect={setSelectedClinic}
          />
        </main>

        {/* Right Sidebar - Clinic Details */}
        <aside className="bg-white border-start" style={{ width: '350px', minWidth: '300px' }}>
          <ClinicDetails clinic={selectedClinic} userLocation={userLocation} />
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-light border-top p-2">
        <div className="container-fluid">
          <small className="text-muted">
            Showing {filteredClinics.length} of {CLINICS.length} clinics
            {userLocation && ` within ${filters.maxDistance} km`}
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;

