import { useState, useEffect, useCallback } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
  loading: boolean;
  error: string | null;
}

const DEFAULT_LOCATION = {
  lat: 34.0522, // Downtown LA
  lng: -118.2437,
};

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({
    ...DEFAULT_LOCATION,
    loading: true,
    error: null,
  });

  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({
        ...DEFAULT_LOCATION,
        loading: false,
        error: 'Geolocation not supported',
      });
      return;
    }

    setLocation(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      error => {
        console.warn('Geolocation error:', error);
        setLocation({
          ...DEFAULT_LOCATION,
          loading: false,
          error: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  return {
    ...location,
    updateLocation,
  };
}

