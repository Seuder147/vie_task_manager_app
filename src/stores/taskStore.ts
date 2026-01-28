import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, TaskStatus } from '../types';
import { taskService } from '../services/taskService';

export type UpdateTaskPayload = {
  title: string
  description: string
  status: TaskStatus
  priority: Task['priority']
}

export const useTaskStore = defineStore('taskStore', () => {
  // State
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchTasks() {
    isLoading.value = true;
    error.value = null;
    try {
      tasks.value = await taskService.getTasks();
    } catch (err) {
      error.value = 'Failed to fetch tasks';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    isLoading.value = true;
    error.value = null;
    try {
      const newTask = await taskService.createTask(task);
      tasks.value.push(newTask);
    } catch (err) {
      error.value = 'Failed to add task';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTaskStatus(id: string, status: Task['status']) {
    // Optimistic update
    const task = tasks.value.find(t => t.id === id);
    const previousStatus = task?.status;
    
    if (task) {
      task.status = status;
    }

    try {
      await taskService.updateTaskStatus(id, status);
    } catch (err) {
      // Revert on failure
      if (task && previousStatus) {
        task.status = previousStatus;
      }
      error.value = 'Failed to update task status';
      console.error(err);
    }
  }

  async function deleteTask(id: string) {
    // Optimistic update
    const previousTasks = [...tasks.value];
    tasks.value = tasks.value.filter(t => t.id !== id);

    try {
      await taskService.deleteTask(id);
    } catch (err) {
      tasks.value = previousTasks;
      error.value = 'Failed to delete task';
      console.error(err);
    }
  }

  // add update to task menu
 async function updateTask(id: string, payload: UpdateTaskPayload){
    const task = tasks.value.find(t => t.id === id);
    if (!task) return;
    
    const previousTask = { ...task };
    
    // Optimistic update
    task.title = payload.title;
    task.description = payload.description;
    task.status = payload.status;
    task.priority = payload.priority;

    try {
      await taskService.updateTask(id, payload);
    } catch (err) {
      // Revert
      Object.assign(task, previousTask);
      error.value = 'Failed to update task';
      console.error(err);
    }
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
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    tasksByStatus,
    updateTask
  };
});
