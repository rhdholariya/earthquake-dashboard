<template>
  <q-card class="table-card professional-card">
    <q-card-section class="table-header">
      <div class="table-title">
        <q-icon name="table_chart" class="q-mr-sm" />
        Data Table
      </div>
      <div class="table-subtitle">
        {{ earthquakes.length }} earthquakes
      </div>
    </q-card-section>
    
    <q-card-section class="q-pa-none">
      <div class="table-container">
        <q-table
        :rows="earthquakes"
        :columns="columns"
        :loading="loading"
        row-key="id"
        flat
        :pagination="{ 
          rowsPerPage: 10, 
          sortBy: 'time', 
          descending: true
        }"
        :rows-per-page-options="[10, 20, 25, 50, 0]"
        @row-click="onRowClick"
        class="modern-table"
        :loading-label="'Loading earthquake data...'"
        :no-data-label="'No earthquakes match your current filters'"
        dense
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary">
            <div class="loading-content">
              <q-spinner-dots size="50px" color="primary" />
              <div class="loading-text">Loading earthquake data...</div>
            </div>
          </q-inner-loading>
        </template>

        <template v-slot:body-cell-place="props">
          <q-td :props="props" class="location-cell">
            <div class="location-content">
              <q-icon name="place" class="location-icon" />
              <div class="location-text">{{ props.value }}</div>
            </div>
          </q-td>
        </template>
        
        <template v-slot:body-cell-magnitude="props">
          <q-td :props="props" class="magnitude-cell">
            <q-chip
              :color="getMagnitudeColor(props.value)"
              text-color="white"
              :label="props.value.toFixed(1)"
              class="magnitude-chip"
              size="md"
            />
            <div class="magnitude-scale">
              <div 
                class="scale-bar"
                :style="{ width: (props.value / 10 * 100) + '%' }"
              ></div>
            </div>
          </q-td>
        </template>
        
        <template v-slot:body-cell-time="props">
          <q-td :props="props" class="time-cell">
            <div class="time-content">
              <div class="time-main">{{ formatTime(props.value) }}</div>
              <div class="time-relative">{{ getRelativeTime(props.value) }}</div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-depth="props">
          <q-td :props="props" class="depth-cell">
            <div class="depth-content">
              <q-icon name="height" class="depth-icon" />
              <span class="depth-value">{{ 
                (props.value !== null && props.value !== undefined && typeof props.value === 'number') 
                  ? props.value.toFixed(1) + ' km' 
                  : 'N/A' 
              }}</span>
            </div>
          </q-td>
        </template>



        <template v-slot:body="props">
          <q-tr 
            :props="props" 
            class="table-row"
            @click="onRowClick($event, props.row)"
          >
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              <template v-if="col.name === 'place'">
                <div class="location-content">
                  <q-icon name="place" class="location-icon" />
                  <div class="location-text">{{ col.value }}</div>
                </div>
              </template>
              
              <template v-else-if="col.name === 'magnitude'">
                <div class="magnitude-container">
                  <q-chip
                    :color="getMagnitudeColor(Number(col.value))"
                    text-color="white"
                    :label="Number(col.value).toFixed(1)"
                    class="magnitude-chip"
                    size="md"
                  />
                  <div class="magnitude-scale">
                    <div 
                      class="scale-bar"
                      :style="{ 
                        width: (Number(col.value) / 10 * 100) + '%',
                        backgroundColor: getMagnitudeColor(Number(col.value)) 
                      }"
                    ></div>
                  </div>
                </div>
              </template>
              
              <template v-else-if="col.name === 'time'">
                <div class="time-content">
                  <div class="time-main">{{ formatTime(col.value) }}</div>
                  <div class="time-relative">{{ getRelativeTime(col.value) }}</div>
                </div>
              </template>

              <template v-else-if="col.name === 'depth'">
                <div class="depth-content">
                  <q-icon name="height" class="depth-icon" />
                  <span class="depth-value">{{ 
                    (col.value !== null && col.value !== undefined && typeof col.value === 'number') 
                      ? col.value.toFixed(1) + ' km' 
                      : 'N/A' 
                  }}</span>
                </div>
              </template>
              
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEarthquakeStore, type Earthquake } from '../stores/earthquake';
import { getMagnitudeColor, formatTime } from '../utils/earthquake-utils';

