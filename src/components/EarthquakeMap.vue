<template>
  <q-card class="map-card professional-card">
    <q-card-section class="map-header">
      <div class="map-title">
        <q-icon name="public" class="q-mr-sm" />
        Global Map
      </div>
      <div class="map-subtitle">
        Geographic distribution of seismic activity
      </div>
    </q-card-section>
    <q-card-section class="map-content">
      <div v-if="loading" class="map-loading">
        <q-spinner-dots size="50px" color="primary" />
        <div class="loading-text">Loading map data...</div>
      </div>
      
      <div v-else-if="earthquakes.length === 0" class="map-empty">
        <q-icon name="map" size="4rem" color="grey-5" />
        <div class="empty-title">No earthquake data available</div>
        <div class="empty-subtitle">Adjust your filters to see earthquake locations</div>
      </div>
      
      <div v-else class="map-wrapper">
        <ol-map
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          style="height: 500px; width: 100%"
        >
          <ol-view
            ref="view"
            :center="center"
            :zoom="zoom"
            :projection="projection"
          />

          <ol-tile-layer>
            <ol-source-osm />
          </ol-tile-layer>

          <ol-vector-layer>
            <ol-source-vector>
              <ol-feature
                v-for="earthquake in earthquakes"
                :key="earthquake.id"
              >
                <ol-geom-point
                  :coordinates="[earthquake.longitude, earthquake.latitude]"
                />
                <ol-style>
                  <ol-style-circle
                    :radius="getMarkerRadius(earthquake.magnitude)"
                    :fill-color="getMagnitudeColorRgba(earthquake.magnitude)"
                    :stroke-color="'white'"
                    :stroke-width="2"
                  />
                </ol-style>
              </ol-feature>
            </ol-source-vector>
          </ol-vector-layer>

          <ol-interaction-select @select="onFeatureSelect">
            <ol-style>
              <ol-style-circle
                :radius="15"
                :fill-color="'rgba(255, 255, 0, 0.6)'"
                :stroke-color="'yellow'"
                :stroke-width="3"
              />
            </ol-style>
          </ol-interaction-select>

          <ol-overlay
            v-if="selectedEarthquake && popupPosition"
            :position="popupPosition"
            :auto-pan="true"
            :auto-pan-animation="{ duration: 250 }"
          >
            <div class="earthquake-popup">
              <q-card class="popup-card">
                <q-card-section class="popup-header">
                  <div class="popup-title">
                    <q-icon name="place" class="q-mr-xs" color="white" />
                    <span class="title-text">{{ selectedEarthquake.place }}</span>
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    icon="close"
                    size="sm"
                    @click="closePopup"
                    class="close-btn"
                    color="white"
                  />
                </q-card-section>
                <q-card-section class="popup-content">
                  <div class="popup-info">
                    <div class="info-item">
                      <q-icon name="speed" class="info-icon" />
                      <span class="info-label">Magnitude</span>
                      <q-chip
                        :color="getMagnitudeColor(selectedEarthquake.magnitude)"
                        text-color="white"
                        size="sm"
                        :label="selectedEarthquake.magnitude.toFixed(1)"
                        class="magnitude-chip"
                      />
                    </div>
                    <div class="info-item">
                      <q-icon name="height" class="info-icon" />
                      <span class="info-label">Depth</span>
                      <span class="info-value">{{ selectedEarthquake.depth.toFixed(1) }} km</span>
                    </div>
                    <div class="info-item">
                      <q-icon name="schedule" class="info-icon" />
                      <span class="info-label">Time</span>
                      <span class="info-value">{{ formatTime(selectedEarthquake.time) }}</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </ol-overlay>
        </ol-map>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEarthquakeStore, type Earthquake } from '../stores/earthquake';
import { getMagnitudeColor, getMagnitudeColorRgba, getMarkerRadius, formatTime } from '../utils/earthquake-utils';

const earthquakeStore = useEarthquakeStore();

const earthquakes = computed(() => earthquakeStore.filteredEarthquakes);
const loading = computed(() => earthquakeStore.loading);
const selectedEarthquake = ref<Earthquake | null>(null);
const popupPosition = ref<[number, number] | null>(null);

// Map configuration
const center = ref([0, 20]);
const zoom = ref(2);
const projection = ref('EPSG:4326');

const onFeatureSelect = (event: { selected: Array<{ getGeometry: () => { getCoordinates: () => [number, number] } }> }) => {
  if (event.selected.length > 0) {
    const feature = event.selected[0];
    if (feature) {
      const coordinates = feature.getGeometry().getCoordinates();
      
      // Find the earthquake that matches these coordinates
      const earthquake = earthquakes.value.find(eq => 
        Math.abs(eq.longitude - coordinates[0]) < 0.001 && 
        Math.abs(eq.latitude - coordinates[1]) < 0.001
      );
      
      if (earthquake) {
        selectedEarthquake.value = earthquake;
        popupPosition.value = [earthquake.longitude, earthquake.latitude];
      }
    }
  } else {
    closePopup();
  }
};

const closePopup = () => {
  selectedEarthquake.value = null;
  popupPosition.value = null;
};

// Watch for filter changes and close popup if selected earthquake is no longer visible
watch(earthquakes, (newEarthquakes) => {
  if (selectedEarthquake.value) {
    const isStillVisible = newEarthquakes.some(eq => eq.id === selectedEarthquake.value?.id);
    if (!isStillVisible) {
      closePopup();
    }
  }
});
</script>

<style scoped>
.map-card {
  overflow: hidden;
}

.map-header {
  background-color: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  padding: 16px 20px;
}

.map-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.map-subtitle {
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 400;
}

.map-content {
  padding: 0;
  background: rgba(255, 255, 255, 0.95);
}

.map-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  gap: 16px;
  padding: 24px;
}

.loading-text {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.map-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  gap: 16px;
  padding: 24px;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #666;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #999;
}

.map-wrapper {
  height: 500px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 0 16px 16px;
  overflow: hidden;
  position: relative;
}

.earthquake-popup {
  margin-left: -175px;
  margin-top: -140px;
  width: 350px;
  max-width: 90vw;
  pointer-events: auto;
  z-index: 1000;
  filter: drop-shadow(var(--shadow-xl));
}

.popup-card {
  box-shadow: var(--shadow-xl);
  border-radius: var(--radius-xl);
  overflow: hidden;
  backdrop-filter: blur(8px);
  background: var(--surface);
  border: 1px solid var(--gray-200);
}

.popup-header {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup-title {
  font-size: 1rem;
  font-weight: 600;
  color: white !important;
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-right: var(--space-3);
}

.title-text {
  color: white !important;
  font-weight: 600;
}

.close-btn {
  color: white !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--radius-md);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: scale(1.05);
}

.popup-content {
  padding: var(--space-5);
  background-color: var(--surface);
}

.popup-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--gray-100);
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  color: var(--primary-600);
  font-size: 1.125rem;
  width: 20px;
  flex-shrink: 0;
}

.info-label {
  font-weight: 500;
  color: var(--gray-600);
  min-width: 70px;
}

.info-value {
  font-weight: 500;
  color: var(--gray-900);
}

.magnitude-chip {
  font-weight: 600;
}

@media (max-width: 768px) {
  .earthquake-popup {
    margin-left: -150px;
    width: 300px;
  }
  
  .popup-title {
    font-size: 0.9rem;
  }
  
  .info-item {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .info-label {
    min-width: 60px;
    font-size: 0.875rem;
  }
  
  .info-value {
    font-size: 0.875rem;
  }
}
</style>