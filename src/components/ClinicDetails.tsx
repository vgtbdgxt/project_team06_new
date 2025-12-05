import { Clinic } from '../data/types';
import { calculateDistance } from '../utils/distance';
import { Badge, Button, Card } from 'react-bootstrap';

interface ClinicDetailsProps {
  clinic: Clinic | null;
  userLat: number;
  userLng: number;
  onClose: () => void;
}

export default function ClinicDetails({
  clinic,
  userLat,
  userLng,
  onClose,
}: ClinicDetailsProps) {
  if (!clinic) return null;

  const distance = calculateDistance(userLat, userLng, clinic.lat, clinic.lng);

  const getClinicTypeIcon = (type: string): string => {
    switch (type) {
      case 'hospital':
        return '🏥';
      case 'outpatient':
        return '🩺';
      case 'specialized':
        return '🧠';
      case 'urgent':
        return '🚨';
      default:
        return '📍';
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="p-3 bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <span style={{ fontSize: '32px', marginRight: '12px' }}>
                {getClinicTypeIcon(clinic.type)}
              </span>
              <div>
                <h4 className="mb-0" style={{ fontSize: '18px', fontWeight: '600' }}>
                  {clinic.name}
                </h4>
                <Badge bg="secondary" className="mt-1">
                  {clinic.type}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            ← Back
          </Button>
        </div>
        <div className="d-flex align-items-center">
          <span className="text-muted small">📍 {distance.toFixed(1)} miles away</span>
        </div>
      </div>

      <div className="p-3">
        {/* Contact Information */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <h6 className="mb-3 fw-semibold">📍 Contact Information</h6>
            <div className="mb-2">
              <div className="small text-muted mb-1">Address</div>
              <div>{clinic.address}</div>
            </div>
            <div className="mb-2">
              <div className="small text-muted mb-1">Phone</div>
              <a href={`tel:${clinic.phone}`} className="text-decoration-none">
                {clinic.phone}
              </a>
            </div>
            <div>
              <div className="small text-muted mb-1">Email</div>
              <a href={`mailto:${clinic.email}`} className="text-decoration-none">
                {clinic.email}
              </a>
            </div>
          </Card.Body>
        </Card>

        {/* Hours & Availability */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <h6 className="mb-3 fw-semibold">🕐 Hours & Availability</h6>
            <div className="mb-3">
              <div className="small text-muted mb-1">Opening Hours</div>
              <div>{clinic.openingHours}</div>
            </div>
            <div>
              <div className="small text-muted mb-2">Appointment Types</div>
              <div className="d-flex flex-wrap gap-1">
                {clinic.appointmentType.map(type => (
                  <Badge
                    key={type}
                    bg={type === 'walk-in' ? 'success' : type === 'scheduled' ? 'primary' : 'info'}
                  >
                    {type === 'walk-in' ? '🚪 Walk-in' : type === 'scheduled' ? '📅 Scheduled' : '📋 Referral'}
                  </Badge>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Treatment Focus */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <h6 className="mb-3 fw-semibold">🧠 Treatment Focus</h6>
            <div className="d-flex flex-wrap gap-2">
              {clinic.treatmentFocus.map(tf => (
                <Badge
                  key={tf}
                  bg="primary"
                  style={{ fontSize: '12px', padding: '6px 10px' }}
                >
                  {tf}
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Insurance & Cost */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <h6 className="mb-3 fw-semibold">💳 Insurance & Cost</h6>
            <div className="mb-3">
              <div className="small text-muted mb-2">Insurance Accepted</div>
              <div className="d-flex flex-wrap gap-2">
                {clinic.insurance.map(ins => (
                  <Badge key={ins} bg="success" style={{ fontSize: '12px', padding: '6px 10px' }}>
                    {ins}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="small text-muted mb-1">Cost Model</div>
              <div className="fw-semibold">{clinic.costModel}</div>
            </div>
          </Card.Body>
        </Card>

        {/* Features */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <h6 className="mb-3 fw-semibold">✨ Features</h6>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center">
                <span style={{ fontSize: '20px', marginRight: '10px' }}>
                  {clinic.allowsAnonymous ? '✅' : '❌'}
                </span>
                <div>
                  <div className="fw-semibold small">Anonymous Visits</div>
                  <div className="small text-muted">
                    {clinic.allowsAnonymous ? 'Allowed' : 'Not available'}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span style={{ fontSize: '20px', marginRight: '10px' }}>
                  {clinic.telehealth ? '✅' : '❌'}
                </span>
                <div>
                  <div className="fw-semibold small">Telehealth</div>
                  <div className="small text-muted">
                    {clinic.telehealth ? 'Available' : 'Not available'}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span style={{ fontSize: '20px', marginRight: '10px' }}>🔒</span>
                <div>
                  <div className="fw-semibold small">Privacy Level</div>
                  <div className="small text-muted">
                    {clinic.privacyLevel.replace(/-/g, ' ')}
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Languages */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <h6 className="mb-3 fw-semibold">🗣️ Supported Languages</h6>
            <div className="d-flex flex-wrap gap-2">
              {clinic.languages.map(lang => (
                <Badge key={lang} bg="info" style={{ fontSize: '12px', padding: '6px 10px' }}>
                  {lang}
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

