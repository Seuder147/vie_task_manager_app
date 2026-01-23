<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { useUIStore } from '@/stores/ui';
import TaskColumn from '@/components/tasks/TaskColumn.vue';
import { Plus, Search, Menu } from 'lucide-vue-next';
import BaseModal from '@/components/ui/BaseModal.vue';
import TaskForm from '@/components/tasks/TaskForm.vue';
import type { Task, TaskStatus } from '@/types';

const store = useTaskStore();
const uiStore = useUIStore();

// Modal State
const isModalOpen = ref(false);
const initialTaskData = ref<Partial<Task> | undefined>(undefined);
const searchQuery = ref('');

const openNewTaskModal = (status?: TaskStatus) => {
  initialTaskData.value = status ? { status } : undefined;
  isModalOpen.value = true;
};

const closeNewTaskModal = () => {
  isModalOpen.value = false;
  initialTaskData.value = undefined;
};

const handleTaskSubmit = (values: any) => {
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

const filterTasks = (tasks: Task[]) => {
  if (!searchQuery.value) return tasks;
  const query = searchQuery.value.toLowerCase();
  return tasks.filter(t => 
    t.title.toLowerCase().includes(query) || 
    t.description.toLowerCase().includes(query)
  );
};

const todoList = computed({
  get: () => filterTasks(store.tasks.filter(t => t.status === 'todo')),
  set: (val) => updateTasks(val, 'todo')
});

const inProgressList = computed({
  get: () => filterTasks(store.tasks.filter(t => t.status === 'in-progress')),
  set: (val) => updateTasks(val, 'in-progress')
});

const doneList = computed({
  get: () => filterTasks(store.tasks.filter(t => t.status === 'done')),
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
        <button class="menu-btn mobile-only" @click="uiStore.openSidebar">
          <Menu :size="24" />
        </button>
        <div class="greeting-text">
          <h1>Multi Tasking</h1>
          <p class="subtitle">Manage and track your everyday tasks</p>
        </div>
      </div>

      <div class="actions">
        <div class="search-box">
          <Search :size="18" />
          <input type="text" placeholder="Search tasks..." v-model="searchQuery" />
        </div>
        
        <button class="btn-primary" @click="openNewTaskModal()">
          <Plus :size="18" /> <span>New Task</span>
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

    <!-- Kanban Board -->
    <div class="board-container">
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
        :initial-data="initialTaskData" 
        @submit="handleTaskSubmit" 
        @cancel="closeNewTaskModal" 
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
  padding-right: 0.5rem;
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
  border-color: rgba(102, 235, 14, 0.614);
  color: var(--color-text-main);
  box-shadow: 0 0 0 2px rgba(102, 235, 14, 0.2);
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
  background: rgba(193, 223, 173, 0.614);
  color: white;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
  box-shadow: var(--shadow-glow);
  margin-right: 8px;
}

.btn-primary:hover {
  background: rgba(110, 231, 17, 0.614);
  transform: translateY(-2px);
}

.board-container {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}


.board-container > * {
  scroll-snap-align: start;
}

.mobile-tabs {
  display: none;
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 0.5rem; 
    height: auto;
    min-height: calc(100vh - 80px);
  }

  .top-bar {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: nowrap; 
  }
  
  .greeting {
    width: auto;
    flex-shrink: 0;
  }

  .greeting-text {
    display: none;
  }
  
  .actions {
    width: 100%;
    margin-top: 0; 
    justify-content: flex-end; 
    padding-right: 0;
    gap: 8px;
    flex: 1; 
  }

  .search-box {
    width: auto;
    flex: 1; 
    min-width: 0;
    max-width: none; 
  }
  
  .btn-primary {
    flex-shrink: 0;
    margin-right: 0;
    padding: 8px; 
  }

  .btn-primary span {
    display: none; 
  }
  
  /* Mobile Board Layout */
  .board-container {
    display: block;
    overflow-x: hidden;
    padding-bottom: 60px; 
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

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .mobile-only {
    display: block;
  }
}
</style>
