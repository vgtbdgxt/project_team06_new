import { Route, TravelMode, BurdenWeights, Clinic } from '../data/types';
import { Form, Button, Badge } from 'react-bootstrap';

interface RouteOptionsPanelProps {
  clinic: Clinic;
  routes: Route[];
  travelMode: TravelMode;
  onTravelModeChange: (mode: TravelMode) => void;
  weights: BurdenWeights;
  onWeightsChange: (weights: BurdenWeights) => void;
  selectedRoute: Route | null;
  onRouteSelect: (route: Route) => void;
  clinicLoad: number;
  nextLowLoadTime: { hours: number; minutes: number } | null;
  onBack: () => void;
}

export default function RouteOptionsPanel({
  clinic,
  routes,
  travelMode,
  onTravelModeChange,
  weights,
  onWeightsChange,
  selectedRoute,
  onRouteSelect,
  clinicLoad,
  nextLowLoadTime,
  onBack,
}: RouteOptionsPanelProps) {
  const routeColors: Record<string, string> = {
    fastest: '#0066ff',
    'low-stress': '#00cc00',
    balanced: '#9933ff',
  };

  const getBurdenColor = (burden: number): string => {
    if (burden < 0.33) return 'success'; // Green for low burden
    if (burden < 0.66) return 'warning'; // Yellow for medium burden
    return 'danger'; // Red for high burden
  };

  const getBurdenVariant = (burden: number): string => {
    if (burden < 0.33) return 'success';
    if (burden < 0.66) return 'warning';
    return 'danger';
  };

  const updateWeight = (key: keyof BurdenWeights, value: number) => {
    onWeightsChange({ ...weights, [key]: value });
  };

  return (
    <div className="p-3 bg-white" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold">Route Options</h5>
        <Button variant="outline-secondary" size="sm" onClick={onBack}>
          ← Back
        </Button>
      </div>

      {/* Clinic Info */}
      <div className="card mb-4" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="card-body p-3">
          <h6 className="card-title mb-2">{clinic.name}</h6>
          <p className="card-text mb-0 small text-muted">{clinic.address}</p>
          {clinicLoad > 0.7 && (
            <div className="alert alert-warning mt-2 mb-2 py-2">
              <small>
                <strong>⚠️ Busy:</strong> {Math.round(clinicLoad * 100)}% load predicted
              </small>
            </div>
          )}
          {clinicLoad > 0.7 && nextLowLoadTime && (
            <div
              className="card mt-2"
              style={{
                backgroundColor: '#e8f5e9',
                border: '1px solid #4caf50',
                borderRadius: '8px',
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center mb-2">
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>⏰</span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="small text-muted mb-1">Expected to be less busy in</div>
                    <div className="d-flex align-items-baseline">
                      {nextLowLoadTime.hours > 0 && (
                        <div className="me-2">
                          <span
                            style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              color: '#2e7d32',
                            }}
                          >
                            {nextLowLoadTime.hours}
                          </span>
                          <span className="small text-muted ms-1">hr</span>
                        </div>
                      )}
                      {nextLowLoadTime.minutes > 0 && (
                        <div>
                          <span
                            style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              color: '#2e7d32',
                            }}
                          >
                            {nextLowLoadTime.minutes}
                          </span>
                          <span className="small text-muted ms-1">min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="progress" style={{ height: '6px', backgroundColor: '#c8e6c9' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width: `${Math.min(100, ((nextLowLoadTime.hours * 60 + nextLowLoadTime.minutes) / 480) * 100)}%`,
                    }}
                  />
                </div>
                <div className="small text-muted mt-1" style={{ fontSize: '11px' }}>
                  Wait time indicator (max 8 hours)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Travel Mode */}
      <div className="mb-4">
        <Form.Label className="fw-semibold mb-2">Travel Mode</Form.Label>
        <div className="row g-2">
          <div className="col-6">
            <Button
              variant={travelMode === 'walking' ? 'primary' : 'outline-primary'}
              className="w-100"
              onClick={() => onTravelModeChange('walking')}
            >
              🚶 Walking
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant={travelMode === 'driving' ? 'primary' : 'outline-primary'}
              className="w-100"
              onClick={() => onTravelModeChange('driving')}
            >
              🚗 Driving
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant={travelMode === 'transit' ? 'primary' : 'outline-primary'}
              className="w-100"
              onClick={() => onTravelModeChange('transit')}
            >
              🚌 Transit
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant={travelMode === 'rideshare' ? 'primary' : 'outline-primary'}
              className="w-100"
              onClick={() => onTravelModeChange('rideshare')}
            >
              🚕 Rideshare
            </Button>
          </div>
        </div>
      </div>

      {/* Psychological Preferences */}
      <div className="mb-4">
        <Form.Label className="fw-semibold mb-3">Psychological Sensitivities</Form.Label>
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <Form.Label className="small mb-0">👥 Avoid Crowds</Form.Label>
            <Badge bg="secondary">{weights.crowd.toFixed(1)}</Badge>
          </div>
          <Form.Range
            min={0}
            max={1}
            step={0.1}
            value={weights.crowd}
            onChange={e => updateWeight('crowd', parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <Form.Label className="small mb-0">🔊 Avoid Noise</Form.Label>
            <Badge bg="secondary">{weights.noise.toFixed(1)}</Badge>
          </div>
          <Form.Range
            min={0}
            max={1}
            step={0.1}
            value={weights.noise}
            onChange={e => updateWeight('noise', parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <Form.Label className="small mb-0">🌳 Prefer Green Spaces</Form.Label>
            <Badge bg="secondary">{weights.green.toFixed(1)}</Badge>
          </div>
          <Form.Range
            min={0}
            max={1}
            step={0.1}
            value={weights.green}
            onChange={e => updateWeight('green', parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <Form.Label className="small mb-0">🌬️ Avoid Pollution</Form.Label>
            <Badge bg="secondary">{weights.aqi.toFixed(1)}</Badge>
          </div>
          <Form.Range
            min={0}
            max={1}
            step={0.1}
            value={weights.aqi}
            onChange={e => updateWeight('aqi', parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <Form.Label className="small mb-0">🚦 Avoid Traffic</Form.Label>
            <Badge bg="secondary">{weights.traffic.toFixed(1)}</Badge>
          </div>
          <Form.Range
            min={0}
            max={1}
            step={0.1}
            value={weights.traffic}
            onChange={e => updateWeight('traffic', parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* Route Options */}
      <div>
        <Form.Label className="fw-semibold mb-3">Available Routes</Form.Label>
        {routes.map(route => (
          <div
            key={route.id}
            className={`card mb-3 ${
              selectedRoute?.id === route.id ? 'border-primary shadow-sm' : ''
            }`}
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => onRouteSelect(route)}
            onMouseEnter={(e) => {
              if (selectedRoute?.id !== route.id) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedRoute?.id !== route.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-start">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: routeColors[route.type],
                    borderRadius: '50%',
                    marginRight: '12px',
                    flexShrink: 0,
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0" style={{ fontSize: '15px', fontWeight: '600' }}>
                      {route.type === 'fastest'
                        ? '⚡ Fastest Route'
                        : route.type === 'low-stress'
                        ? '🧘 Low-Stress Route'
                        : '⚖️ Balanced Route'}
                    </h6>
                    {selectedRoute?.id === route.id && (
                      <Badge bg="primary">Selected</Badge>
                    )}
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Badge bg="info" className="me-2">
                      ⏱️ {route.duration} min
                    </Badge>
                    <Badge bg={getBurdenVariant(route.burdenScore)}>
                      📊 Burden: {(route.burdenScore * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div
                      className="progress mb-2"
                      style={{ height: '6px' }}
                    >
                      <div
                        className={`progress-bar bg-${getBurdenColor(route.burdenScore)}`}
                        role="progressbar"
                        style={{ width: `${route.burdenScore * 100}%` }}
                      />
                    </div>
                    <p className="card-text mb-0 small" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                      <strong>Why this route:</strong> {route.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

