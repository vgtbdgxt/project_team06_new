import { useState, useMemo } from 'react';
import { Route, TravelMode, BurdenWeights } from '../data/types';
import { generateMockRoute } from '../utils/mockRouting';
import { clinicLoads } from '../data/environment';

export function useRoutes() {
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [weights, setWeights] = useState<BurdenWeights>({
    crowd: 0.3,
    noise: 0.2,
    green: 0.2,
    aqi: 0.2,
    traffic: 0.1,
  });
  const [startTime, setStartTime] = useState<Date>(new Date());

  const generateRoutes = (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Route[] => {
    const routes: Route[] = [
      generateMockRoute(
        startLat,
        startLng,
        endLat,
        endLng,
        travelMode,
        'fastest',
        weights
      ),
      generateMockRoute(
        startLat,
        startLng,
        endLat,
        endLng,
        travelMode,
        'low-stress',
        weights
      ),
      generateMockRoute(
        startLat,
        startLng,
        endLat,
        endLng,
        travelMode,
        'balanced',
        weights
      ),
    ];

    return routes;
  };

  const getClinicLoadAtArrival = (
    clinicId: string,
    arrivalTime: Date
  ): number => {
    const hour = arrivalTime.getHours();
    const load = clinicLoads.find(
      cl => cl.clinicId === clinicId && cl.hour === hour
    );
    return load?.load ?? 0.5;
  };

  const getNextLowLoadTime = (
    clinicId: string,
    currentTime: Date,
    threshold: number = 0.5
  ): { hours: number; minutes: number } | null => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    // Check next 24 hours, starting from the next hour
    for (let hoursAhead = 1; hoursAhead <= 24; hoursAhead++) {
      const checkHour = (currentHour + hoursAhead) % 24;
      const load = clinicLoads.find(
        cl => cl.clinicId === clinicId && cl.hour === checkHour
      );
      
      if (load && load.load < threshold) {
        // Calculate total minutes until the start of that hour
        const totalMinutes = hoursAhead * 60 - currentMinute;
        if (totalMinutes > 0) {
          return {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60,
          };
        }
      }
    }
    
    return null;
  };

  return {
    selectedClinic,
    setSelectedClinic,
    travelMode,
    setTravelMode,
    weights,
    setWeights,
    startTime,
    setStartTime,
    generateRoutes,
    getClinicLoadAtArrival,
    getNextLowLoadTime,
  };
}

