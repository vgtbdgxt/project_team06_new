import { EnvironmentGrid, ClinicLoad } from './types';

// Create a grid of environment data points
export const environmentGrid: EnvironmentGrid[] = [];

// Generate grid points around LA area (34.0 to 34.15 lat, -118.5 to -118.2 lng)
const gridSize = 0.05; // ~5km spacing
for (let lat = 34.0; lat <= 34.15; lat += gridSize) {
  for (let lng = -118.5; lng <= -118.2; lng += gridSize) {
    // Mock AQI: higher near downtown and highways
    const distFromDowntown = Math.sqrt(
      Math.pow(lat - 34.0522, 2) + Math.pow(lng - -118.2437, 2)
    );
    const aqi = Math.min(300, 50 + distFromDowntown * 100 + Math.random() * 30);
    
    // Mock noise: higher near busy areas
    const noise = Math.min(100, 30 + distFromDowntown * 50 + Math.random() * 20);
    
    // Mock traffic: higher near downtown and major roads
    const traffic = Math.min(1.0, 0.3 + distFromDowntown * 0.3 + Math.random() * 0.2);
    
    environmentGrid.push({ lat, lng, aqi, noise, traffic });
  }
}

// Predicted clinic load by hour (0-23)
export const clinicLoads: ClinicLoad[] = [];

const clinicIds = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15'
];

clinicIds.forEach(clinicId => {
  for (let hour = 0; hour < 24; hour++) {
    // Peak hours: 9-11 AM, 2-5 PM
    let load = 0.3 + Math.random() * 0.2; // base load
    
    if (hour >= 9 && hour <= 11) {
      load = 0.7 + Math.random() * 0.25; // morning peak
    } else if (hour >= 14 && hour <= 17) {
      load = 0.8 + Math.random() * 0.2; // afternoon peak
    } else if (hour >= 18 && hour <= 20) {
      load = 0.6 + Math.random() * 0.2; // evening
    } else if (hour >= 22 || hour <= 6) {
      load = 0.2 + Math.random() * 0.15; // night/early morning
    }
    
    clinicLoads.push({
      clinicId,
      hour,
      load: Math.min(1.0, load),
    });
  }
});

