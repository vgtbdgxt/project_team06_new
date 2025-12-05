import { Form } from 'react-bootstrap';

interface LayerTogglesProps {
  showGreenSpaces: boolean;
  showCrowds: boolean;
  showAQI: boolean;
  showNoise: boolean;
  onToggleGreenSpaces: () => void;
  onToggleCrowds: () => void;
  onToggleAQI: () => void;
  onToggleNoise: () => void;
}

export default function LayerToggles({
  showGreenSpaces,
  showCrowds,
  showAQI,
  showNoise,
  onToggleGreenSpaces,
  onToggleCrowds,
  onToggleAQI,
  onToggleNoise,
}: LayerTogglesProps) {
  return (
    <div
      className="position-fixed top-0 end-0 bg-white shadow-lg p-3"
      style={{ zIndex: 1000, minWidth: '200px' }}
    >
      <h6 className="mb-3">Map Layers</h6>
      <Form.Check
        type="switch"
        label="🌳 Green Spaces"
        checked={showGreenSpaces}
        onChange={onToggleGreenSpaces}
        className="mb-2"
      />
      <Form.Check
        type="switch"
        label="👤 Crowd Density"
        checked={showCrowds}
        onChange={onToggleCrowds}
        className="mb-2"
      />
      <Form.Check
        type="switch"
        label="🌬️ Air Quality (AQI)"
        checked={showAQI}
        onChange={onToggleAQI}
        className="mb-2"
      />
      <Form.Check
        type="switch"
        label="🔊 Noise Level"
        checked={showNoise}
        onChange={onToggleNoise}
        className="mb-2"
      />
    </div>
  );
}

