import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, TaskStatus } from '../types';

  export type UpdateTaskPayload = {
  title: string
  description: string
  status: TaskStatus
  priority: Task['priority']
}

export const useTaskStore = defineStore('taskStore', () => {
  // State
  const tasks = ref<Task[]>([
    {
      id: '1',
      title: 'Design System',
      description: 'Create a consistent set of UI components and color palette.',
      status: 'done',
      priority: 'high',
      createdAt: Date.now()
    },
    {
      id: '2',
      title: 'Implement Authentication',
      description: 'Setup basic login and register flow using mock API.',
      status: 'in-progress',
      priority: 'high',
      createdAt: Date.now()
    },
  ]);

  // Actions
  function addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    tasks.value.push({
      ...task,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: Date.now()
    });
  }

  function updateTaskStatus(id: string, status: Task['status']) {
    const task = tasks.value.find(t => t.id === id);
    if (task) {
      task.status = status;
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id);
  }

  // add update to task menu
 function updateTask(id: string, payload: UpdateTaskPayload){
    const t = tasks.value.find(t => t.id === id)
    if (!t) return
    t.title = payload.title
    t.description = payload.description
    t.status = payload.status
    t.priority = payload.priority

  }


  // Getters
  const tasksByStatus = computed(() => {
    return {
      todo: tasks.value.filter(t => t.status === 'todo'),
      inProgress: tasks.value.filter(t => t.status === 'in-progress'),
      done: tasks.value.filter(t => t.status === 'done')
    };
  });

  return {
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    tasksByStatus,
    updateTask
  };
});
