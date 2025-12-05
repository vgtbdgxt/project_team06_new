import { Clinic, Route } from '../data/types';
import { calculateDistance } from '../utils/distance';
import { ProgressBar } from 'react-bootstrap';

interface ClinicComparisonProps {
  clinics: Clinic[];
  userLat: number;
  userLng: number;
  routes: Record<string, Route>;
  travelMode: string;
}

export default function ClinicComparison({
  clinics,
  userLat,
  userLng,
  routes,
  travelMode,
}: ClinicComparisonProps) {
  if (clinics.length === 0) return null;

  const comparisonData = clinics.map(clinic => {
    const distance = calculateDistance(
      userLat,
      userLng,
      clinic.lat,
      clinic.lng
    );
    const route = routes[clinic.id];
    return {
      clinic,
      distance,
      route,
      travelTime: route?.duration ?? null,
      burdenScore: route?.burdenScore ?? null,
    };
  });

  // Calculate max values for normalization
  const maxDistance = Math.max(...comparisonData.map(d => d.distance));
  const maxTravelTime = Math.max(
    ...comparisonData.map(d => d.travelTime ?? 0).filter(t => t > 0)
  ) || 1;
  const maxBurden = Math.max(
    ...comparisonData.map(d => d.burdenScore ?? 0).filter(b => b > 0)
  ) || 1;

  const getDistanceColor = (distance: number, max: number): string => {
    const ratio = distance / max;
    if (ratio < 0.33) return 'success'; // Green for close
    if (ratio < 0.66) return 'warning'; // Yellow for medium
    return 'danger'; // Red for far
  };

  const getTimeColor = (time: number | null, max: number): string => {
    if (time === null) return 'secondary';
    const ratio = time / max;
    if (ratio < 0.33) return 'success'; // Green for fast
    if (ratio < 0.66) return 'warning'; // Yellow for medium
    return 'danger'; // Red for slow
  };

  const getBurdenColor = (burden: number | null): string => {
    if (burden === null) return 'secondary';
    if (burden < 0.33) return 'success'; // Green for low burden
    if (burden < 0.66) return 'warning'; // Yellow for medium
    return 'danger'; // Red for high burden
  };

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h6 className="mb-0">Clinic Comparison</h6>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Clinic</th>
                <th>Distance</th>
                <th>Travel Time</th>
                <th>Burden</th>
                <th>Cost</th>
                <th>Languages</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map(({ clinic, distance, travelTime, burdenScore }) => (
                <tr key={clinic.id}>
                  <td style={{ minWidth: '150px' }}>
                    <small>
                      <strong>{clinic.name}</strong>
                      <br />
                      <span className="text-muted">{clinic.type}</span>
                    </small>
                  </td>
                  <td style={{ minWidth: '120px' }}>
                    <div className="d-flex align-items-center">
                      <small className="me-2" style={{ minWidth: '45px' }}>
                        {distance.toFixed(1)} mi
                      </small>
                      <div className="flex-grow-1">
                        <ProgressBar
                          now={(distance / maxDistance) * 100}
                          variant={getDistanceColor(distance, maxDistance)}
                          style={{ height: '8px' }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ minWidth: '120px' }}>
                    {travelTime !== null ? (
                      <div className="d-flex align-items-center">
                        <small className="me-2" style={{ minWidth: '45px' }}>
                          {travelTime} min
                        </small>
                        <div className="flex-grow-1">
                          <ProgressBar
                            now={(travelTime / maxTravelTime) * 100}
                            variant={getTimeColor(travelTime, maxTravelTime)}
                            style={{ height: '8px' }}
                          />
                        </div>
                      </div>
                    ) : (
                      <small className="text-muted">N/A</small>
                    )}
                  </td>
                  <td style={{ minWidth: '120px' }}>
                    {burdenScore !== null ? (
                      <div className="d-flex align-items-center">
                        <small className="me-2" style={{ minWidth: '45px' }}>
                          {(burdenScore * 100).toFixed(0)}%
                        </small>
                        <div className="flex-grow-1">
                          <ProgressBar
                            now={burdenScore * 100}
                            variant={getBurdenColor(burdenScore)}
                            style={{ height: '8px' }}
                          />
                        </div>
                      </div>
                    ) : (
                      <small className="text-muted">N/A</small>
                    )}
                  </td>
                  <td>
                    <small>{clinic.costModel}</small>
                  </td>
                  <td>
                    <small>{clinic.languages.join(', ')}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

