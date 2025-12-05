import { Navbar, Button } from 'react-bootstrap';

interface HeaderProps {
  onLocateMe: () => void;
  isLocating: boolean;
}

export default function Header({ onLocateMe, isLocating }: HeaderProps) {
  return (
    <Navbar bg="primary" variant="dark" className="px-3 py-2">
      <Navbar.Brand className="fw-bold">
        Mental‑Health Accessibility Map
      </Navbar.Brand>
      <div className="ms-auto">
        <Button
          variant="light"
          onClick={onLocateMe}
          disabled={isLocating}
        >
          {isLocating ? 'Locating...' : '📍 Locate Me'}
        </Button>
      </div>
    </Navbar>
  );
}

