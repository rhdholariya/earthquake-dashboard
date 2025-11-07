<template>
  <div class="filters-container">
    <!-- Header Section -->
    <div class="filters-header">
      <div class="header-left">
        <q-icon name="tune" class="header-icon" />
        <div class="header-text">
          <h3 class="header-title">Filters</h3>
          <span class="header-subtitle">{{ filteredCount }} of {{ totalCount }} earthquakes ({{ minMagnitude }} to {{ maxMagnitude }})</span>
        </div>
      </div>
      <div class="header-actions">
        <q-btn
          flat
          dense
          color="grey-6"
          icon="refresh"
          @click="resetFilters"
          class="header-btn"
          size="sm"
        >
          <q-tooltip>Reset all filters</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          color="primary"
          icon="sync"
          :loading="loading"
          @click="refreshData"
          class="header-btn"
          size="sm"
        >
          <q-tooltip>Refresh data</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Filters Content -->
    <div class="filters-body">
      <div class="filters-grid">
        <div class="filter-section">
          <label class="filter-label">
            <q-icon name="place" class="label-icon" />
            Location
          </label>
          <q-input
            v-model="localFilters.locationText"
            placeholder="Search by location..."
            outlined
            dense
            class="filter-input"
            @update:model-value="updateFilters"
          >
            <template v-slot:append v-if="localFilters.locationText">
              <q-btn
                flat
                dense
                round
                icon="clear"
                @click="clearLocationFilter"
                size="xs"
                class="clear-btn"
              />
            </template>
          </q-input>
        </div>

        <div class="filter-section">
          <label class="filter-label">
            <q-icon name="speed" class="label-icon" />
            Magnitude Range
          </label>
          <div class="magnitude-filter">
            <div class="range-inputs">
              <q-input
                v-model.number="magnitudeRange.min"
                type="number"
                outlined
                dense
                :min="minMagnitude"
                :max="maxMagnitude"
                :step="0.5"
                @update:model-value="updateMagnitudeRange"
                class="range-input"
                label="Min"
              />
              <span class="range-separator">to</span>
              <q-input
                v-model.number="magnitudeRange.max"
                type="number"
                outlined
                dense
                :min="minMagnitude"
                :max="maxMagnitude"
                :step="0.5"
                @update:model-value="updateMagnitudeRange"
                class="range-input"
                label="Max"
              />
            </div>
            <q-range
              v-model="magnitudeRange"
              :min="minMagnitude"
              :max="maxMagnitude"
              :step="0.5"
              color="primary"
              @update:model-value="updateMagnitudeRange"
              class="magnitude-slider"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div v-if="filteredCount !== totalCount" class="results-bar">
      <div class="results-info">
        <q-icon name="filter_list" class="results-icon" />
        <span class="results-text">
          Filtered: {{ filteredCount }} results ({{ ((filteredCount / totalCount) * 100).toFixed(0) }}%)
        </span>
      </div>
      <q-btn
        flat
        dense
        color="grey-6"
        label="Clear"
        icon="clear_all"
        @click="resetFilters"
        size="xs"
        class="clear-all-btn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useEarthquakeStore } from '../stores/earthquake';

const earthquakeStore = useEarthquakeStore();

const localFilters = ref({
  locationText: earthquakeStore.filters.locationText
});

const magnitudeRange = ref({
  min: earthquakeStore.filters.magnitudeMin,
  max: earthquakeStore.filters.magnitudeMax
});

const loading = computed(() => earthquakeStore.loading);
const totalCount = computed(() => earthquakeStore.earthquakes.length);
const filteredCount = computed(() => earthquakeStore.filteredEarthquakes.length);

// Calculate dynamic min and max magnitude from API data, rounding to nearest 0.5
const minMagnitude = computed(() => {
  if (earthquakeStore.earthquakes.length === 0) return -2; // Default fallback
  const min = Math.min(...earthquakeStore.earthquakes.map(eq => eq.magnitude));
  return Math.floor(min * 2) / 2; // Round down to nearest 0.5, allow negative values
});

const maxMagnitude = computed(() => {
  if (earthquakeStore.earthquakes.length === 0) return 10; // Default fallback
  const max = Math.max(...earthquakeStore.earthquakes.map(eq => eq.magnitude));
  const roundedMax = Math.ceil(max * 2) / 2; // Round up to nearest 0.5
  return Math.max(10, roundedMax); // Use whichever is bigger: 10 or API max
});

