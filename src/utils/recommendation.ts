import { Clinic, Filters, TreatmentFocus } from '../data/types';
import { calculateDistance } from './distance';

export interface RecommendationScore {
  clinic: Clinic;
  score: number;
  reasons: string[];
  matchDetails: {
    distance: number;
    distanceScore: number;
    typeMatch: boolean;
    treatmentMatch: boolean;
    privacyMatch: boolean;
    languageMatch: boolean;
    insuranceMatch: boolean;
    anonymousMatch: boolean | null;
    telehealthMatch: boolean | null;
  };
}

export function calculateRecommendationScore(
  clinic: Clinic,
  filters: Filters,
  userLat: number,
  userLng: number
): RecommendationScore {
  const distance = calculateDistance(userLat, userLng, clinic.lat, clinic.lng);
  const reasons: string[] = [];
  let score = 0;

  // Distance scoring (closer is better, max 30 points)
  const distanceScore = Math.max(0, 30 - distance * 2);
  score += distanceScore;
  if (distance < 2) {
    reasons.push('📍 Very close to you');
  } else if (distance < 5) {
    reasons.push('📍 Close location');
  }

  // Clinic type match (10 points)
  const typeMatch = filters.clinicTypes.length === 0 || filters.clinicTypes.includes(clinic.type);
  if (typeMatch && filters.clinicTypes.length > 0) {
    score += 10;
    reasons.push(`🏥 ${clinic.type} type match`);
  }

  // Treatment focus match (15 points per match)
  const treatmentMatches = filters.treatmentFocus.filter((tf: TreatmentFocus) => clinic.treatmentFocus.includes(tf));
  if (treatmentMatches.length > 0) {
    score += treatmentMatches.length * 15;
    reasons.push(`🧠 Offers: ${treatmentMatches.join(', ')}`);
  }

  // Privacy level match (10 points)
  const privacyMatch = filters.privacyLevel.length === 0 || filters.privacyLevel.includes(clinic.privacyLevel);
  if (privacyMatch && filters.privacyLevel.length > 0) {
    score += 10;
    reasons.push(`🔒 Privacy level match`);
  }

  // Language match (8 points per match)
  const languageMatches = filters.languages.filter((lang: string) => clinic.languages.includes(lang));
  if (languageMatches.length > 0) {
    score += languageMatches.length * 8;
    reasons.push(`🗣️ Speaks: ${languageMatches.join(', ')}`);
  }

  // Insurance match (12 points per match)
  const insuranceMatches = filters.insurance.filter((ins: string) => clinic.insurance.includes(ins));
  if (insuranceMatches.length > 0) {
    score += insuranceMatches.length * 12;
    reasons.push(`💳 Accepts: ${insuranceMatches.join(', ')}`);
  }

  // Anonymous visits match (10 points)
  if (filters.allowsAnonymous !== null && clinic.allowsAnonymous === filters.allowsAnonymous) {
    score += 10;
    if (clinic.allowsAnonymous) {
      reasons.push('👤 Allows anonymous visits');
    }
  }

  // Telehealth match (8 points)
  if (filters.telehealth !== null && clinic.telehealth === filters.telehealth) {
    score += 8;
    if (clinic.telehealth) {
      reasons.push('💻 Telehealth available');
    }
  }

  // Bonus for walk-in availability (5 points)
  if (clinic.appointmentType.includes('walk-in')) {
    score += 5;
    reasons.push('🚪 Walk-in available');
  }

  // Bonus for 24/7 availability (5 points)
  if (clinic.openingHours.includes('24/7')) {
    score += 5;
    reasons.push('🕐 Open 24/7');
  }

  return {
    clinic,
    score,
    reasons,
    matchDetails: {
      distance,
      distanceScore,
      typeMatch,
      treatmentMatch: treatmentMatches.length > 0,
      privacyMatch,
      languageMatch: languageMatches.length > 0,
      insuranceMatch: insuranceMatches.length > 0,
      anonymousMatch: filters.allowsAnonymous !== null ? clinic.allowsAnonymous === filters.allowsAnonymous : null,
      telehealthMatch: filters.telehealth !== null ? clinic.telehealth === filters.telehealth : null,
    },
  };
}

export function getRecommendationLevel(score: number): {
  level: 'excellent' | 'good' | 'fair' | 'basic';
  color: string;
  label: string;
} {
  if (score >= 60) {
    return { level: 'excellent', color: '#28a745', label: 'Excellent Match' };
  } else if (score >= 40) {
    return { level: 'good', color: '#17a2b8', label: 'Good Match' };
  } else if (score >= 20) {
    return { level: 'fair', color: '#ffc107', label: 'Fair Match' };
  } else {
    return { level: 'basic', color: '#6c757d', label: 'Basic Match' };
  }
}

