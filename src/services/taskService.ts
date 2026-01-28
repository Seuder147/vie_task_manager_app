import apiClient from './api';
import type { Task, UpdateTaskPayload, TaskStatus } from '../types';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', task);
    return response.data;
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}`, payload);
    return response.data;
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, { status });
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }
};
