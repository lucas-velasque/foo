import api from './api';
import { User, CreateUserDto, UpdateUserDto } from '@/types';

export const userService = {
  // Listar todos os usuários
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  // Obter usuário por ID
  async getUserById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  // Criar novo usuário
  async createUser(userData: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>('/users', userData);
    return data;
  },

  // Atualizar usuário
  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const { data } = await api.put<User>(`/users/${id}`, userData);
    return data;
  },

  // Deletar usuário
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Buscar usuários com filtros
  async searchUsers(filters: {
    name?: string;
    email?: string;
    role?: string;
  }): Promise<User[]> {
    const { data } = await api.get<User[]>('/users', { params: filters });
    return data;
  },
}; 