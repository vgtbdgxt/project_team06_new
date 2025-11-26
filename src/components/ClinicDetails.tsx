import { Clinic } from '../data/clinics';
import { calculateDistance } from '../utils/distance';

interface ClinicDetailsProps {
  clinic: Clinic | null;
  userLocation: { lat: number; lon: number } | null;
}

export function ClinicDetails({ clinic, userLocation }: ClinicDetailsProps) {
  if (!clinic) {
    return (
      <div className="clinic-details p-3">
        <h3 className="h5 mb-3">Clinic Details</h3>
        <p className="text-muted">
          Click a clinic marker on the map to see details here.
        </p>
      </div>
    );
  }

  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lon, clinic.lat, clinic.lon)
    : null;

  const typeLabels: Record<string, string> = {
    hospital: 'Hospital',
    outpatient: 'Outpatient',
    specialized: 'Specialized Program',
    urgent_care: 'Urgent Care'
  };

  const costLabels: Record<string, string> = {
    free: 'Free',
    sliding: 'Sliding Scale',
    insurance: 'Insurance Accepted',
    private: 'Private Pay'
  };

  return (
    <div className="clinic-details p-3 h-100 overflow-auto">
      <h3 className="h5 mb-3">Clinic Details</h3>

      {/* Name and Type */}
      <div className="mb-3">
        <h4 className="h5">{clinic.name}</h4>
        <span className="badge bg-primary">{typeLabels[clinic.type]}</span>
        {distance !== null && (
          <span className="badge bg-info ms-2">
            {distance.toFixed(1)} km away
          </span>
        )}
      </div>

      {/* Contact Information */}
      <div className="mb-3">
        <h5 className="h6 text-muted">Contact</h5>
        <p className="mb-1">
          <strong>Address:</strong> {clinic.address}
        </p>
        <p className="mb-1">
          <strong>Phone:</strong>{' '}
          <a href={`tel:${clinic.phone}`}>{clinic.phone}</a>
        </p>
        <p className="mb-0">
          <strong>Email:</strong>{' '}
          <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
        </p>
      </div>

      {/* Hours and Appointment */}
      <div className="mb-3">
        <h5 className="h6 text-muted">Opening & Appointment</h5>
        <p className="mb-1">
          <strong>Hours:</strong> {clinic.hours}
        </p>
        <p className="mb-0 small">
          <strong>Appointment:</strong> {clinic.appointment}
        </p>
      </div>

      {/* Clinical Focus */}
      <div className="mb-3">
        <h5 className="h6 text-muted">Clinical Focus</h5>
        <div>
          {clinic.focus.map((focus) => (
            <span key={focus} className="badge bg-secondary me-1 mb-1">
              {focus.charAt(0).toUpperCase() + focus.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="mb-3">
        <h5 className="h6 text-muted">Accessibility</h5>
        <ul className="list-unstyled mb-0">
          {clinic.online && (
            <li>
              <span className="badge bg-success me-1">✓</span> Online /
              Telehealth
            </li>
          )}
          {clinic.multilingual && (
            <li>
              <span className="badge bg-success me-1">✓</span> Multilingual
              Support
            </li>
          )}
          {clinic.acceptsUndiagnosed && (
            <li>
              <span className="badge bg-success me-1">✓</span> Accepts
              Undiagnosed / Self-Referral
            </li>
          )}
          {clinic.noGuardianRequired && (
            <li>
              <span className="badge bg-success me-1">✓</span> No Guardian
              Required
            </li>
          )}
          {!clinic.online &&
            !clinic.multilingual &&
            !clinic.acceptsUndiagnosed &&
            !clinic.noGuardianRequired && (
              <li className="text-muted">No special accessibility features listed</li>
            )}
        </ul>
      </div>

      {/* Additional Info */}
      <div className="mb-3">
        <h5 className="h6 text-muted">Additional Information</h5>
        <p className="mb-1">
          <strong>Cost Model:</strong> {costLabels[clinic.costModel]}
        </p>
        <p className="mb-0">
          <strong>Estimated Wait Time:</strong> {clinic.waitTimeDays} day
          {clinic.waitTimeDays !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

