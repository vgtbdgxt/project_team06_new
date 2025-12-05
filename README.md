# Mental Health Clinic Accessibility Dashboard

A comprehensive web application for visualizing and accessing mental health clinics in Los Angeles, with advanced route planning that considers psychological comfort and environmental factors.

## Goal

This dashboard helps users find mental health clinics based on multiple criteria, including distance, treatment focus, privacy requirements, and insurance options. The unique feature is the route recommendation system that considers not just travel time, but also psychological comfort factors like green spaces, crowd density, noise levels, and air quality.

## Features

### Core Map Layer
- **User Location**: Automatically detects user's current location (with fallback to downtown LA)
- **Clinic Markers**: Displays clinics with different icons for:
  - 🏥 Hospital
  - 🩺 Outpatient clinic
  - 🧠 Specialized program
  - 🚨 Urgent care
- **Clinic Details Panel**: Comprehensive information including address, phone, hours, treatment focus, insurance, languages, and privacy features

### Multi-Dimensional Filtering
Filter clinics by:
- Clinic type
- Treatment focus (CBT, medication, trauma, etc.)
- Maximum distance (with soft exclusion - clinics beyond limit are faded but visible)
- Privacy level (anonymous, guardian-not-required, standard)
- Supported languages
- Insurance options
- Anonymous visits support
- Telehealth availability

### Environmental & Psychological Burden Layers
- **Green Spaces**: Tree icons showing parks and green corridors (🌳)
- **Crowd Density**: Person glyphs indicating high crowd areas (👤)
- **Air Quality (AQI)**: Toggleable heatmap showing pollution levels
- **Noise Level**: Toggleable circles showing noisy hotspots

### Route Recommendation System
Three route types for each clinic:
1. **Fastest Route** (Blue): Minimizes travel time
2. **Low-Stress Route** (Green): Minimizes psychological burden, prefers green spaces, avoids crowds/noise
3. **Balanced Route** (Purple): Compromise between time and comfort

Features:
- Travel mode selection (walking, driving, transit, rideshare)
- Psychological sensitivity sliders (crowd avoidance, noise avoidance, green space preference, pollution avoidance, heat avoidance)
- Route segments color-coded by local environment
- Predicted clinic load at arrival time
- Route burden summary with breakdown of environmental factors

### Additional Features
- **Clinic Comparison View**: Side-by-side comparison of multiple clinics
- **Route Burden Summary**: Visual breakdown of environmental factors along selected route
- **Coordinated Multiple Views**: Map, clinic list, and detail panel share selection and filter state

## How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   The app will be available at `http://localhost:5173` (or the port shown in terminal)

4. **Build for Production** (optional)
   ```bash
   npm run build
   ```

## Technology Stack

- **Vite**: Fast build tool and dev server
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Leaflet + react-leaflet**: Interactive mapping
- **Bootstrap 5 + React Bootstrap**: UI components and styling

## Project Structure

```
src/
  components/
    MapView.tsx              # Main map component with Leaflet
    FiltersPanel.tsx         # Left sidebar with all filters
    ClinicList.tsx           # Right sidebar clinic list
    ClinicDetails.tsx        # Detailed clinic information panel
    RouteOptionsPanel.tsx    # Route selection and preferences
    RouteBurdenSummary.tsx   # Route analysis visualization
    LayerToggles.tsx         # Environmental layer controls
    ClinicComparison.tsx     # Comparison table view
  hooks/
    useUserLocation.ts       # Geolocation hook
    useFilters.ts            # Filter state management
    useRoutes.ts             # Route generation and selection
  data/
    types.ts                 # TypeScript type definitions
    clinics.ts               # Mock clinic data (15 clinics in LA)
    greenSpaces.ts           # Mock green space locations
    crowds.ts                # Mock crowd hotspot data
    environment.ts           # AQI, noise, and clinic load predictions
  utils/
    distance.ts              # Haversine distance calculation
    burden.ts                # Psychological burden scoring
    mockRouting.ts           # Mock route generation
  App.tsx                    # Main application component
  main.tsx                   # Application entry point
```

## Visualization Design

### Clinic Markers
- Different emoji icons for each clinic type (no distance-based coloring)
- Soft exclusion: clinics beyond max distance shown at 40% opacity
- Click markers to view details

### Environmental Layers
- **Green Spaces**: Tree icons with size representing relative density
- **Crowd Density**: Person icons with size representing density level
- **AQI Heatmap**: Semi-transparent colored circles (green/yellow/red)
- **Noise Circles**: Orange semi-transparent circles around noisy areas

### Routes
- Color-coded polylines: Blue (fastest), Green (low-stress), Purple (balanced)
- Segment-level encoding: Route segments adjust color based on local environment
- Route selection updates map display

### Filtering & Interaction
- Coordinated multiple views: Changes in filters update map, list, and details simultaneously
- Real-time distance calculation
- Clinic list sorted by distance
- Comparison view toggle

## Mock Data

The application uses mock data for demonstration:
- 15 mental health clinics across Los Angeles
- 10 green space locations
- 8 crowd hotspots
- Grid-based environment data (AQI and noise)
- Time-based clinic load predictions (24-hour patterns)

All data is hardcoded in the `/src/data/` directory and can be easily modified or replaced with real API data.

## Notes

- Routing is mocked but generates plausible routes based on route type preferences
- Environmental data uses a grid-based approximation
- Clinic load predictions are simple time-based models
- No real API keys required - all data is local
- Optimized for Los Angeles area coordinates

## Future Enhancements

- Integration with real routing APIs (Google Maps, Mapbox)
- Real-time traffic and crowd data
- User preference persistence (localStorage)
- More sophisticated burden scoring algorithms
- Real-time clinic availability
- Multi-stop route planning

