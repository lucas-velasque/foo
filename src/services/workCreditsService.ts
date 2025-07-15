import api from './api';
import { WorkCredit, CreateWorkCreditDto, UpdateWorkCreditDto } from '@/types';

export const workCreditsService = {
  // Listar todos os créditos de serviço
  async getWorkCredits(): Promise<WorkCredit[]> {
    const { data } = await api.get<WorkCredit[]>('/work-credits');
    return data;
  },

  // Obter créditos do usuário logado
  async getMyWorkCredits(): Promise<WorkCredit[]> {
    const { data } = await api.get<WorkCredit[]>('/work-credits/user');
    return data;
  },

  // Obter crédito de serviço por ID
  async getWorkCreditById(id: string): Promise<WorkCredit> {
    const { data } = await api.get<WorkCredit>(`/work-credits/${id}`);
    return data;
  },

  // Criar novo crédito de serviço
  async createWorkCredit(creditData: CreateWorkCreditDto): Promise<WorkCredit> {
    const { data } = await api.post<WorkCredit>('/work-credits', creditData);
    return data;
  },

  // Atualizar crédito de serviço
  async updateWorkCredit(id: string, creditData: UpdateWorkCreditDto): Promise<WorkCredit> {
    const { data } = await api.put<WorkCredit>(`/work-credits/${id}`, creditData);
    return data;
  },

  // Deletar crédito de serviço
  async deleteWorkCredit(id: string): Promise<void> {
    await api.delete(`/work-credits/${id}`);
  },

  // Buscar créditos de serviço com filtros (para compatibilidade)
  async searchWorkCredits(filters: {
    user_id?: string;
    credit_type?: string;
  }): Promise<WorkCredit[]> {
    // Se tem user_id, usa a rota do usuário logado (mais seguro)
    if (filters.user_id) {
      return this.getMyWorkCredits();
    }
    // Caso contrário, retorna todos (só para admin/fornecedor)
    return this.getWorkCredits();
  },

  // Obter saldo de créditos de um usuário
  async getUserCreditBalance(user_id: string): Promise<{ balance: number }> {
    const { data } = await api.get<{ balance: number }>(`/work-credits/balance/${user_id}`);
    return data;
  },
}; 