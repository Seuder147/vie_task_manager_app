<script setup lang="ts">
import type { Task } from '@/types';
import TaskCard from './TaskCard.vue';
import { Plus } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

import draggable from 'vuedraggable';

const props = defineProps<{
  title: string;
  tasks: Task[];
  statusColor?: string;
  columnStatus: Task['status']; // Needed to know which column we dropped into
}>();

const emit = defineEmits<{
  (e: 'update:tasks', payload: Task[]): void;
  (e: 'add-task'): void;
}>();

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<template>
  <div class="task-column">
    <div class="column-header">
      <div class="header-left">
        <div class="status-dot" :style="{ background: statusColor || 'var(--color-primary)' }"></div>
        <h2 class="title">{{ title }}</h2>
        <span class="count">{{ tasks.length }}</span>
      </div>
      <button class="add-btn" @click="emit('add-task')">
        <Plus :size="16" />
      </button>
    </div>

  <draggable 
    :model-value="tasks"
    @update:model-value="emit('update:tasks', $event)"
    group="tasks" 
    item-key="id"
    class="tasks-container"
    ghost-class="ghost-card"
    :disabled="isMobile"
  >
    <template #item="{ element }">
      <TaskCard :task="element" />
    </template>
  </draggable>
  </div>
</template>

<style scoped>
.task-column {
  flex: 1;
  min-width: 300px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: var(--radius-lg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media (max-width: 768px) {
  .task-column {
    min-width: 85vw; /* Show mostly one column to encourage focus but hint at others with the edge */
  }
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 4px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.count {
  font-size: 0.75rem;
  background: var(--color-bg-mute);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--color-text-soft);
}

.add-btn {
  color: var(--color-text-mute);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.add-btn:hover {
  background: var(--color-bg-mute);
  color: var(--color-text-main);
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
}


/* Custom Scrollbar for list */
.tasks-container::-webkit-scrollbar {
  width: 4px;
}
.tasks-container::-webkit-scrollbar-track {
  background: transparent;
}

/* Drag & Drop Ghost */
.ghost-card {
  opacity: 0.5;
  background: var(--color-bg-mute);
  border: 1px dashed var(--color-primary);
}
</style>
