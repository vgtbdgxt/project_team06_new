export type ClinicType = 'hospital' | 'outpatient' | 'specialized' | 'urgent';

export type TreatmentFocus = 
  | 'CBT' 
  | 'medication' 
  | 'trauma' 
  | 'family therapy' 
  | 'group therapy' 
  | 'substance abuse' 
  | 'crisis intervention';

export type AppointmentType = 'walk-in' | 'scheduled' | 'referral';

export type PrivacyLevel = 'anonymous' | 'guardian-not-required' | 'standard';

export interface Clinic {
  id: string;
  name: string;
  type: ClinicType;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  openingHours: string;
  appointmentType: AppointmentType[];
  treatmentFocus: TreatmentFocus[];
  insurance: string[];
  costModel: string;
  allowsAnonymous: boolean;
  telehealth: boolean;
  languages: string[];
  privacyLevel: PrivacyLevel;
}

export interface GreenSpace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  size: number; // relative size for scaling
}

export interface CrowdHotspot {
  id: string;
  lat: number;
  lng: number;
  density: number; // 0-1 scale
}

export interface EnvironmentGrid {
  lat: number;
  lng: number;
  aqi: number; // 0-300 scale
  noise: number; // 0-100 scale
  traffic: number; // 0-1 scale (congestion level)
}

export interface RouteSegment {
  lat: number;
  lng: number;
  burden: number;
  crowd: number;
  noise: number;
  aqi: number;
  green: number;
  traffic: number; // 0-1 scale
}

export interface Route {
  id: string;
  type: 'fastest' | 'low-stress' | 'balanced';
  segments: RouteSegment[];
  duration: number; // minutes
  burdenScore: number;
  explanation: string;
}

export interface ClinicLoad {
  clinicId: string;
  hour: number; // 0-23
  load: number; // 0-1 scale
}

export type TravelMode = 'walking' | 'driving' | 'transit' | 'rideshare';

export interface BurdenWeights {
  crowd: number;
  noise: number;
  green: number;
  aqi: number;
  traffic: number;
}

