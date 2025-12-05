import { Form, Accordion, Badge, Button } from 'react-bootstrap';
import { Filters, ClinicType, TreatmentFocus, PrivacyLevel } from '../data/types';

interface FiltersPanelProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
  showGreenSpaces: boolean;
  showCrowds: boolean;
  showAQI: boolean;
  showNoise: boolean;
  onToggleGreenSpaces: () => void;
  onToggleCrowds: () => void;
  onToggleAQI: () => void;
  onToggleNoise: () => void;
  maxDistanceMax: number;
  onMaxDistanceMaxChange: (value: number) => void;
  onMaxDistanceChange: (value: number | null) => void;
}

export default function FiltersPanel({
  filters,
  onFilterChange,
  onReset,
  showGreenSpaces,
  showCrowds,
  showAQI,
  showNoise,
  onToggleGreenSpaces,
  onToggleCrowds,
  onToggleAQI,
  onToggleNoise,
  maxDistanceMax,
  onMaxDistanceMaxChange,
  onMaxDistanceChange,
}: FiltersPanelProps) {
  const clinicTypes: ClinicType[] = [
    'hospital',
    'outpatient',
    'specialized',
    'urgent',
  ];

  const treatmentFocuses: TreatmentFocus[] = [
    'CBT',
    'medication',
    'trauma',
    'family therapy',
    'group therapy',
    'substance abuse',
    'crisis intervention',
  ];

  const privacyLevels: PrivacyLevel[] = [
    'anonymous',
    'guardian-not-required',
    'standard',
  ];

  const languages = ['English', 'Spanish', 'Korean', 'Mandarin', 'Armenian', 'Farsi'];
  const insuranceOptions = ['Medicaid', 'Medicare', 'Private'];

  const toggleArrayItem = <T,>(
    array: T[],
    item: T,
    setter: (value: T[]) => void
  ) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const getActiveCount = (array: any[]): number => array.length;

  const totalActiveFilters =
    getActiveCount(filters.clinicTypes) +
    getActiveCount(filters.treatmentFocus) +
    getActiveCount(filters.privacyLevel) +
    getActiveCount(filters.languages) +
    getActiveCount(filters.insurance) +
    (filters.maxDistance !== null ? 1 : 0) +
    (filters.allowsAnonymous !== null ? 1 : 0) +
    (filters.telehealth !== null ? 1 : 0);

  return (
    <div className="p-3 bg-white" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold">Filters</h5>
        {totalActiveFilters > 0 && (
          <Badge bg="primary" className="me-2">
            {totalActiveFilters}
          </Badge>
        )}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onReset}
          disabled={totalActiveFilters === 0}
        >
          Reset
        </button>
      </div>

      {/* Map Layers - Always visible at top */}
      <div className="mb-4 pb-3 border-bottom">
        <h6 className="mb-3 fw-semibold">Map Layers</h6>
        <div className="row g-2">
          <div className="col-6">
            <Button
              variant={showGreenSpaces ? 'primary' : 'outline-primary'}
              className="w-100 d-flex flex-column align-items-center justify-content-center"
              style={{
                height: '70px',
                fontSize: '14px',
                fontWeight: showGreenSpaces ? '600' : '400',
                backgroundColor: showGreenSpaces ? undefined : 'transparent',
              }}
              onClick={onToggleGreenSpaces}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>🌳</span>
              <span>Green Spaces</span>
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant={showCrowds ? 'primary' : 'outline-primary'}
              className="w-100 d-flex flex-column align-items-center justify-content-center"
              style={{
                height: '70px',
                fontSize: '14px',
                fontWeight: showCrowds ? '600' : '400',
                backgroundColor: showCrowds ? undefined : 'transparent',
              }}
              onClick={onToggleCrowds}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>👤</span>
              <span>Crowd Density</span>
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant={showAQI ? 'primary' : 'outline-primary'}
              className="w-100 d-flex flex-column align-items-center justify-content-center"
              style={{
                height: '70px',
                fontSize: '14px',
                fontWeight: showAQI ? '600' : '400',
                backgroundColor: showAQI ? undefined : 'transparent',
              }}
              onClick={onToggleAQI}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>🌬️</span>
              <span>Air Quality</span>
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant={showNoise ? 'primary' : 'outline-primary'}
              className="w-100 d-flex flex-column align-items-center justify-content-center"
              style={{
                height: '70px',
                fontSize: '14px',
                fontWeight: showNoise ? '600' : '400',
                backgroundColor: showNoise ? undefined : 'transparent',
              }}
              onClick={onToggleNoise}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>🔊</span>
              <span>Noise Level</span>
            </Button>
          </div>
        </div>
      </div>

      <Accordion defaultActiveKey="" flush>

        {/* Clinic Type */}
        <Accordion.Item eventKey="0" className="border rounded mb-2">
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100 me-3">
              <span className="fw-semibold">Clinic Type</span>
              {getActiveCount(filters.clinicTypes) > 0 && (
                <Badge bg="primary" className="ms-2">
                  {getActiveCount(filters.clinicTypes)}
                </Badge>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body className="pt-2">
            {clinicTypes.map(type => (
              <Form.Check
                key={type}
                type="checkbox"
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                checked={filters.clinicTypes.includes(type)}
                onChange={() =>
                  toggleArrayItem(
                    filters.clinicTypes,
                    type,
                    arr => onFilterChange('clinicTypes', arr)
                  )
                }
                className="mb-2"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Treatment Focus */}
        <Accordion.Item eventKey="1" className="border rounded mb-2">
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100 me-3">
              <span className="fw-semibold">Treatment Focus</span>
              {getActiveCount(filters.treatmentFocus) > 0 && (
                <Badge bg="primary" className="ms-2">
                  {getActiveCount(filters.treatmentFocus)}
                </Badge>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body className="pt-2">
            {treatmentFocuses.map(tf => (
              <Form.Check
                key={tf}
                type="checkbox"
                label={tf}
                checked={filters.treatmentFocus.includes(tf)}
                onChange={() =>
                  toggleArrayItem(
                    filters.treatmentFocus,
                    tf,
                    arr => onFilterChange('treatmentFocus', arr)
                  )
                }
                className="mb-2"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Max Distance */}
        <Accordion.Item eventKey="2" className="border rounded mb-2">
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100 me-3">
              <span className="fw-semibold">Max Distance</span>
              {filters.maxDistance !== null && (
                <Badge bg="primary" className="ms-2">
                  {filters.maxDistance} mi
                </Badge>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body className="pt-2">
            <Form.Label className="small text-muted mb-2">
              Maximum distance in miles
            </Form.Label>
            <Form.Range
              min={1}
              max={maxDistanceMax}
              value={filters.maxDistance ?? Math.min(15, maxDistanceMax)}
              onChange={e => {
                const value = parseInt(e.target.value);
                onMaxDistanceChange(value);
              }}
              className="mb-2"
            />
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="text-muted small">
                {filters.maxDistance !== null
                  ? `${filters.maxDistance} miles`
                  : 'No limit'}
              </div>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="number"
                  min="1"
                  max={maxDistanceMax}
                  step="1"
                  value={filters.maxDistance ?? ''}
                  placeholder="15"
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '') {
                      onMaxDistanceChange(null);
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue > 0 && numValue <= maxDistanceMax) {
                        onMaxDistanceChange(numValue);
                      }
                    }
                  }}
                  style={{ maxWidth: '80px', fontSize: '12px' }}
                />
                <span className="text-muted small">mi</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onMaxDistanceChange(null)}
                  disabled={filters.maxDistance === null}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="mt-3 pt-2 border-top">
              <Form.Label className="small text-muted mb-2">
                Maximum slider range (miles)
              </Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="number"
                  min="10"
                  max="200"
                  step="5"
                  value={maxDistanceMax}
                  onChange={e => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 10 && value <= 200) {
                      onMaxDistanceMaxChange(value);
                      // If current maxDistance exceeds new max, adjust it
                      if (filters.maxDistance !== null && filters.maxDistance > value) {
                        onMaxDistanceChange(value);
                      }
                    }
                  }}
                  style={{ maxWidth: '100px', fontSize: '12px' }}
                />
                <span className="text-muted small">miles</span>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Privacy Level */}
        <Accordion.Item eventKey="3" className="border rounded mb-2">
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100 me-3">
              <span className="fw-semibold">Privacy Level</span>
              {getActiveCount(filters.privacyLevel) > 0 && (
                <Badge bg="primary" className="ms-2">
                  {getActiveCount(filters.privacyLevel)}
                </Badge>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body className="pt-2">
            {privacyLevels.map(pl => (
              <Form.Check
                key={pl}
                type="checkbox"
                label={pl.replace(/-/g, ' ')}
                checked={filters.privacyLevel.includes(pl)}
                onChange={() =>
                  toggleArrayItem(
                    filters.privacyLevel,
                    pl,
                    arr => onFilterChange('privacyLevel', arr)
                  )
                }
                className="mb-2"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Languages */}
        <Accordion.Item eventKey="4" className="border rounded mb-2">
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100 me-3">
              <span className="fw-semibold">Languages</span>
              {getActiveCount(filters.languages) > 0 && (
                <Badge bg="primary" className="ms-2">
                  {getActiveCount(filters.languages)}
                </Badge>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body className="pt-2">
            {languages.map(lang => (
              <Form.Check
                key={lang}
                type="checkbox"
                label={lang}
                checked={filters.languages.includes(lang)}
                onChange={() =>
                  toggleArrayItem(
                    filters.languages,
                    lang,
                    arr => onFilterChange('languages', arr)
                  )
                }
                className="mb-2"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Insurance */}
        <Accordion.Item eventKey="5" className="border rounded mb-2">
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100 me-3">
              <span className="fw-semibold">Insurance</span>
              {getActiveCount(filters.insurance) > 0 && (
                <Badge bg="primary" className="ms-2">
                  {getActiveCount(filters.insurance)}
                </Badge>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body className="pt-2">
            {insuranceOptions.map(ins => (
              <Form.Check
                key={ins}
                type="checkbox"
                label={ins}
                checked={filters.insurance.includes(ins)}
                onChange={() =>
                  toggleArrayItem(
                    filters.insurance,
                    ins,
                    arr => onFilterChange('insurance', arr)
                  )
                }
                className="mb-2"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Anonymous Visits */}
        <Accordion.Item eventKey="6" className="border rounded mb-2">
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100 me-3">
              <span className="fw-semibold">Anonymous Visits</span>
              {filters.allowsAnonymous !== null && (
                <Badge bg="primary" className="ms-2">
                  {filters.allowsAnonymous ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body className="pt-2">
            <Form.Select
              value={
                filters.allowsAnonymous === null
                  ? 'any'
                  : filters.allowsAnonymous
                  ? 'yes'
                  : 'no'
              }
              onChange={e =>
                onFilterChange(
                  'allowsAnonymous',
                  e.target.value === 'any'
                    ? null
                    : e.target.value === 'yes'
                )
              }
            >
              <option value="any">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Select>
          </Accordion.Body>
        </Accordion.Item>

        {/* Telehealth */}
        <Accordion.Item eventKey="7" className="border rounded mb-2">
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100 me-3">
              <span className="fw-semibold">Telehealth</span>
              {filters.telehealth !== null && (
                <Badge bg="primary" className="ms-2">
                  {filters.telehealth ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>
          </Accordion.Header>
          <Accordion.Body className="pt-2">
            <Form.Select
              value={
                filters.telehealth === null
                  ? 'any'
                  : filters.telehealth
                  ? 'yes'
                  : 'no'
              }
              onChange={e =>
                onFilterChange(
                  'telehealth',
                  e.target.value === 'any'
                    ? null
                    : e.target.value === 'yes'
                )
              }
            >
              <option value="any">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Select>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

