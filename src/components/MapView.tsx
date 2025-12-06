import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Clinic, Route, GreenSpace, CrowdHotspot, RouteSegment } from '../data/types';
import { calculateDistance } from '../utils/distance';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  userLat: number;
  userLng: number;
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  routes: Route[];
  showGreenSpaces: boolean;
  showCrowds: boolean;
  showAQI: boolean;
  showNoise: boolean;
  greenSpaces: GreenSpace[];
  crowdHotspots: CrowdHotspot[];
  environmentGrid: Array<{ lat: number; lng: number; aqi: number; noise: number }>;
  maxDistance: number | null;
  onClinicClick: (clinic: Clinic) => void;
}

function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

// Component to auto-fit map based on max distance
function MapAutoFit({ 
  userLat, 
  userLng, 
  maxDistance 
}: { 
  userLat: number; 
  userLng: number; 
  maxDistance: number | null;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (maxDistance === null) {
      // If no max distance, use default zoom
      map.setView([userLat, userLng], 12);
      return;
    }
    
    // Calculate zoom level based on distance
    // Rough approximation: 1 mile ≈ 0.014 degrees at LA latitude
    // We want the map to show approximately maxDistance * 2 (diameter)
    const degreesPerMile = 0.014;
    const radiusInDegrees = maxDistance * degreesPerMile;
    
    // Calculate bounds
    const bounds = [
      [userLat - radiusInDegrees, userLng - radiusInDegrees],
      [userLat + radiusInDegrees, userLng + radiusInDegrees],
    ] as [[number, number], [number, number]];
    
    // Fit map to bounds with padding
    map.fitBounds(bounds, {
      padding: [50, 50], // Padding in pixels
      maxZoom: 15, // Don't zoom in too much
    });
  }, [userLat, userLng, maxDistance, map]);
  
  return null;
}

