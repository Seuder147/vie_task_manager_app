<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    
    <div class="content-wrapper">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.content-wrapper {
  flex: 1;
  margin-left: 260px; /* Match Sidebar width */
  background: var(--color-bg);
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 0;
    padding-bottom: 80px; /* Space for bottom nav if we possessed one */
  }
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
