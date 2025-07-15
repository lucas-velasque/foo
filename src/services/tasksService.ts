import api from './api';
import { Task } from '@/types';

export const tasksService = {
  // Listar todas as tarefas
  async getTasks(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks');
    return data;
  },

  // Obter tarefa por ID
  async getTaskById(id: string): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  // Criar nova tarefa
  async createTask(taskData: Partial<Task>): Promise<Task> {
    const { data } = await api.post<Task>('/tasks', taskData);
    return data;
  },

  // Atualizar tarefa
  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    const { data } = await api.patch<Task>(`/tasks/${id}`, taskData);
    return data;
  },

  // Deletar tarefa
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  // Buscar tarefas com filtros
  async searchTasks(filters: {
    assignedTo?: number;
    status?: string;
    priority?: string;
  }): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks', { params: filters });
    return data;
  },

  // Obter tarefas do usuário atual
  async getUserTasks(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks/my-tasks');
    return data;
  },

  // Atribuir tarefa a um usuário
  async assignTask(taskId: string, userId: number): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${taskId}/assign`, { userId });
    return data;
  },
}; 