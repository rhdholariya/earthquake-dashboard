<template>
  <q-card class="chart-card professional-card">
    <q-card-section class="chart-header">
      <div class="chart-title">
        <q-icon name="analytics" class="q-mr-sm" />
        Timeline Analysis
      </div>
      <div class="chart-subtitle">
        Magnitude trends over time
      </div>
    </q-card-section>
    
    <q-card-section class="chart-content">
      <div v-if="loading" class="chart-loading">
        <q-spinner-dots size="50px" color="primary" />
      </div>
      
      <div v-else-if="earthquakes.length === 0" class="chart-empty">
        <q-icon name="show_chart" size="4rem" color="grey-5" />
        <div class="empty-title">No Data Available</div>
        <div class="empty-subtitle">Adjust your filters to see earthquake data</div>
      </div>
      
      <v-chart
        v-else
        :option="chartOption"
        style="height: 450px"
        autoresize
        class="earthquake-chart"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { useEarthquakeStore } from '../stores/earthquake';
import { date } from 'quasar';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
]);

const earthquakeStore = useEarthquakeStore();

const earthquakes = computed(() => earthquakeStore.filteredEarthquakes);
const loading = computed(() => earthquakeStore.loading);

const chartOption = computed(() => {
  const sortedData = [...earthquakes.value]
    .sort((a, b) => a.time - b.time)
    .map(eq => [
      date.formatDate(eq.time, 'YYYY-MM-DD HH:mm'),
      eq.magnitude,
      eq.place
    ]);

  return {
    backgroundColor: 'transparent',
    title: {
      text: 'Seismic Activity Timeline',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#667eea',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(item => item[0]),
      axisLabel: {
        rotate: 45,
        formatter: (value: string) => {
          return date.formatDate(new Date(value), 'MM/DD HH:mm');
        },
        color: '#666',
        fontSize: 11
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Magnitude',
      min: 0,
      max: 10,
      nameTextStyle: {
        color: '#666',
        fontSize: 12,
        fontWeight: 600
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    dataZoom: [
      {
        type: 'slider',
        start: 0,
        end: 100,
        height: 30,
        bottom: 60,
        borderColor: '#667eea',
        fillerColor: 'rgba(103, 126, 234, 0.2)',
        handleStyle: {
          color: '#667eea'
        }
      }
    ],
    series: [
      {
        name: 'Magnitude',
        type: 'line',
        data: sortedData.map(item => item[1]),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#667eea',
          borderColor: '#fff',
          borderWidth: 2
        },
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ]
          },
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103, 126, 234, 0.3)' },
              { offset: 1, color: 'rgba(103, 126, 234, 0.05)' }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: '#764ba2',
            borderColor: '#fff',
            borderWidth: 3,
            shadowColor: 'rgba(103, 126, 234, 0.5)',
            shadowBlur: 10
          }
        }
      }
    ],
    animation: true,
    animationDuration: 1000
  };
});
</script>

<style scoped>
.chart-card {
  overflow: hidden;
}

.chart-header {
  background-color: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  padding: 16px 20px;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 400;
}

.chart-content {
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 450px;
  gap: 16px;
}



.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 450px;
  gap: 16px;
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

.earthquake-chart {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
}
</style>