<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import TaskColumn from '@/components/tasks/TaskColumn.vue';
import { Plus, Search, Loader2, AlertCircle } from 'lucide-vue-next';
import BaseModal from '@/components/ui/BaseModal.vue';
import TaskForm from '@/components/tasks/TaskForm.vue';
import type { Task, TaskStatus } from '@/types';

const store = useTaskStore();

// Fetch tasks on mount
onMounted(() => {
  store.fetchTasks();
});

// Modal State
const isModalOpen = ref(false);
const openInitialStatus = ref<TaskStatus>('todo');

const openNewTaskModal = (status: TaskStatus = 'todo') => {
  openInitialStatus.value = status;
  isModalOpen.value = true;
};

const handleTaskSubmit = (values: Omit<Task, 'id' | 'createdAt'>) => {
  store.addTask(values);
  isModalOpen.value = false;
};

// Drag & Drop Helpers
const updateTasks = (newTasks: Task[], status: TaskStatus) => {
  newTasks.forEach(task => {
    if (task.status !== status) {
      store.updateTaskStatus(task.id, status);
    }
  });
};

const todoList = computed({
  get: () => store.tasks.filter(t => t.status === 'todo'),
  set: (val) => updateTasks(val, 'todo')
});

const inProgressList = computed({
  get: () => store.tasks.filter(t => t.status === 'in-progress'),
  set: (val) => updateTasks(val, 'in-progress')
});

const doneList = computed({
  get: () => store.tasks.filter(t => t.status === 'done'),
  set: (val) => updateTasks(val, 'done')
});

const activeTab = ref<TaskStatus>('todo');

const setTab = (tab: TaskStatus) => {
  activeTab.value = tab;
};
</script>

<template>
  <main class="dashboard-view">
    <!-- Header Section -->
    <header class="top-bar">
      <div class="greeting">
        <h1>Task Board</h1>
        <p class="subtitle">Manage and track your tasks</p>
      </div>

      <div class="actions">
        <div class="search-box">
          <Search :size="18" />
          <input type="text" placeholder="Search tasks..." />
        </div>
        
        <button class="btn-primary" @click="openNewTaskModal('todo')">
          <Plus :size="18" />
          <span>New Task</span>
        </button>
      </div>
    </header>

    <!-- Mobile Tabs -->
    <div class="mobile-tabs">
      <button 
        :class="{ active: activeTab === 'todo' }" 
        @click="setTab('todo')"
      >
        To Do
      </button>
      <button 
        :class="{ active: activeTab === 'in-progress' }" 
        @click="setTab('in-progress')"
      >
        In Progress
      </button>
      <button 
        :class="{ active: activeTab === 'done' }" 
        @click="setTab('done')"
      >
        Done
      </button>
    </div>

    <!-- Error State -->
    <div v-if="store.error" class="error-container">
      <AlertCircle class="text-danger" />
      <p>{{ store.error }}</p>
      <button @click="store.fetchTasks()" class="btn-retry">Retry</button>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoading" class="loading-container">
      <Loader2 class="animate-spin text-primary" :size="48" />
    </div>

    <!-- Kanban Board -->
    <div v-else class="board-container">
      <TaskColumn 
        title="To Do" 
        v-model:tasks="todoList" 
        column-status="todo"
        statusColor="#94a3b8"
        class="col-todo"
        :class="{ 'mobile-hidden': activeTab !== 'todo' }"
        @add-task="openNewTaskModal('todo')"
      />
      <TaskColumn 
        title="In Progress" 
        v-model:tasks="inProgressList"
        column-status="in-progress" 
        statusColor="#6366f1"
        class="col-progress"
        :class="{ 'mobile-hidden': activeTab !== 'in-progress' }"
        @add-task="openNewTaskModal('in-progress')"
      />
      <TaskColumn 
        title="Completed" 
        v-model:tasks="doneList"
        column-status="done" 
        statusColor="#10b981"
        class="col-done"
        :class="{ 'mobile-hidden': activeTab !== 'done' }"
        @add-task="openNewTaskModal('done')"
      />
    </div>

    <!-- Modals -->
    <BaseModal 
      :is-open="isModalOpen" 
      title="Create New Task"
      @close="isModalOpen = false"
    >
      <TaskForm 
        :initial-status="openInitialStatus" 
        @submit="handleTaskSubmit" 
        @cancel="isModalOpen = false" 
      />
    </BaseModal>
  </main>
</template>

<style scoped>
.dashboard-view {
  padding: 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin-bottom: 4px;
}

.subtitle {
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-right: 0.5rem; /* Ensure button isn't touching the edge */
}

.search-box {
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-soft);
  transition: var(--transition);
  width: 240px;
}

.search-box:focus-within {
  border-color: var(--color-primary);
  color: var(--color-text-main);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}


.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: var(--color-danger);
  border-radius: 50%;
  border: 2px solid var(--color-bg-soft);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
  box-shadow: var(--shadow-glow);
  margin-right: 8px; /* Move slightly left */
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}

.board-container {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory; /* Enable snap scrolling */
  -webkit-overflow-scrolling: touch;
}


.board-container > * {
  scroll-snap-align: start; /* Snap columns to start */
}

/* Default: Hide mobile tabs on desktop */
.mobile-tabs {
  display: none;
}


.loading-container,
.error-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  gap: 1rem;
  color: var(--color-text-soft);
}

.error-container {
  color: var(--color-danger);
  text-align: center;
}

.btn-retry {
  padding: 8px 16px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.btn-retry:hover {
  background: var(--color-bg-mute);
  color: var(--color-text-main);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.text-primary {
  color: var(--color-primary);
}

.text-danger {
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 1rem;
    height: auto;
    min-height: calc(100vh - 80px);
  }

  .top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .greeting {
    width: 100%;
  }

  .actions {
    width: 100%;
    margin-top: 0.5rem;
    justify-content: space-between;
    padding-right: 0.5rem; /* Ensure button isn't touching the edge */
  }

  .search-box {
    width: auto;
    flex: 1;
    min-width: 0; /* Allow shrinking */
  }
  
  .btn-primary {
    flex-shrink: 0;
    margin-right: 8px; /* Move slightly left */
  }
  
  /* Mobile Board Layout */
  .board-container {
    display: block; /* Stack (but we hide inactive columns) */
    overflow-x: hidden;
    padding-bottom: 60px; /* Extra space for bottom tab bar if needed */
  }

  .mobile-hidden {
    display: none !important;
  }

  /* Mobile Tabs */
  .mobile-tabs {
    display: flex;
    background: var(--color-bg-soft);
    padding: 4px;
    border-radius: var(--radius-md);
    margin-bottom: 1rem;
    border: 1px solid var(--color-border);
  }

  .mobile-tabs button {
    flex: 1;
    padding: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-soft);
    border-radius: var(--radius-sm);
    transition: var(--transition);
  }

  .mobile-tabs button.active {
    background: var(--color-bg-mute);
    color: var(--color-text-main);
    box-shadow: var(--shadow-sm);
  }
}
</style>
