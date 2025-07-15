import api from './api';
import { SocialAssistance } from '@/types';

export const socialAssistanceService = {
  // Listar todas as assistências sociais
  async getSocialAssistances(): Promise<SocialAssistance[]> {
    console.log('Service: Getting all social assistances');
    const { data } = await api.get<SocialAssistance[]>('/social-assistances');
    console.log('Service: Received social assistances:', data);
    return data;
  },

  // Obter assistência social por ID
  async getSocialAssistanceById(id: string): Promise<SocialAssistance> {
    const { data } = await api.get<SocialAssistance>(`/social-assistances/${id}`);
    return data;
  },

  // Criar nova assistência social
  async createSocialAssistance(assistanceData: Partial<SocialAssistance>): Promise<SocialAssistance> {
    console.log('Service: Creating social assistance with data:', assistanceData);
    try {
      const { data } = await api.post<SocialAssistance>('/social-assistances', assistanceData);
      console.log('Service: Created social assistance:', data);
      return data;
    } catch (error) {
      console.error('Service: Error creating social assistance:', error);
      throw error;
    }
  },

  // Atualizar assistência social
  async updateSocialAssistance(id: string, assistanceData: Partial<SocialAssistance>): Promise<SocialAssistance> {
    console.log('Service: Updating social assistance with ID:', id, 'and data:', assistanceData);
    const { data } = await api.put<SocialAssistance>(`/social-assistances/${id}`, assistanceData);
    console.log('Service: Updated social assistance:', data);
    return data;
  },

  // Deletar assistência social
  async deleteSocialAssistance(id: string): Promise<void> {
    await api.delete(`/social-assistances/${id}`);
  },

  // Buscar assistências sociais com filtros
  async searchSocialAssistances(filters: {
    ong_name?: string;
    contact_email?: string;
  }): Promise<SocialAssistance[]> {
    const { data } = await api.get<SocialAssistance[]>('/social-assistances', { params: filters });
    return data;
  },
}; 