import { ClinicFilters } from '../hooks/useClinicFilters';

interface FilterPanelProps {
  filters: ClinicFilters;
  onToggleType: (type: string) => void;
  onToggleSpecialty: (specialty: string) => void;
  onUpdateFilter: <K extends keyof ClinicFilters>(
    key: K,
    value: ClinicFilters[K]
  ) => void;
}

const CLINIC_TYPES = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'outpatient', label: 'Outpatient' },
  { value: 'specialized', label: 'Specialized Program' },
  { value: 'urgent_care', label: 'Urgent Care' }
];

const SPECIALTIES = [
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'cbt', label: 'CBT' },
  { value: 'trauma', label: 'Trauma' },
  { value: 'medication', label: 'Medication' },
  { value: 'family', label: 'Family / Couples' }
];

export function FilterPanel({
  filters,
  onToggleType,
  onToggleSpecialty,
  onUpdateFilter
}: FilterPanelProps) {
  return (
    <div className="filter-panel p-3 h-100 overflow-auto">
      <h3 className="h5 mb-3">Filters</h3>

      {/* Maximum Distance Slider */}
      <div className="mb-4">
        <label htmlFor="max-distance" className="form-label">
          Maximum Distance: <strong>{filters.maxDistance} km</strong>
        </label>
        <input
          type="range"
          className="form-range"
          id="max-distance"
          min="1"
          max="20"
          step="1"
          value={filters.maxDistance}
          onChange={(e) =>
            onUpdateFilter('maxDistance', parseInt(e.target.value))
          }
        />
        <div className="form-text">Adjust to filter clinics by distance</div>
      </div>

      {/* Clinic Type Filters */}
      <div className="mb-4">
        <h5 className="h6 mb-2">Clinic Type</h5>
        <div className="form-check-group">
          {CLINIC_TYPES.map((type) => (
            <div className="form-check" key={type.value}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`type-${type.value}`}
                checked={filters.types.includes(type.value)}
                onChange={() => onToggleType(type.value)}
              />
              <label
                className="form-check-label"
                htmlFor={`type-${type.value}`}
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty Filters */}
      <div className="mb-4">
        <h5 className="h6 mb-2">Focus / Specialty</h5>
        <div className="form-check-group">
          {SPECIALTIES.map((specialty) => (
            <div className="form-check" key={specialty.value}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`specialty-${specialty.value}`}
                checked={filters.specialties.includes(specialty.value)}
                onChange={() => onToggleSpecialty(specialty.value)}
              />
              <label
                className="form-check-label"
                htmlFor={`specialty-${specialty.value}`}
              >
                {specialty.label}
              </label>
            </div>
          ))}
        </div>
        <div className="form-text small text-muted">
          If none selected, all specialties are shown.
        </div>
      </div>

      {/* Availability Filters */}
      <div className="mb-4">
        <h5 className="h6 mb-2">Availability</h5>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="filter-online"
            checked={filters.online === true}
            onChange={(e) =>
              onUpdateFilter('online', e.target.checked ? true : null)
            }
          />
          <label className="form-check-label" htmlFor="filter-online">
            Offers online / telehealth
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="filter-multilingual"
            checked={filters.multilingual === true}
            onChange={(e) =>
              onUpdateFilter('multilingual', e.target.checked ? true : null)
            }
          />
          <label className="form-check-label" htmlFor="filter-multilingual">
            Multilingual support
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="filter-accepts-undiagnosed"
            checked={filters.acceptsUndiagnosed === true}
            onChange={(e) =>
              onUpdateFilter(
                'acceptsUndiagnosed',
                e.target.checked ? true : null
              )
            }
          />
          <label
            className="form-check-label"
            htmlFor="filter-accepts-undiagnosed"
          >
            Accepts undiagnosed / self-referred
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="filter-no-guardian"
            checked={filters.noGuardianRequired === true}
            onChange={(e) =>
              onUpdateFilter(
                'noGuardianRequired',
                e.target.checked ? true : null
              )
            }
          />
          <label className="form-check-label" htmlFor="filter-no-guardian">
            No guardian / family requirement
          </label>
        </div>
      </div>
    </div>
  );
}