function createCustomIcon(emoji: string, size: number = 30) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="font-size: ${size}px; text-align: center;">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createClinicDotIcon(size: number = 12, color: string = '#0066cc') {
  return L.divIcon({
    className: 'clinic-dot-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background-color: ${color};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapView({
  userLat,
  userLng,
  clinics,
  selectedClinic,
  routes,
  showGreenSpaces,
  showCrowds,
  showAQI,
  showNoise,
  greenSpaces,
  crowdHotspots,
  environmentGrid,
  maxDistance,
  onClinicClick,
}: MapViewProps) {
  const routeColors: Record<string, string> = {
    fastest: '#0066ff',
    'low-stress': '#00cc00',
    balanced: '#9933ff',
  };

  // const _getRouteColor = (route: Route, segmentIdx: number): string => {
  //   const baseColor = routeColors[route.type];
  //   const segment = route.segments[segmentIdx];
  //   if (!segment) return baseColor;
  //
  //   // Adjust color based on environment
  //   if (segment.green > 0.3) {
  //     return '#00aa00'; // greener for green spaces
  //   }
  //   if (segment.crowd > 0.5) {
  //     return '#ff6600'; // more orange for crowds
  //   }
  //   if (segment.noise > 0.5) {
  //     return '#ffaa00'; // yellow for noise
  //   }
  //   return baseColor;
  // };

  return (
    <MapContainer
      center={[userLat, userLng]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenter lat={userLat} lng={userLng} />
      <MapAutoFit userLat={userLat} userLng={userLng} maxDistance={maxDistance} />

      {/* User location marker */}
      <Marker
        position={[userLat, userLng]}
        icon={createCustomIcon('📍', 40)}
      >
        <Popup>Your Location</Popup>
      </Marker>

      {/* Green spaces */}
      {showGreenSpaces &&
        greenSpaces.map(gs => (
          <Marker
            key={gs.id}
            position={[gs.lat, gs.lng]}
            icon={createCustomIcon('🌳', 25 + gs.size * 15)}
          >
            <Popup>{gs.name}</Popup>
          </Marker>
        ))}

      {/* Crowd hotspots */}
      {showCrowds &&
        crowdHotspots.map(ch => (
          <Marker
            key={ch.id}
            position={[ch.lat, ch.lng]}
            icon={createCustomIcon('👤', 20 + ch.density * 15)}
          >
            <Popup>High Crowd Density</Popup>
          </Marker>
        ))}

      {/* AQI Heatmap */}
      {showAQI &&
        environmentGrid.map((point, idx) => {
          const opacity = point.aqi > 150 ? 0.4 : point.aqi > 100 ? 0.2 : 0.1;
          const color =
            point.aqi > 150
              ? 'red'
              : point.aqi > 100
              ? 'yellow'
              : 'green';
          return (
            <Circle
              key={`aqi-${idx}`}
              center={[point.lat, point.lng]}
              radius={500}
              pathOptions={{
                fillColor: color,
                fillOpacity: opacity,
                color: 'transparent',
              }}
            />
          );
        })}

      {/* Noise circles */}
      {showNoise &&
        environmentGrid
          .filter(p => p.noise > 60)
          .map((point, idx) => (
            <Circle
              key={`noise-${idx}`}
              center={[point.lat, point.lng]}
              radius={300}
              pathOptions={{
                fillColor: 'orange',
                fillOpacity: 0.2,
                color: 'orange',
                opacity: 0.3,
              }}
            />
          ))}

      {/* Clinic markers */}
      {clinics.map(clinic => {
        const distance =
          maxDistance !== null
            ? calculateDistance(userLat, userLng, clinic.lat, clinic.lng)
            : null;
        const isBeyondMaxDistance =
          maxDistance !== null && distance !== null && distance > maxDistance;
        const opacity = isBeyondMaxDistance ? 0.4 : 1.0;

        return (
          <Marker
            key={clinic.id}
            position={[clinic.lat, clinic.lng]}
            icon={createClinicDotIcon(12, '#0066cc')}
            eventHandlers={{
              click: () => onClinicClick(clinic),
            }}
            opacity={opacity}
          >
            <Popup>
              <div>
                <strong>{clinic.name}</strong>
                <br />
                {distance !== null && `${distance.toFixed(1)} miles away`}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Routes */}
      {routes.map(route => {
        // Get the clinic position for this route (assuming routes are for selectedClinic)
        const clinicPos: [number, number] | null = selectedClinic
          ? [selectedClinic.lat, selectedClinic.lng]
          : null;

        if (!clinicPos) return null;

        // Function to calculate segment color based on environment
        // Returns a color that clearly shows stress level: green (low) -> yellow -> orange -> red (high)
        // Enhanced contrast for more visible color changes
        const getSegmentColor = (segment: RouteSegment, _baseColor: string): string => {
          // Calculate comprehensive stress score (0-1)
          const crowdStress = segment.crowd * 0.3;
          const noiseStress = segment.noise * 0.25;
          const aqiStress = (segment.aqi / 300) * 0.2;
          const trafficStress = segment.traffic * 0.25;
          const totalStress = crowdStress + noiseStress + aqiStress + trafficStress;
          
          // Green spaces significantly reduce stress
          const greenFactor = segment.green;
          const netStress = Math.max(0, Math.min(1, totalStress - greenFactor * 0.6));

          // Enhanced color mapping with higher contrast
          // Low stress (0-0.25): Bright green shades
          // Medium stress (0.25-0.5): Yellow shades  
          // High stress (0.5-0.75): Orange shades
          // Very high stress (0.75-1.0): Red/Deep red shades
          
          if (greenFactor > 0.5) {
            // High green space: very bright green, very calming
            return '#00FF00'; // Bright green
          } else if (netStress < 0.15) {
            // Very low stress: bright light green
            return '#7FFF00'; // Chartreuse
          } else if (netStress < 0.3) {
            // Low stress: green to yellow-green
            const t = (netStress - 0.15) / 0.15;
            return `rgb(${Math.floor(127 + 128 * t)}, ${Math.floor(255 - 55 * t)}, ${Math.floor(0)})`;
          } else if (netStress < 0.5) {
            // Medium-low stress: yellow
            const t = (netStress - 0.3) / 0.2;
            return `rgb(${Math.floor(255 - 55 * t)}, ${Math.floor(200 - 100 * t)}, ${Math.floor(0)})`;
          } else if (netStress < 0.7) {
            // Medium-high stress: orange to deep orange
            const t = (netStress - 0.5) / 0.2;
            return `rgb(${Math.floor(200 - 100 * t)}, ${Math.floor(100 - 50 * t)}, ${Math.floor(0)})`;
          } else if (netStress < 0.85) {
            // High stress: red-orange to red
            const t = (netStress - 0.7) / 0.15;
            return `rgb(${Math.floor(100 + 155 * t)}, ${Math.floor(50 - 50 * t)}, ${Math.floor(0)})`;
          } else {
            // Very high stress: deep red to dark red
            const t = (netStress - 0.85) / 0.15;
            return `rgb(${Math.floor(255 - 175 * t)}, ${Math.floor(0)}, ${Math.floor(0)})`;
          }
        };

        // Build route segments with colors
        const baseColor = routeColors[route.type];
        const routeSegments: Array<{
          positions: [number, number][];
          color: string;
        }> = [];

        // Start segment: user location to first route segment
        if (route.segments.length > 0) {
          const firstSegment = route.segments[0];
          routeSegments.push({
            positions: [
              [userLat, userLng],
              [firstSegment.lat, firstSegment.lng],
            ],
            color: getSegmentColor(firstSegment, baseColor),
          });
        }

        // Middle segments: between route segments
        // Each segment uses its own environment data for accurate color representation
        for (let i = 0; i < route.segments.length - 1; i++) {
          const currentSegment = route.segments[i];
          const nextSegment = route.segments[i + 1];
          
          // Create intermediate points for smoother color transitions
          // Use current segment's color for the first half, next segment's for the second half
          const midLat = (currentSegment.lat + nextSegment.lat) / 2;
          const midLng = (currentSegment.lng + nextSegment.lng) / 2;
          
          // First half: use current segment's environment
          routeSegments.push({
            positions: [
              [currentSegment.lat, currentSegment.lng],
              [midLat, midLng],
            ],
            color: getSegmentColor(currentSegment, baseColor),
          });
          
          // Second half: use next segment's environment
          routeSegments.push({
            positions: [
              [midLat, midLng],
              [nextSegment.lat, nextSegment.lng],
            ],
            color: getSegmentColor(nextSegment, baseColor),
          });
        }

        // End segment: last route segment to clinic
        if (route.segments.length > 0) {
          const lastSegment = route.segments[route.segments.length - 1];
          routeSegments.push({
            positions: [
              [lastSegment.lat, lastSegment.lng],
              clinicPos,
            ],
            color: getSegmentColor(lastSegment, baseColor),
          });
        } else {
          // Direct route (no segments)
          routeSegments.push({
            positions: [
              [userLat, userLng],
              clinicPos,
            ],
            color: baseColor,
          });
        }

        return (
          <React.Fragment key={route.id}>
            {routeSegments.map((segment, idx) => (
              <Polyline
                key={`${route.id}-${idx}`}
                positions={segment.positions}
                pathOptions={{
                  color: segment.color,
                  weight: 7, // Thicker for better visibility
                  opacity: 0.95, // More opaque for clearer color distinction
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            ))}
            
            {/* Route type label with connecting line and arrow */}
            {route.segments.length > 0 && (() => {
              // Calculate label position based on route type to avoid overlap
              // Different routes get different positions along the route
              let labelPositionRatio = 0.5; // Default: middle of route
              if (route.type === 'fastest') {
                labelPositionRatio = 0.4; // Slightly earlier
              } else if (route.type === 'low-stress') {
                labelPositionRatio = 0.5; // Middle
              } else if (route.type === 'balanced') {
                labelPositionRatio = 0.6; // Slightly later
              }
              
              const midIdx = Math.floor(route.segments.length * labelPositionRatio);
              const midSegment = route.segments[Math.min(midIdx, route.segments.length - 1)];
              
              // This is the point on the route where the line connects
              const routePointLat = midSegment.lat;
              const routePointLng = midSegment.lng;
              
              // Calculate offset perpendicular to route direction
              // Different routes offset in different directions to avoid overlap
              let offsetLat = 0;
              let offsetLng = 0;
              // let perpendicularAngle = 0;
              
              // Determine offset direction based on route type
              let offsetDirection = 1; // Default: right side
              if (route.type === 'fastest') {
                offsetDirection = 1; // Right side
              } else if (route.type === 'low-stress') {
                offsetDirection = -1; // Left side
              } else if (route.type === 'balanced') {
                offsetDirection = 1; // Right side, but with different distance
              }
              
              if (midIdx > 0 && midIdx < route.segments.length - 1) {
                const prevSegment = route.segments[Math.max(0, midIdx - 1)];
                const nextSegment = route.segments[Math.min(route.segments.length - 1, midIdx + 1)];
                // Calculate direction vector
                const dx = nextSegment.lng - prevSegment.lng;
                const dy = nextSegment.lat - prevSegment.lat;
                const length = Math.sqrt(dx * dx + dy * dy);
                if (length > 0) {
                  // Perpendicular offset (rotate 90 degrees) - adjust distance based on route type
                  const baseOffsetDistance = 0.012; // ~1.2 km base offset
                  const offsetDistance = baseOffsetDistance * offsetDirection;
                  offsetLat = (-dx / length) * offsetDistance;
                  offsetLng = (dy / length) * offsetDistance;
                  // Calculate angle for arrow direction (from route to label)
                  // perpendicularAngle = Math.atan2(offsetLat, offsetLng) * 180 / Math.PI;
                }
              } else {
                // Larger simple offset if at edge
                offsetLat = 0.01 * offsetDirection;
                offsetLng = 0.01 * offsetDirection;
                // perpendicularAngle = 45 * offsetDirection;
              }
              
              const labelLat = routePointLat + offsetLat;
              const labelLng = routePointLng + offsetLng;
              
              // Calculate angle from label to route point for arrow direction
              const arrowDx = routePointLng - labelLng;
              const arrowDy = routePointLat - labelLat;
              const arrowAngle = Math.atan2(arrowDy, arrowDx) * 180 / Math.PI;
              
              // Route type display configuration
              const routeTypeConfig: Record<string, { label: string; icon: string; bgColor: string; textColor: string }> = {
                fastest: {
                  label: 'Fastest',
                  icon: '⚡',
                  bgColor: '#0066ff',
                  textColor: '#ffffff',
                },
                'low-stress': {
                  label: 'Low-Stress',
                  icon: '🌿',
                  bgColor: '#00cc00',
                  textColor: '#ffffff',
                },
                balanced: {
                  label: 'Balanced',
                  icon: '⚖️',
                  bgColor: '#9933ff',
                  textColor: '#ffffff',
                },
              };
              
              const config = routeTypeConfig[route.type] || {
                label: route.type,
                icon: '📍',
                bgColor: '#666666',
                textColor: '#ffffff',
              };
              
              return (
                <React.Fragment key={`label-${route.id}`}>
                  {/* Connecting line from route to label - thinner */}
                  <Polyline
                    positions={[
                      [routePointLat, routePointLng],
                      [labelLat, labelLng],
                    ]}
                    pathOptions={{
                      color: config.bgColor,
                      weight: 1.5,
                      opacity: 0.5,
                      dashArray: '4, 4',
                      lineCap: 'round',
                    }}
                  />
                  
                  {/* Label with arrow pointing to route */}
                  <Marker
                    position={[labelLat, labelLng]}
                    icon={L.divIcon({
                      className: 'route-label-marker',
                      html: `
                        <div style="
                          position: relative;
                          display: inline-block;
                        ">
                          <!-- Arrow pointing to route (SVG for better rotation) - smaller -->
                          <svg style="
                            position: absolute;
                            left: -16px;
                            top: 50%;
                            transform: translateY(-50%) rotate(${arrowAngle}deg);
                            width: 12px;
                            height: 12px;
                            opacity: 0.7;
                          ">
                            <polygon 
                              points="0,0 12,6 0,12" 
                              fill="${config.bgColor}"
                              stroke="white"
                              stroke-width="0.5"
                            />
                          </svg>
                          <!-- Label box - smaller size -->
                          <div style="
                            background: ${config.bgColor};
                            color: ${config.textColor};
                            padding: 4px 8px;
                            border-radius: 16px;
                            font-size: 10px;
                            font-weight: 600;
                            white-space: nowrap;
                            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                            border: 1.5px solid white;
                            display: flex;
                            align-items: center;
                            gap: 3px;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            pointer-events: none;
                          ">
                            <span style="font-size: 10px;">${config.icon}</span>
                            <span>${config.label}</span>
                          </div>
                        </div>
                      `,
                      iconSize: [100, 24],
                      iconAnchor: [50, 12],
                    })}
                    zIndexOffset={1000}
                    interactive={false}
                  />
                </React.Fragment>
              );
            })()}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}