// Watch for changes in store filters and update local state
watch(() => earthquakeStore.filters, (newFilters) => {
  localFilters.value.locationText = newFilters.locationText;
  magnitudeRange.value.min = newFilters.magnitudeMin;
  magnitudeRange.value.max = newFilters.magnitudeMax;
}, { deep: true });

// Watch for changes in earthquake data to update magnitude range
watch(() => earthquakeStore.earthquakes, (newEarthquakes) => {
  if (newEarthquakes.length > 0) {
    const newMin = minMagnitude.value;
    const newMax = maxMagnitude.value;
    
    // Only update if current values are still defaults AND no localStorage data exists
    const hasStoredFilters = localStorage.getItem('earthquake-filters');
    if (!hasStoredFilters && magnitudeRange.value.min === -2 && magnitudeRange.value.max === 10) {
      magnitudeRange.value = { min: newMin, max: newMax };
      earthquakeStore.updateFilters({
        magnitudeMin: newMin,
        magnitudeMax: newMax
      });
    }
  }
}, { deep: true });

const updateFilters = () => {
  earthquakeStore.updateFilters({
    locationText: localFilters.value.locationText
  });
};

const updateMagnitudeRange = () => {
  earthquakeStore.updateFilters({
    magnitudeMin: magnitudeRange.value.min,
    magnitudeMax: magnitudeRange.value.max
  });
};

const resetFilters = () => {
  // Clear localStorage when resetting
  localStorage.removeItem('earthquake-filters');
  
  localFilters.value.locationText = '';
  magnitudeRange.value = { min: minMagnitude.value, max: maxMagnitude.value };
  earthquakeStore.updateFilters({
    locationText: '',
    magnitudeMin: minMagnitude.value,
    magnitudeMax: maxMagnitude.value
  });
};

const clearLocationFilter = () => {
  localFilters.value.locationText = '';
  updateFilters();
};

const refreshData = () => {
  void earthquakeStore.fetchEarthquakes();
};

// Initialize magnitude range when component mounts
onMounted(() => {
  // Only auto-update magnitude range if no stored filters exist
  const hasStoredFilters = localStorage.getItem('earthquake-filters');
  if (!hasStoredFilters && earthquakeStore.earthquakes.length > 0) {
    const newMin = minMagnitude.value;
    const newMax = maxMagnitude.value;
    
    magnitudeRange.value = { min: newMin, max: newMax };
    earthquakeStore.updateFilters({
      magnitudeMin: newMin,
      magnitudeMax: newMax
    });
  }
});
</script>


<style scoped>
.filters-container {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Header Section */
.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: var(--primary-600);
  font-size: 1.125rem;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
  line-height: 1;
}

.header-subtitle {
  font-size: 0.75rem;
  color: var(--gray-600);
  font-weight: 400;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-btn {
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.header-btn:hover {
  background-color: var(--gray-100);
}

/* Filters Body */
.filters-body {
  padding: 16px;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.label-icon {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.filter-input {
  transition: all 0.2s ease;
}

.filter-input:focus-within {
  transform: translateY(-1px);
}

.clear-btn {
  color: var(--gray-400);
}

.clear-btn:hover {
  color: var(--gray-600);
  background-color: var(--gray-100);
}

/* Magnitude Filter */
.magnitude-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input {
  flex: 1;
  min-width: 0;
}

.range-separator {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-weight: 500;
  padding: 0 4px;
}

.magnitude-slider {
  margin: 8px 0 4px 0;
}

/* Results Bar */
.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--primary-50);
  border-top: 1px solid var(--primary-200);
}

.results-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.results-icon {
  font-size: 0.875rem;
  color: var(--primary-600);
}

.results-text {
  font-size: 0.75rem;
  color: var(--primary-700);
  font-weight: 500;
}

.clear-all-btn {
  font-size: 0.6875rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  padding: 2px 8px;
}

.clear-all-btn:hover {
  background-color: var(--gray-100);
}

/* Responsive Design */
@media (max-width: 768px) {
  .filters-header {
    padding: 10px 12px;
  }
  
  .filters-body {
    padding: 12px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .range-inputs {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
  
  .range-separator {
    text-align: center;
    padding: 4px 0;
  }
  
  .results-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    text-align: center;
  }
  
  .results-info {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-left {
    gap: 8px;
  }
  
  .header-title {
    font-size: 0.8125rem;
  }
  
  .header-subtitle {
    font-size: 0.6875rem;
  }
  
  .header-actions {
    gap: 2px;
  }
}
</style>