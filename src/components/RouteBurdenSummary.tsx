import { Route } from '../data/types';
import RadarChart from './RadarChart';

interface RouteBurdenSummaryProps {
  route: Route | null;
}

export default function RouteBurdenSummary({
  route,
}: RouteBurdenSummaryProps) {
  if (!route) return null;

  const avgCrowd =
    route.segments.reduce((sum, s) => sum + s.crowd, 0) /
    route.segments.length;
  const avgNoise =
    route.segments.reduce((sum, s) => sum + s.noise, 0) /
    route.segments.length;
  const avgAQI =
    route.segments.reduce((sum, s) => sum + s.aqi, 0) / route.segments.length;
  const avgGreen =
    route.segments.reduce((sum, s) => sum + s.green, 0) /
    route.segments.length;
  const avgTraffic =
    route.segments.reduce((sum, s) => sum + s.traffic, 0) /
    route.segments.length;

  // const _greenPercentage = (avgGreen * 100).toFixed(0);

  // Color functions for different metrics
  //   // const _getCrowdColor = (crowd: number): string => {
  //   const percent = crowd * 100;
  //   if (percent < 30) return '#28a745'; // Green - low crowd
  //   if (percent < 60) return '#ffc107'; // Yellow - medium crowd
  //   return '#dc3545'; // Red - high crowd
  // };

  //   // const _getNoiseColor = (noise: number): string => {
  //   const percent = noise * 100;
  //   if (percent < 30) return '#28a745'; // Green - low noise
  //   if (percent < 60) return '#ffc107'; // Yellow - medium noise
  //   return '#dc3545'; // Red - high noise
  // };

  //   // const _getAQIColor = (aqi: number): string => {
  //   if (aqi <= 50) return '#28a745'; // Green - Good
  //   if (aqi <= 100) return '#ffc107'; // Yellow - Moderate
  //   if (aqi <= 150) return '#fd7e14'; // Orange - Unhealthy for sensitive groups
  //   if (aqi <= 200) return '#dc3545'; // Red - Unhealthy
  //   return '#6f42c1'; // Purple - Very unhealthy
  // };

  //   // const _getGreenSpaceColor = (green: number): string => {
  //   const percent = green * 100;
  //   if (percent > 50) return '#28a745'; // Green - high green space
  //   if (percent > 20) return '#20c997'; // Teal - moderate green space
  //   return '#6c757d'; // Gray - low green space
  // };

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h6 className="mb-0">Route Burden Summary</h6>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <strong>Overall Burden Score:</strong>
          <div className="progress mt-1" style={{ height: '20px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${route.burdenScore * 100}%`,
                backgroundColor:
                  route.burdenScore > 0.7
                    ? 'red'
                    : route.burdenScore > 0.4
                    ? 'orange'
                    : 'green',
              }}
            >
              {(route.burdenScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mb-4">
          <h6 className="text-center mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>
            Environmental Factors
          </h6>
          <RadarChart
            crowd={avgCrowd}
            noise={avgNoise}
            aqi={avgAQI}
            green={avgGreen}
            traffic={avgTraffic}
            rawAQI={avgAQI}
          />
        </div>

        <div className="mt-3">
          <small className="text-muted">
            <strong>Route Type:</strong> {route.explanation}
          </small>
        </div>
      </div>
    </div>
  );
}

