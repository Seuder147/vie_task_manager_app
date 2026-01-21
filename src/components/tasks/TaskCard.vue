<script setup lang="ts">
import { ref } from 'vue';
import { Clock, MoreHorizontal, Trash2 } from 'lucide-vue-next';
import type { Task, TaskStatus } from '@/types';
import { useTaskStore } from '@/stores/taskStore';

defineProps<{ task: Task }>();

const store = useTaskStore();
const showMenu = ref(false);

const toggleMenu = (e: Event) => {
  e.stopPropagation(); // prevent modal opening if card click logic exists
  showMenu.value = !showMenu.value;
};

const moveTask = (id: string, status: TaskStatus) => {
  store.updateTaskStatus(id, status);
  showMenu.value = false;
};

const removeTask = (id: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    store.deleteTask(id);
  }
};
</script>

<template>
  <div class="task-card">
    <div class="card-header">
      <div class="priority-tag" :class="task.priority">
        {{ task.priority }}
      </div>
      <div class="menu-container">
        <button class="more-btn" @click="toggleMenu">
          <MoreHorizontal :size="16" />
        </button>
        
        <div v-if="showMenu" class="dropdown-menu">
          <div class="menu-label">Move to</div>
          <button v-if="task.status !== 'todo'" @click.stop="moveTask(task.id, 'todo')">
            To Do
          </button>
          <button v-if="task.status !== 'in-progress'" @click.stop="moveTask(task.id, 'in-progress')">
            In Progress
          </button>
          <button v-if="task.status !== 'done'" @click.stop="moveTask(task.id, 'done')">
            Done
          </button>
          <div class="divider"></div>
          <button class="delete-btn" @click.stop="removeTask(task.id)">
            <Trash2 :size="14" />
            Delete
          </button>
        </div>
        
        <!-- Backdrop to close menu -->
        <div v-if="showMenu" class="menu-backdrop" @click.stop="showMenu = false"></div>
      </div>
    </div>
    
    <h3 class="task-title">{{ task.title }}</h3>
    <p class="task-desc">{{ task.description }}</p>
    
    <div class="card-footer">
      <div class="meta-item">
        <Clock :size="14" />
        <span>{{ new Date(task.createdAt).toLocaleDateString() }}</span>
      </div>
      
      <div class="avatars">
        <div class="mini-avatar">JD</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: var(--color-bg-soft);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: var(--transition);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative; /* Context for dropdown? No, local */
}

/* ... existing styles ... */

.task-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priority-tag {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-transform: capitalize;
}

.priority-tag.high {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.priority-tag.medium {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.priority-tag.low {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.more-btn {
  color: var(--color-text-mute);
  opacity: 0; /* Keep hover effect on desktop */
  transition: var(--transition);
  padding: 4px;
  border-radius: 4px;
  position: relative;
  z-index: 20;
}

.more-btn:hover {
  background: var(--color-bg-mute);
  color: var(--color-text-main);
}

.task-card:hover .more-btn {
  opacity: 1;
}

/* On mobile, always show more button or at least make it accessible */
@media (max-width: 768px) {
  .more-btn {
    opacity: 1; 
  }
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.task-desc {
  font-size: 0.875rem;
  color: var(--color-text-soft);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--color-text-mute);
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-bg-soft);
}

/* Dropdown Menu */
.menu-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  width: 140px;
  padding: 4px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-label {
  font-size: 0.7rem;
  color: var(--color-text-mute);
  padding: 4px 8px;
  text-transform: uppercase;
  font-weight: 600;
}

.dropdown-menu button {
  text-align: left;
  padding: 6px 8px;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.dropdown-menu button:hover {
  background: var(--color-bg-soft);
  color: var(--color-text-main);
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: 2px 0;
}

.delete-btn {
  color: var(--color-danger) !important;
  display: flex;
  align-items: center;
  gap: 6px;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1) !important;
}

.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
}
</style>
