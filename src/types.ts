export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
}

export type UpdateTaskPayload = {
  title: string
  description: string
  priority: Task['priority']
  status: TaskStatus
}
