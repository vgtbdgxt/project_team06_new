import { useState, useEffect } from 'react';

export interface UserLocation {
  lat: number;
  lon: number;
  error: string | null;
}

const DEFAULT_LOCATION: UserLocation = {
  lat: 34.0522, // Los Angeles default
  lon: -118.2437,
  error: null
};

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation({
        ...DEFAULT_LOCATION,
        error: 'Geolocation is not supported by your browser'
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null
        });
        setIsLoading(false);
      },
      (error) => {
        setLocation({
          ...DEFAULT_LOCATION,
          error: error.message || 'Unable to retrieve your location'
        });
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return { location, isLoading, requestLocation };
}

