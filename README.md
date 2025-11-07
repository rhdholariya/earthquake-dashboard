# Earthquake Dashboard

A real-time earthquake monitoring dashboard displaying global seismic activity from the USGS API.

## How to Run

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npx quasar dev
```

Open your browser and navigate to `http://localhost:9000`

## Tech Specifications

### Core Technologies
- **Vue 3** - Composition API with `<script setup>`
- **Quasar Framework v2.18.5** - UI components and responsive layout
- **TypeScript** - Strict mode for type safety
- **Vite** - Fast build tool and development server

### State & Data Management
- **Pinia** - Modern state management
- **Axios** - HTTP client for API requests
- **USGS Earthquake API** - Real-time seismic data source

### Visualization & Mapping
- **Apache ECharts** - Interactive timeline charts
- **OpenLayers** - Interactive world map with markers
- **vue-echarts** - Vue 3 ECharts integration

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **SCSS** - Enhanced CSS with custom properties
- **Vite Plugin Checker** - TypeScript and ESLint integration

## Features

- **Real-time Data**: Live earthquake data from past 7 days
- **Dynamic Filters**: Location search and adaptive magnitude range
- **Multiple Views**: Data table, timeline chart, and interactive map
- **Professional UI**: Clean, responsive design
- **Type Safety**: Full TypeScript implementation

## Additional Commands

```bash
# Build for production
npx quasar build

# Lint code
npm run lint

# Format code
npm run format
```

## Data Source

**USGS Earthquake API**: Real-time earthquake data from the past 7 days
- Endpoint: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`
- Coverage: Global seismic activity
- Updates: Real-time