import { useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MapView from './components/MapView';
import FiltersPanel from './components/FiltersPanel';
import ClinicList from './components/ClinicList';
import ClinicDetails from './components/ClinicDetails';
import RouteOptionsPanel from './components/RouteOptionsPanel';
import RouteBurdenSummary from './components/RouteBurdenSummary';
import ClinicComparison from './components/ClinicComparison';
import Header from './components/Header';
import { useUserLocation } from './hooks/useUserLocation';
import { useFilters } from './hooks/useFilters';
import { useRoutes } from './hooks/useRoutes';
import { clinics } from './data/clinics';
import { greenSpaces } from './data/greenSpaces';
import { crowdHotspots } from './data/crowds';
import { environmentGrid } from './data/environment';
import { Clinic, Route } from './data/types';
import './App.css';

function App() {
  const userLocation = useUserLocation();
  const { 
    filters, 
    updateFilter, 
    filterClinics, 
    resetFilters,
    maxDistanceMax,
    setMaxDistanceMax,
  } = useFilters(
    userLocation.lat,
    userLocation.lng
  );
  const {
    selectedClinic: selectedClinicId,
    setSelectedClinic,
    travelMode,
    setTravelMode,
    weights,
    setWeights,
    startTime,
    generateRoutes,
    getClinicLoadAtArrival,
    getNextLowLoadTime,
  } = useRoutes();

  const [showGreenSpaces, setShowGreenSpaces] = useState(true);
  const [showCrowds, setShowCrowds] = useState(false);
  const [showAQI, setShowAQI] = useState(false);
  const [showNoise, setShowNoise] = useState(false);
  const [selectedClinic, setSelectedClinicState] = useState<Clinic | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showClinicDetails, setShowClinicDetails] = useState(false);

  // Filter clinics
  const filteredClinics = useMemo(
    () => filterClinics(clinics),
    [filters, filterClinics]
  );

  // Generate routes for selected clinic
  const routes = useMemo(() => {
    if (!selectedClinic) return [];
    return generateRoutes(
      userLocation.lat,
      userLocation.lng,
      selectedClinic.lat,
      selectedClinic.lng
    );
  }, [selectedClinic, userLocation, travelMode, weights, generateRoutes]);

  // Store routes by clinic ID for comparison
  const routesByClinic = useMemo(() => {
    const routesMap: Record<string, Route> = {};
    if (selectedClinic && routes.length > 0) {
      // Use the balanced route for comparison
      const balancedRoute = routes.find(r => r.type === 'balanced');
      if (balancedRoute) {
        routesMap[selectedClinic.id] = balancedRoute;
      }
    }
    return routesMap;
  }, [selectedClinic, routes]);

  const [showRouteOptions, setShowRouteOptions] = useState(false);

  const handleClinicClick = (clinic: Clinic) => {
    setSelectedClinicState(clinic);
    setSelectedClinic(clinic.id);
    setShowDetails(false);
    setShowClinicDetails(true);
    setSelectedRoute(null);
    setShowRouteOptions(true); // Show route options when clinic is selected
  };

  const handleBackToFilters = () => {
    setShowRouteOptions(false);
    setShowDetails(false);
    setSelectedClinicState(null);
    setSelectedClinic(null);
    setSelectedRoute(null);
  };

  const handleClinicSelect = (clinic: Clinic) => {
    handleClinicClick(clinic);
  };

  const handleLocateMe = () => {
    userLocation.updateLocation();
  };

  const clinicLoad =
    selectedClinic && startTime
      ? getClinicLoadAtArrival(selectedClinic.id, startTime)
      : 0.5;

  const nextLowLoadTime =
    selectedClinic && startTime
      ? getNextLowLoadTime(selectedClinic.id, startTime)
      : null;

  return (
    <div className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onLocateMe={handleLocateMe}
        isLocating={userLocation.loading}
      />
      <Container fluid className="p-0" style={{ flex: 1, overflow: 'hidden' }}>
        <Row className="g-0" style={{ height: '100%' }}>
          {/* Left Sidebar - Filters or Route Options */}
          <Col xs={3} className="border-end" style={{ height: '100%', overflow: 'hidden' }}>
            {showRouteOptions && selectedClinic && routes.length > 0 ? (
              <RouteOptionsPanel
                clinic={selectedClinic}
                routes={routes}
                travelMode={travelMode}
                onTravelModeChange={setTravelMode}
                weights={weights}
                onWeightsChange={setWeights}
                selectedRoute={selectedRoute}
                onRouteSelect={setSelectedRoute}
                clinicLoad={clinicLoad}
                nextLowLoadTime={nextLowLoadTime}
                onBack={handleBackToFilters}
              />
            ) : (
              <FiltersPanel
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                showGreenSpaces={showGreenSpaces}
                showCrowds={showCrowds}
                showAQI={showAQI}
                showNoise={showNoise}
                onToggleGreenSpaces={() => setShowGreenSpaces(!showGreenSpaces)}
                onToggleCrowds={() => setShowCrowds(!showCrowds)}
                onToggleAQI={() => setShowAQI(!showAQI)}
                onToggleNoise={() => setShowNoise(!showNoise)}
                maxDistanceMax={maxDistanceMax}
                onMaxDistanceMaxChange={setMaxDistanceMax}
                onMaxDistanceChange={(value) => updateFilter('maxDistance', value)}
              />
            )}
          </Col>

          {/* Main Map Area */}
          <Col xs={6} style={{ position: 'relative' }}>
            <div style={{ height: '100%', width: '100%' }}>
              <MapView
                key={`${userLocation.lat}-${userLocation.lng}`}
                userLat={userLocation.lat}
                userLng={userLocation.lng}
                clinics={filteredClinics}
                selectedClinic={selectedClinic}
                routes={selectedRoute ? [selectedRoute] : routes}
                showGreenSpaces={showGreenSpaces}
                showCrowds={showCrowds}
                showAQI={showAQI}
                showNoise={showNoise}
                greenSpaces={greenSpaces}
                crowdHotspots={crowdHotspots}
                environmentGrid={environmentGrid}
                maxDistance={filters.maxDistance}
                onClinicClick={handleClinicClick}
              />
            </div>
          </Col>

          {/* Right Sidebar - Clinic List or Details */}
          <Col xs={3} className="border-start" style={{ height: '100%', overflow: 'hidden' }}>
            {showClinicDetails && selectedClinic ? (
              <ClinicDetails
                clinic={selectedClinic}
                userLat={userLocation.lat}
                userLng={userLocation.lng}
                onClose={() => {
                  setShowClinicDetails(false);
                  setSelectedClinicState(null);
                  setSelectedClinic(null);
                  setShowRouteOptions(false);
                }}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="p-2 border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Clinics</h6>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setShowComparison(!showComparison)}
                    >
                      {showComparison ? 'Hide' : 'Compare'}
                    </button>
                  </div>
                </div>
                {showComparison ? (
                  <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
                    <ClinicComparison
                      clinics={filteredClinics.slice(0, 5)}
                      userLat={userLocation.lat}
                      userLng={userLocation.lng}
                      routes={routesByClinic}
                      travelMode={travelMode}
                    />
                  </div>
                ) : (
                  <div style={{ flex: 1, overflow: 'auto' }}>
                    <ClinicList
                      clinics={filteredClinics}
                      userLat={userLocation.lat}
                      userLng={userLocation.lng}
                      selectedClinic={selectedClinic}
                      onClinicSelect={handleClinicSelect}
                      maxDistance={filters.maxDistance}
                      filters={filters}
                    />
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>


        {/* Route Burden Summary - Show in details panel area if route is selected */}
        {selectedRoute && showRouteOptions && (
          <div
            className="position-fixed end-0 top-0 bg-white shadow-lg"
            style={{
              width: '400px',
              height: '100vh',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Route Details</h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedRoute(null)}
              >
                ×
              </button>
            </div>
            <div className="p-3">
              <RouteBurdenSummary route={selectedRoute} />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;

