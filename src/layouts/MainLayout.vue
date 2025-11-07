<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="premium-header" elevated>
      <q-toolbar class="header-toolbar">
        <q-btn 
          flat 
          dense 
          round 
          icon="menu" 
          aria-label="Menu" 
          @click="toggleLeftDrawer"
          class="menu-button focus-ring"
        />

        <q-toolbar-title class="header-title">
          <div class="brand-container">
            <div class="brand-logo">
              <q-icon name="public" class="brand-icon" />
            </div>
            <div class="brand-content">
              <span class="brand-text">Earthquake Monitor</span>
              <span class="brand-subtitle">Global Seismic Data</span>
            </div>
          </div>
        </q-toolbar-title>

        <div class="header-actions">
          <div class="status-indicator success">
            <div class="status-dot"></div>
            <span>Live Data</span>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer 
      v-model="leftDrawerOpen" 
      show-if-above 
      :width="280"
      class="premium-drawer"
      elevated
    >
      <div class="drawer-content">
        <div class="drawer-header">
          <div class="drawer-brand">
            <q-icon name="explore" class="drawer-icon" />
            <h6 class="drawer-title">Navigation</h6>
          </div>
        </div>
        
        <nav class="navigation-section">
          <q-list class="navigation-list">
            <q-item 
              clickable 
              v-ripple 
              to="/" 
              exact
              class="nav-item focus-ring"
            >
              <q-item-section avatar>
                <div class="nav-icon-container">
                  <q-icon name="dashboard" class="nav-icon" />
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="nav-label">Dashboard</q-item-label>
                <q-item-label caption class="nav-caption">Monitor seismic activity</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </nav>

        <div class="drawer-divider"></div>

        <div class="info-section">
          <h6 class="section-title">System Information</h6>
          
          <div class="info-grid">
            <div class="info-card premium-card">
              <div class="info-icon-wrapper">
                <q-icon name="api" class="info-icon" />
              </div>
              <div class="info-content">
                <div class="info-label">Data Source</div>
                <div class="info-value">USGS Earthquake API</div>
              </div>
            </div>
            
            <div class="info-card premium-card">
              <div class="info-icon-wrapper">
                <q-icon name="sync" class="info-icon" />
              </div>
              <div class="info-content">
                <div class="info-label">Update Frequency</div>
                <div class="info-value">Real-time Stream</div>
              </div>
            </div>

            <div class="info-card premium-card">
              <div class="info-icon-wrapper">
                <q-icon name="schedule" class="info-icon" />
              </div>
              <div class="info-content">
                <div class="info-label">Data Range</div>
                <div class="info-value">Past 7 Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.premium-header {
  background: var(--surface);
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(8px);
}

.header-toolbar {
  padding: 0 var(--space-6);
  min-height: 72px;
}

.menu-button {
  color: var(--gray-600);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--radius-md);
}

.menu-button:hover {
  background-color: var(--gray-100);
  color: var(--gray-900);
  transform: scale(1.05);
}

.brand-container {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.brand-icon {
  font-size: 1.5rem;
  color: white;
}

.brand-content {
  display: flex;
  flex-direction: column;
}

.brand-text {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--gray-900);
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--success-500);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.premium-drawer {
  background: var(--surface);
  border-right: 1px solid var(--gray-200);
  box-shadow: var(--shadow-lg);
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: var(--space-6) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  background: linear-gradient(135deg, var(--gray-25), var(--gray-50));
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.drawer-icon {
  font-size: 1.25rem;
  color: var(--primary-600);
}

.drawer-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-900);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.navigation-section {
  padding: var(--space-4) 0;
}

.navigation-list {
  padding: 0 var(--space-4);
}

.nav-item {
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-2);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: var(--space-3) var(--space-4);
}

.nav-item:hover {
  background-color: var(--gray-100);
  transform: translateX(2px);
}

.nav-item.q-router-link--exact-active {
  background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
  border-left: 4px solid var(--primary-600);
  box-shadow: var(--shadow-sm);
}

.nav-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background-color: var(--gray-100);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item.q-router-link--exact-active .nav-icon-container {
  background-color: var(--primary-200);
}

.nav-icon {
  color: var(--gray-600);
  font-size: 1.125rem;
}

.nav-item.q-router-link--exact-active .nav-icon {
  color: var(--primary-700);
}

.nav-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--gray-900);
}

.nav-caption {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 2px;
}

.drawer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gray-200), transparent);
  margin: var(--space-4) var(--space-5);
}

.info-section {
  padding: var(--space-4) var(--space-5);
  flex-grow: 1;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 var(--space-4) 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-card:hover {
  transform: translateY(-1px);
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  flex-shrink: 0;
}

.info-icon {
  color: var(--primary-600);
  font-size: 1rem;
}

.info-content {
  flex-grow: 1;
  min-width: 0;
}

.info-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.info-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gray-900);
  line-height: 1.3;
}

.page-container {
  background-color: var(--bg-secondary);
}

@media (max-width: 768px) {
  .brand-content {
    display: none;
  }
  
  .header-actions {
    display: none;
  }
  
  .header-toolbar {
    padding: 0 var(--space-4);
    min-height: 64px;
  }
  
  .brand-logo {
    width: 40px;
    height: 40px;
  }
  
  .brand-icon {
    font-size: 1.25rem;
  }
}
</style>
