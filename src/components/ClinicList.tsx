import { Clinic, Filters } from '../data/types';
import { calculateRecommendationScore, getRecommendationLevel } from '../utils/recommendation';
import { Badge, ProgressBar } from 'react-bootstrap';

interface ClinicListProps {
  clinics: Clinic[];
  userLat: number;
  userLng: number;
  selectedClinic: Clinic | null;
  onClinicSelect: (clinic: Clinic) => void;
  maxDistance: number | null;
  filters: Filters;
}


export default function ClinicList({
  clinics,
  userLat,
  userLng,
  selectedClinic,
  onClinicSelect,
  maxDistance,
  filters,
}: ClinicListProps) {
  // Calculate recommendation scores for all clinics
  const clinicsWithScores = clinics.map(clinic =>
    calculateRecommendationScore(clinic, filters, userLat, userLng)
  );

  // Sort by recommendation score (descending), then by distance
  const sortedClinics = clinicsWithScores.sort((a, b) => {
    if (Math.abs(a.score - b.score) > 5) {
      return b.score - a.score; // Sort by score if difference is significant
    }
    return a.matchDetails.distance - b.matchDetails.distance; // Otherwise sort by distance
  });

  const hasActiveFilters = 
    filters.clinicTypes.length > 0 ||
    filters.treatmentFocus.length > 0 ||
    filters.privacyLevel.length > 0 ||
    filters.languages.length > 0 ||
    filters.insurance.length > 0 ||
    filters.allowsAnonymous !== null ||
    filters.telehealth !== null;

  return (
    <div
      className="p-2"
      style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#f8f9fa' }}
    >
      <h6 className="mb-3">
        {hasActiveFilters ? 'Recommended Clinics' : 'Clinics'} ({clinics.length})
      </h6>
      {sortedClinics.map(({ clinic, score, reasons, matchDetails }) => {
        const distance = matchDetails.distance;
        const isBeyondMaxDistance =
          maxDistance !== null && distance > maxDistance;
        const isSelected = selectedClinic?.id === clinic.id;
        const recommendation = getRecommendationLevel(score);

        return (
          <div
            key={clinic.id}
            className={`card mb-3 ${
              isSelected ? 'border-primary shadow-sm' : ''
            }`}
            style={{
              cursor: 'pointer',
              opacity: isBeyondMaxDistance ? 0.4 : 1.0,
              transition: 'all 0.2s',
            }}
            onClick={() => onClinicSelect(clinic)}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-start mb-2">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#0066cc',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    marginRight: '10px',
                    marginTop: '4px',
                    flexShrink: 0,
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="card-title mb-0" style={{ fontSize: '14px', fontWeight: '600' }}>
                      {clinic.name}
                    </h6>
                    {hasActiveFilters && (
                      <Badge
                        bg={recommendation.level === 'excellent' ? 'success' : recommendation.level === 'good' ? 'info' : recommendation.level === 'fair' ? 'warning' : 'secondary'}
                        style={{ fontSize: '10px' }}
                      >
                        {recommendation.label}
                      </Badge>
                    )}
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <span className="small text-muted me-2">
                      📍 {distance.toFixed(1)} miles
                    </span>
                    {hasActiveFilters && (
                      <div className="flex-grow-1 ms-2" style={{ maxWidth: '100px' }}>
                        <ProgressBar
                          now={Math.min(100, score)}
                          variant={recommendation.level === 'excellent' ? 'success' : recommendation.level === 'good' ? 'info' : recommendation.level === 'fair' ? 'warning' : 'secondary'}
                          style={{ height: '6px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendation Reasons */}
              {hasActiveFilters && reasons.length > 0 && (
                <div
                  className="mt-2 pt-2 border-top"
                  style={{ borderColor: '#dee2e6' }}
                >
                  <div className="small text-muted mb-1" style={{ fontSize: '10px', fontWeight: '600' }}>
                    Why recommended:
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {reasons.slice(0, 3).map((reason, idx) => (
                      <Badge
                        key={idx}
                        bg="light"
                        text="dark"
                        style={{
                          fontSize: '10px',
                          fontWeight: 'normal',
                          padding: '2px 6px',
                        }}
                      >
                        {reason}
                      </Badge>
                    ))}
                    {reasons.length > 3 && (
                      <Badge
                        bg="light"
                        text="dark"
                        style={{
                          fontSize: '10px',
                          fontWeight: 'normal',
                          padding: '2px 6px',
                        }}
                      >
                        +{reasons.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="mt-2">
                <p className="card-text mb-0" style={{ fontSize: '11px', color: '#666' }}>
                  {clinic.type} • {clinic.treatmentFocus.slice(0, 2).join(', ')}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

