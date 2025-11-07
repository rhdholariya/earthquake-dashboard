<template>
  <q-page class="dashboard-page">
    <div class="page-container">
      <!-- Enhanced Filters -->
      <section class="filters-section slide-up">
        <earthquake-filters />
      </section>
      
      <!-- Premium Error Display -->
      <div v-if="error" class="error-section slide-up">
        <div class="error-banner premium-card">
          <div class="error-icon">
            <q-icon name="warning" />
          </div>
          <div class="error-content">
            <div class="error-title text-body-md">Connection Issue</div>
            <div class="error-message text-body-sm">{{ error }}</div>
          </div>
          <q-btn 
            unelevated
            label="Retry Connection" 
            @click="retryFetch"
            color="primary"
            class="retry-button btn-primary"
          />
        </div>
      </div>
      
      <!-- Premium Main Content -->
      <main class="content-section slide-up">
        <div class="content-card premium-card">
          <div class="content-header">
            <h2 class="content-title text-heading-sm">Seismic Data Analysis</h2>
            <div class="view-selector">
              <q-btn-toggle
                v-model="activeTab"
                :options="[
                  { label: 'Table', value: 'table', icon: 'table_rows' },
                  { label: 'Timeline', value: 'chart', icon: 'analytics' },
                  { label: 'Map', value: 'map', icon: 'public' }
                ]"
                color="primary"
                text-color="gray-700"
                toggle-color="primary"
                toggle-text-color="white"
                unelevated
                class="premium-toggle"
              />
            </div>
          </div>

          <div class="content-divider"></div>

          <div class="content-body">
            <q-tab-panels v-model="activeTab" animated class="premium-panels">
              <q-tab-panel name="table" class="panel-content">
                <earthquake-table @row-click="onEarthquakeSelect" />
              </q-tab-panel>

              <q-tab-panel name="chart" class="panel-content">
                <earthquake-chart />
              </q-tab-panel>

              <q-tab-panel name="map" class="panel-content">
                <earthquake-map />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Enhanced Earthquake Details Dialog -->
    <q-dialog v-model="showDetails" position="right" class="details-dialog">
      <q-card class="details-card glass-card">
        <q-card-section class="details-header">
          <div class="details-title">
            <q-icon name="info" class="q-mr-sm" />
            Earthquake Details
          </div>
          <q-btn 
            icon="close" 
            flat 
            round 
            dense 
            v-close-popup 
            class="close-btn"
          />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedEarthquake" class="details-content">
          <div class="detail-item">
            <div class="detail-icon">
              <q-icon name="place" />
            </div>
            <div class="detail-info">
              <div class="detail-label">Location</div>
              <div class="detail-value">{{ selectedEarthquake.place }}</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon">
              <q-icon name="speed" />
            </div>
            <div class="detail-info">
              <div class="detail-label">Magnitude</div>
              <div class="detail-value">
                <q-chip
                  :color="getMagnitudeColor(selectedEarthquake.magnitude)"
                  text-color="white"
                  :label="selectedEarthquake.magnitude.toFixed(1)"
                  size="lg"
                  class="magnitude-chip"
                />
              </div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon">
              <q-icon name="schedule" />
            </div>
            <div class="detail-info">
              <div class="detail-label">Time</div>
              <div class="detail-value">{{ formatTimeDetailed(selectedEarthquake.time) }}</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon">
              <q-icon name="height" />
            </div>
            <div class="detail-info">
              <div class="detail-label">Depth</div>
              <div class="detail-value">{{ selectedEarthquake.depth.toFixed(1) }} km</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon">
              <q-icon name="my_location" />
            </div>
            <div class="detail-info">
              <div class="detail-label">Coordinates</div>
              <div class="detail-value coordinates">
                <div>{{ selectedEarthquake.latitude.toFixed(4) }}°N</div>
                <div>{{ selectedEarthquake.longitude.toFixed(4) }}°E</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEarthquakeStore, type Earthquake } from '../stores/earthquake';
import { getMagnitudeColor, formatTimeDetailed } from '../utils/earthquake-utils';
import EarthquakeFilters from '../components/EarthquakeFilters.vue';
import EarthquakeTable from '../components/EarthquakeTable.vue';
import EarthquakeChart from '../components/EarthquakeChart.vue';
import EarthquakeMap from '../components/EarthquakeMap.vue';

const earthquakeStore = useEarthquakeStore();

const activeTab = ref('table');
const showDetails = ref(false);
const selectedEarthquake = ref<Earthquake | null>(null);

const error = computed(() => earthquakeStore.error);

const onEarthquakeSelect = (earthquake: Earthquake) => {
  selectedEarthquake.value = earthquake;
  showDetails.value = true;
};

const retryFetch = () => {
  void earthquakeStore.fetchEarthquakes();
};

onMounted(() => {
  void earthquakeStore.fetchEarthquakes();
});
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.page-header {
  margin-bottom: var(--space-10);
}

.header-content {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}



.header-stats {
  display: flex;
  gap: var(--space-4);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  min-width: 140px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  color: var(--primary-600);
  font-size: 1.25rem;
}

.stat-content {
  flex-grow: 1;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-900);
}

.filters-section {
  margin-bottom: var(--space-8);
}

.error-section {
  margin-bottom: var(--space-8);
}

.error-banner {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  background: linear-gradient(135deg, var(--error-50), #fef7f7);
  border: 1px solid var(--error-200);
  border-left: 4px solid var(--error-500);
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background-color: var(--error-100);
  color: var(--error-600);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.error-content {
  flex-grow: 1;
}

.error-title {
  font-weight: 600;
  color: var(--error-600);
  margin-bottom: var(--space-1);
}

.error-message {
  color: var(--gray-600);
}

.retry-button {
  flex-shrink: 0;
}

.content-section {
  margin-bottom: var(--space-12);
}

.content-card {
  overflow: hidden;
  min-height: 700px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) var(--space-6) var(--space-4);
}

.content-title {
  color: var(--gray-900);
  margin: 0;
}

.view-selector {
  display: flex;
  align-items: center;
}

.premium-toggle {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.content-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gray-200), transparent);
  margin: 0 var(--space-6);
}

.content-body {
  padding: 0;
}

.premium-panels {
  background-color: transparent;
}

.panel-content {
  padding: 0;
  animation: fadeIn 0.3s ease-out;
}

.details-dialog .q-dialog__inner {
  padding: 0;
}

.details-card {
  width: 480px;
  max-width: 90vw;
  max-height: 90vh;
  margin: 0;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.details-header {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  padding: var(--space-6) var(--space-6) var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.details-title {
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.close-btn {
  color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--radius-md);
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.details-content {
  padding: var(--space-6);
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--gray-200);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  flex-shrink: 0;
  font-size: 1.125rem;
}

.detail-info {
  flex-grow: 1;
  min-width: 0;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-1);
}

.detail-value {
  font-size: 0.9375rem;
  color: var(--gray-900);
  font-weight: 500;
  line-height: 1.4;
}

.coordinates {
  display: flex;
  gap: var(--space-3);
}

.magnitude-chip {
  font-weight: 600;
}

@media (max-width: 1024px) {
  .header-content {
    justify-content: center;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: var(--space-6) var(--space-4);
  }
  
  .header-stats {
    flex-direction: column;
    width: 100%;
  }
  
  .stat-card {
    min-width: auto;
  }
  
  .content-header {
    padding: var(--space-5) var(--space-4) var(--space-3);
  }
  
  .content-divider {
    margin: 0 var(--space-4);
  }
}

@media (max-width: 480px) {
  .details-card {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    border-radius: 0;
  }
}
</style>