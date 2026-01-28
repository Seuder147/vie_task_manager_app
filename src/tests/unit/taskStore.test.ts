import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTaskStore } from '../../stores/taskStore';
import { taskService } from '../../services/taskService';
import type { Task } from '../../types';

vi.mock('../../services/taskService');

describe('useTaskStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('fetchTasks', () => {
        it('should fetch tasks and update state', async () => {
            const mockTasks: Task[] = [
                { id: '1', title: 'Task 1', description: 'Desc 1', status: 'todo', priority: 'high', createdAt: new Date().getDate() },
            ];
            vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);

            const store = useTaskStore();
            await store.fetchTasks();

            expect(store.tasks).toEqual(mockTasks);
            expect(store.isLoading).toBe(false);
            expect(store.error).toBeNull();
        });

        it('should handle fetch error', async () => {
            vi.mocked(taskService.getTasks).mockRejectedValue(new Error('Network error'));

            const store = useTaskStore();
            await store.fetchTasks();

            expect(store.error).toBe('Failed to fetch tasks');
            expect(store.isLoading).toBe(false);
        });
    });

    describe('addTask', () => {
        it('should add a new task', async () => {
            const newTask: Task = { id: '1', title: 'New', description: 'Desc', status: 'todo', priority: 'medium', createdAt: new Date().getDate() };
            vi.mocked(taskService.createTask).mockResolvedValue(newTask);

            const store = useTaskStore();
            await store.addTask({ title: 'New', description: 'Desc', status: 'todo', priority: 'medium' });

            expect(store.tasks).toContainEqual(newTask);
            expect(store.error).toBeNull();
        });

        it('should handle add task error', async () => {
            vi.mocked(taskService.createTask).mockRejectedValue(new Error('Failed'));

            const store = useTaskStore();
            await store.addTask({ title: 'New', description: 'Desc', status: 'todo', priority: 'medium' });

            expect(store.error).toBe('Failed to add task');
        });
    });

    describe('updateTaskStatus', () => {
        it('should update task status optimistically', async () => {
            const task: Task = { id: '1', title: 'Task', description: 'Desc', status: 'todo', priority: 'high', createdAt: new Date().getDate() };
            const store = useTaskStore();
            store.tasks = [task];

            await store.updateTaskStatus('1', 'in-progress');

            expect(store.tasks[0].status).toBe('in-progress');
        });

        it('should revert status on error', async () => {
            const task: Task = { id: '1', title: 'Task', description: 'Desc', status: 'todo', priority: 'high', createdAt: new Date().getDate() };
            const store = useTaskStore();
            store.tasks = [task];

            vi.mocked(taskService.updateTaskStatus).mockRejectedValue(new Error('Failed'));
            await store.updateTaskStatus('1', 'in-progress');

            expect(store.tasks[0].status).toBe('todo');
            expect(store.error).toBe('Failed to update task status');
        });
    });

    describe('deleteTask', () => {
        it('should delete task optimistically', async () => {
            const store = useTaskStore();
            store.tasks = [{ id: '1', title: 'Task', description: 'Desc', status: 'todo', priority: 'high', createdAt: new Date().getDate() }];

            await store.deleteTask('1');

            expect(store.tasks).toHaveLength(0);
        });

        it('should restore tasks on delete error', async () => {
            const task: Task = { id: '1', title: 'Task', description: 'Desc', status: 'todo', priority: 'high', createdAt: new Date().getDate() };
            const store = useTaskStore();
            store.tasks = [task];

            vi.mocked(taskService.deleteTask).mockRejectedValue(new Error('Failed'));
            await store.deleteTask('1');

            expect(store.tasks).toHaveLength(1);
            expect(store.error).toBe('Failed to delete task');
        });
    });

    describe('updateTask', () => {
        it('should update task fields', async () => {
            const task: Task = { id: '1', title: 'Old', description: 'Old', status: 'todo', priority: 'high', createdAt: new Date().getDate() };
            const store = useTaskStore();
            store.tasks = [task];

            await store.updateTask('1', { title: 'New', description: 'New', status: 'done', priority: 'low' });

            expect(store.tasks[0].title).toBe('New');
            expect(store.tasks[0].status).toBe('done');
        });
    });

    describe('tasksByStatus', () => {
        it('should group tasks by status', () => {
            const store = useTaskStore();
            store.tasks = [
                { id: '1', title: 'Todo', description: '', status: 'todo', priority: 'high', createdAt: new Date().getDate() },
                { id: '2', title: 'In Progress', description: '', status: 'in-progress', priority: 'high', createdAt: new Date().getDate() },
                { id: '3', title: 'Done', description: '', status: 'done', priority: 'high', createdAt: new Date().getDate() }
            ];

            expect(store.tasksByStatus.todo).toHaveLength(1);
            expect(store.tasksByStatus.inProgress).toHaveLength(1);
            expect(store.tasksByStatus.done).toHaveLength(1);
        });
    });
});