[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mePQERSv)

# Mental Health Clinic Accessibility Dashboard

A comprehensive interactive visualization system for exploring and filtering mental health clinic accessibility in urban environments. This project was developed as the final project for DSCI 554 (Data Visualization) at USC.

## 📋 Table of Contents

- [Purpose](#purpose)
- [Contributions](#contributions)
- [Methodology](#methodology)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Dataset](#dataset)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Work](#future-work)
- [Limitations](#limitations)
- [License](#license)

## 🎯 Purpose

Mental health accessibility is a critical public health issue, with significant disparities in access to care across different communities. This dashboard addresses the need for transparent, user-friendly tools that help individuals:

- **Discover nearby mental health clinics** based on geographic proximity
- **Filter clinics** by type, specialization, and accessibility features
- **Understand clinic characteristics** including wait times, cost models, and available services
- **Make informed decisions** about mental health care access

The system demonstrates how interactive data visualization can bridge information gaps and empower users to navigate complex healthcare systems more effectively.

## ✨ Contributions

This project contributes to the field of health data visualization through:

1. **Map-Centered Design**: Implements a spatial-first visualization approach that prioritizes geographic context, recognizing that physical accessibility is a primary concern for mental health care seekers.

2. **Multi-Dimensional Filtering**: Enables simultaneous filtering across clinic types, specializations, distance, and accessibility features (online services, multilingual support, etc.), supporting diverse user needs.

3. **Distance-Based Visual Encoding**: Uses dynamic color encoding to represent clinic proximity, making spatial relationships immediately apparent without requiring explicit distance calculations.

4. **Accessibility-Focused Metadata**: Emphasizes accessibility features (self-referral acceptance, guardian requirements, multilingual support) that are critical for marginalized populations but often omitted from standard clinic directories.

5. **Real-Time Interaction**: Provides immediate visual feedback as filters are adjusted, supporting exploratory data analysis and iterative refinement of search criteria.

## 🔬 Methodology

### Data Collection & Preparation

The system uses a mock dataset of 18 mental health clinics in the Los Angeles metropolitan area. Each clinic record includes:

- **Geographic coordinates** (latitude/longitude)
- **Clinic type** (hospital, outpatient, specialized program, urgent care)
- **Contact information** (address, phone, email)
- **Operating hours and appointment procedures**
- **Clinical focus areas** (anxiety, depression, CBT, trauma, medication, family therapy)
- **Accessibility features** (online consultation, multilingual support, accepts undiagnosed patients, no guardian requirement)
- **Operational metadata** (wait times, cost models)

In a production deployment, this data would be sourced from:
- Public health department registries
- SAMHSA (Substance Abuse and Mental Health Services Administration) treatment locators
- State licensing boards
- Community health organization databases

### Visualization Pipeline

1. **Spatial Mapping**: Clinics are geocoded and rendered as markers on a Leaflet map using OpenStreetMap tiles.

2. **Distance Calculation**: Haversine formula computes great-circle distances between user location and clinic coordinates.

3. **Color Encoding**: Distance-based color scale assigns visual properties:
   - **Dark blue**: Very close (≤25% of max distance)
   - **Medium blue**: Close (25-50%)
   - **Light blue**: Medium (50-75%)
   - **Grey**: Far (>75%)

4. **Filtering Logic**: Multi-dimensional filtering applies constraints sequentially:
   - Type filters (set-based inclusion)
   - Specialty filters (set-based intersection)
   - Distance filter (numeric threshold)
   - Availability filters (boolean matching)

5. **Interaction Flow**: User interactions trigger state updates that propagate through the component hierarchy, updating map markers, detail panels, and filter counts in real-time.

### Design Rationale

- **Map-Centered Layout**: Prioritizes spatial understanding, as physical accessibility is often the primary barrier to care.
- **Sidebar Filters**: Keeps filter controls visible and accessible without obscuring the map.
- **Detail Panel**: Provides comprehensive clinic information on demand, reducing cognitive load on the main visualization.
- **Responsive Design**: Bootstrap grid system ensures usability across desktop and tablet devices.

## 🏗️ System Architecture

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Mapping Library**: Leaflet 1.9.4 with react-leaflet 4.2
- **UI Framework**: Bootstrap 5.3
- **Styling**: CSS3 with custom component styles

### Component Structure

```
src/
├── components/
│   ├── MapView.tsx          # Leaflet map with clinic markers
│   ├── FilterPanel.tsx      # Left sidebar with all filter controls
│   └── ClinicDetails.tsx    # Right sidebar with clinic information
├── hooks/
│   ├── useUserLocation.ts   # Geolocation API integration
│   └── useClinicFilters.ts  # Filter state management and logic
├── data/
│   └── clinics.ts           # Mock dataset (18 clinics)
├── utils/
│   ├── distance.ts          # Haversine distance calculation
│   └── colorScale.ts        # Distance-based color encoding
├── App.tsx                  # Main application component
├── main.tsx                 # React entry point
└── App.css                  # Component-specific styles
```

### State Management

The application uses React hooks for state management:

- **`useUserLocation`**: Manages geolocation API calls and user position state
- **`useClinicFilters`**: Handles filter state and computed filtered clinic list
- **Local state in App.tsx**: Manages selected clinic for detail panel

### Data Flow

```
User Interaction
    ↓
FilterPanel/MapView
    ↓
State Update (filters, selectedClinic)
    ↓
useClinicFilters Hook (recomputes filteredClinics)
    ↓
MapView Re-renders (updates markers)
ClinicDetails Re-renders (updates content)
```

## 🎨 Features

### Core Functionality

1. **Interactive Map**
   - Zoom and pan controls
   - Clinic markers with distance-based color encoding
   - User location marker (when permission granted)
   - Click markers to view clinic details

2. **Comprehensive Filtering**
   - **Clinic Type**: Hospital, Outpatient, Specialized Program, Urgent Care
   - **Specialties**: Anxiety, Depression, CBT, Trauma, Medication, Family/Couples
   - **Maximum Distance**: Slider (1-20 km) with real-time filtering
   - **Availability**: Online services, Multilingual support, Accepts undiagnosed, No guardian required

3. **Clinic Details Panel**
   - Full contact information
   - Operating hours and appointment procedures
   - Clinical focus areas
   - Accessibility features
   - Cost model and estimated wait times
   - Distance from user location

4. **User Location**
   - "Locate Me" button requests geolocation permission
   - User location displayed as red marker
   - Distance calculations from user to clinics
   - Map automatically centers on user location

## 📊 Dataset

The mock dataset includes **18 mental health clinics** distributed across the Los Angeles metropolitan area. Each clinic record contains:

### Attributes

- **Geographic**: `lat`, `lon` (coordinates)
- **Identity**: `name`, `type`, `address`
- **Contact**: `phone`, `email`
- **Operations**: `hours`, `appointment` (instructions)
- **Clinical**: `focus` (array of specialties)
- **Accessibility**: `online`, `multilingual`, `acceptsUndiagnosed`, `noGuardianRequired`
- **Metadata**: `waitTimeDays`, `costModel`

### Clinic Types Distribution

- **Outpatient**: 7 clinics
- **Specialized**: 6 clinics
- **Hospital**: 2 clinics
- **Urgent Care**: 2 clinics

### Real-World Data Sources

In production, this system would integrate with:

- **SAMHSA Treatment Locator**: National database of mental health and substance use treatment facilities
- **State Health Department Registries**: Licensed mental health providers
- **Community Health Center Directories**: Federally qualified health centers
- **Hospital Systems**: Emergency and inpatient mental health services

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser with geolocation support

### Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mental-accessibility
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

## 💻 Usage

### Basic Workflow

1. **View the map**: The dashboard opens with all clinics displayed as colored markers
2. **Locate yourself**: Click "📍 Locate Me" to enable distance-based filtering
3. **Adjust filters**: Use the left sidebar to filter by type, specialty, distance, and availability
4. **Explore clinics**: Click markers to view detailed information in the right panel
5. **Refine search**: Adjust filters iteratively to find clinics matching your needs

### Filter Strategies

- **Distance-first**: Set maximum distance, then filter by type/specialty
- **Specialty-first**: Select required specialties, then adjust distance
- **Accessibility-first**: Enable accessibility filters, then explore options

## 🌐 Deployment

### GitHub Pages Deployment

This project is configured for deployment on GitHub Pages using Vite's base path configuration.

#### Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Install GitHub Pages deployment plugin** (optional, for automation):
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deployment script to `package.json`**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. **Configure GitHub repository**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (or `main` with `/docs` folder)
   - Folder: `/root` (or `/docs` if using docs folder)

5. **Update `vite.config.ts` base path** (if repository name differs):
   ```typescript
   base: '/your-repo-name/'
   ```

6. **Deploy**:
   ```bash
   npm run deploy
   ```

#### Manual Deployment

1. Build the project: `npm run build`
2. Copy contents of `dist/` folder to your web server
3. Ensure server supports client-side routing (SPA)

### Environment Variables

No environment variables are required for basic functionality. For production deployments with API integrations, configure:

- `VITE_API_ENDPOINT`: Backend API URL (if applicable)
- `VITE_MAP_TILE_URL`: Custom map tile provider (optional)

## 📸 Screenshots

### Dashboard Overview
![Dashboard Overview](screenshots/dashboard-overview.png)
*Main dashboard showing map with clinic markers, filter panel, and detail panel*

### Filtered View
![Filtered View](screenshots/filtered-view.png)
*Map showing filtered clinics based on selected criteria*

### Clinic Details
![Clinic Details](screenshots/clinic-details.png)
*Detailed clinic information panel with contact, hours, and accessibility features*

### Mobile View
![Mobile View](screenshots/mobile-view.png)
*Responsive layout on mobile devices*

> **Note**: Screenshots should be added to the `screenshots/` directory. Placeholder filenames are provided above.

## 🔮 Future Work

### Data Integration

- **Real-time API Integration**: Connect to SAMHSA or state health department APIs
- **Dynamic Data Updates**: Automatic refresh of clinic availability and wait times
- **User-Generated Content**: Allow users to submit clinic reviews and updates

### Enhanced Features

- **Route Planning**: Integration with mapping services for directions
- **Appointment Booking**: Direct integration with clinic scheduling systems
- **Multi-Language Interface**: Full internationalization support
- **Accessibility Audit**: WCAG 2.1 AA compliance improvements
- **Offline Support**: Service worker for offline map viewing

### Advanced Visualizations

- **Heat Maps**: Density visualization of clinic distribution
- **Time-Series Analysis**: Historical trends in clinic availability
- **Comparative Analysis**: Side-by-side clinic comparison tool
- **Network Analysis**: Visualization of referral networks

### Research Extensions

- **User Studies**: Conduct usability testing with mental health care seekers
- **Impact Assessment**: Measure system effectiveness in improving care access
- **Accessibility Metrics**: Develop quantitative measures of clinic accessibility
- **Policy Analysis**: Visualize impact of policy changes on clinic distribution

## ⚠️ Limitations

### Current Limitations

1. **Mock Data**: The system uses synthetic data and does not reflect real clinic locations or availability
2. **Static Information**: Clinic details (wait times, availability) are not updated in real-time
3. **Limited Geographic Coverage**: Dataset covers only Los Angeles area
4. **No Authentication**: No user accounts or personalized features
5. **Browser Compatibility**: Requires modern browser with geolocation API support
6. **No Mobile App**: Web-only interface, no native mobile application

### Technical Constraints

- **Map Tile Dependency**: Relies on OpenStreetMap tiles (may have usage limits)
- **Geolocation Accuracy**: Dependent on device GPS accuracy
- **Client-Side Processing**: All filtering and distance calculations performed in browser
- **No Backend**: Fully client-side application, no server-side data processing

### Data Quality Considerations

- **Completeness**: Real-world data may have missing or outdated information
- **Verification**: Clinic information requires regular verification and updates
- **Privacy**: User location data is processed client-side only (no server transmission)

## 📄 License

This project is developed for academic purposes as part of DSCI 554 (Data Visualization) coursework at USC.

## 🙏 Acknowledgments

- **Leaflet**: Open-source mapping library
- **React Leaflet**: React bindings for Leaflet
- **Bootstrap**: UI framework
- **OpenStreetMap**: Map tile provider
- **USC DSCI 554**: Course instructors and teaching staff

---

**Author**: [Your Name]  
**Course**: DSCI 554 - Data Visualization  
**Institution**: University of Southern California  
**Year**: 2025
