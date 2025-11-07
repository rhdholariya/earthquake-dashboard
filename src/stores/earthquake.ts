import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export interface Earthquake {
  id: string;
  place: string;
  magnitude: number;
  time: number;
  depth: number;
  longitude: number;
  latitude: number;
}

export interface EarthquakeFilters {
  magnitudeMin: number;
  magnitudeMax: number;
  locationText: string;
}

const STORAGE_KEY = 'earthquake-filters';

const loadFiltersFromStorage = (): EarthquakeFilters => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load filters from localStorage:', error);
  }
  return {
    magnitudeMin: -2,
    magnitudeMax: 10,
    locationText: ''
  };
};

const saveFiltersToStorage = (filters: EarthquakeFilters) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.warn('Failed to save filters to localStorage:', error);
  }
};

export const useEarthquakeStore = defineStore('earthquake', () => {
  const earthquakes = ref<Earthquake[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const filters = ref<EarthquakeFilters>(loadFiltersFromStorage());

  const filteredEarthquakes = computed(() => {
    return earthquakes.value.filter(earthquake => {
      const magnitudeMatch = earthquake.magnitude >= filters.value.magnitudeMin && 
                            earthquake.magnitude <= filters.value.magnitudeMax;
      const locationMatch = !filters.value.locationText || 
                           earthquake.place.toLowerCase().includes(filters.value.locationText.toLowerCase());
      return magnitudeMatch && locationMatch;
    });
  });

  const fetchEarthquakes = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
      
      interface FeatureType {
        id: string;
        properties: {
          place?: string;
          mag?: number;
          time: number;
        };
        geometry: {
          coordinates: [number, number, number];
        };
      }
      
      earthquakes.value = response.data.features.map((feature: FeatureType) => ({
        id: feature.id,
        place: feature.properties.place || 'Unknown location',
        magnitude: feature.properties.mag || 0,
        time: feature.properties.time,
        depth: feature.geometry.coordinates[2] ?? 0,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1]
      }));
    } catch (err) {
      error.value = 'Failed to fetch earthquake data';
      console.error('Error fetching earthquakes:', err);
    } finally {
      loading.value = false;
    }
  };

  const updateFilters = (newFilters: Partial<EarthquakeFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
    saveFiltersToStorage(filters.value);
  };

  return {
    earthquakes,
    filteredEarthquakes,
    loading,
    error,
    filters,
    fetchEarthquakes,
    updateFilters
  };
});