const earthquakeStore = useEarthquakeStore();

const earthquakes = computed(() => earthquakeStore.filteredEarthquakes);
const loading = computed(() => earthquakeStore.loading);

const columns = [
  {
    name: 'place',
    required: true,
    label: 'Location',
    align: 'left' as const,
    field: 'place',
    sortable: true,
    style: 'width: 40%; min-width: 200px;'
  },
  {
    name: 'magnitude',
    label: 'Magnitude',
    align: 'center' as const,
    field: 'magnitude',
    sortable: true,
    style: 'width: 15%; min-width: 100px;'
  },
  {
    name: 'time',
    label: 'Time',
    align: 'left' as const,
    field: 'time',
    sortable: true,
    style: 'width: 30%; min-width: 150px;'
  },
  {
    name: 'depth',
    label: 'Depth',
    align: 'center' as const,
    field: 'depth',
    sortable: true,
    style: 'width: 15%; min-width: 80px;'
  }
];

const emit = defineEmits<{
  rowClick: [earthquake: Earthquake];
}>();

const onRowClick = (evt: Event, row: Earthquake) => {
  emit('rowClick', row);
};

const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
};
</script>

<style scoped>
.table-card {
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
}

.table-header {
  background-color: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  padding: 16px 20px;
}

.table-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.table-subtitle {
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 400;
}

.modern-table {
  background: transparent;
  width: 100%;
  table-layout: fixed;
}

.modern-table :deep(.q-table__container) {
  overflow-x: auto;
  border-radius: 0;
  position: relative;
}

.modern-table :deep(.q-table__middle) {
  overflow-x: visible;
}

.modern-table :deep(.q-table__bottom) {
  position: relative;
  z-index: 1;
}

.modern-table :deep(.q-table__top) {
  display: none;
}

.modern-table :deep(.q-table thead th) {
  background-color: var(--gray-100);
  color: var(--gray-700);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--gray-200);
  padding: var(--space-2) var(--space-3);
  height: 40px;
}

.modern-table :deep(.q-table tbody tr) {
  cursor: pointer;
}

.modern-table :deep(.q-table tbody tr:hover) {
  background-color: var(--gray-50);
}

.modern-table :deep(.q-table tbody td) {
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--gray-100);
  vertical-align: middle;
  height: 48px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-text {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.location-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.location-icon {
  color: var(--gray-500);
  font-size: 1rem;
  flex-shrink: 0;
}

.location-text {
  font-weight: 500;
  color: var(--gray-900);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.magnitude-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.magnitude-chip {
  font-weight: 600;
  font-size: 0.875rem;
  min-width: 45px;
}

.magnitude-scale {
  width: 50px;
  height: 3px;
  background-color: var(--gray-200);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.scale-bar {
  height: 100%;
  border-radius: var(--radius-sm);
}

.time-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
}

.time-main {
  font-weight: 500;
  color: var(--gray-900);
  font-size: 0.875rem;
  line-height: 1.2;
}

.time-relative {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-weight: 400;
}

.depth-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.depth-icon {
  color: var(--gray-500);
  font-size: 1rem;
}

.depth-value {
  font-weight: 500;
  color: var(--gray-900);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .modern-table :deep(.q-table tbody td) {
    padding: var(--space-3) var(--space-2);
    font-size: 0.875rem;
  }
  
  .modern-table :deep(.q-table thead th) {
    padding: var(--space-2);
    font-size: 0.6875rem;
  }
  
  .location-text {
    font-size: 0.8125rem;
  }
  
  .time-content {
    align-items: flex-start;
  }
  
  .magnitude-container {
    align-items: flex-start;
  }
  
  .magnitude-scale {
    width: 40px;
  }
  
  .depth-content {
    justify-content: flex-start;
    gap: var(--space-1);
  }
  
  .depth-icon {
    font-size: 0.875rem;
  }
}
</style>