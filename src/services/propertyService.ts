import api from './api';
import { Property, CreatePropertyDto } from '@/types';

export const propertyService = {
  // Listar todas as propriedades
  async getProperties(): Promise<Property[]> {
    try {
      console.log('[PROPERTY SERVICE] === BUSCANDO PROPRIEDADES ===');
      console.log('[PROPERTY SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
      
      const { data } = await api.get<Property[]>('/properties');
      console.log('[PROPERTY SERVICE] Propriedades retornadas pela API:', data);
      console.log('[PROPERTY SERVICE] Número de propriedades:', data.length);
      
      if (data.length > 0) {
        console.log('[PROPERTY SERVICE] Primeira propriedade:', {
          id: data[0].id,
          name: data[0].name,
          location: data[0].location
        });
      }
      
      return data;
    } catch (error: any) {
      console.error('[PROPERTY SERVICE] Erro ao buscar propriedades:', error);
      console.error('[PROPERTY SERVICE] Response data:', error.response?.data);
      throw error;
    }
  },

  // Obter propriedade por ID
  async getPropertyById(id: string): Promise<Property> {
    const { data } = await api.get<Property>(`/properties/${id}`);
    return data;
  },

  // Criar nova propriedade
  async createProperty(propertyData: CreatePropertyDto): Promise<Property> {
    console.log('[PROPERTY SERVICE] createProperty chamado com dados:', propertyData);
    console.log('[PROPERTY SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
    
    try {
      const { data } = await api.post<Property>('/properties', propertyData);
      console.log('[PROPERTY SERVICE] Propriedade criada com sucesso:', data);
      return data;
    } catch (error: any) {
      console.error('[PROPERTY SERVICE] Erro ao criar propriedade:', error);
      if (error.response) {
        console.error('[PROPERTY SERVICE] Status:', error.response.status);
        console.error('[PROPERTY SERVICE] Data:', error.response.data);
      } else {
        console.error('[PROPERTY SERVICE] Erro inesperado:', error.message || error);
      }
      throw error;
    }
  },

  // Atualizar propriedade
  async updateProperty(id: string, propertyData: Partial<CreatePropertyDto>): Promise<Property> {
    const { data } = await api.put<Property>(`/properties/${id}`, propertyData);
    return data;
  },

  // Deletar propriedade
  async deleteProperty(id: string): Promise<void> {
    console.log('[PROPERTY SERVICE] deleteProperty chamado com ID:', id);
    console.log('[PROPERTY SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
    
    try {
      await api.delete(`/properties/${id}`);
      console.log('[PROPERTY SERVICE] Propriedade deletada com sucesso');
    } catch (error: any) {
      console.error('[PROPERTY SERVICE] Erro ao deletar propriedade:', error);
      console.error('[PROPERTY SERVICE] Status:', error.response?.status);
      console.error('[PROPERTY SERVICE] Data:', error.response?.data);
      throw error;
    }
  },

  // Buscar propriedades com filtros
  async searchProperties(filters: {
    title?: string;
    address?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    available?: boolean;
  }): Promise<Property[]> {
    const { data } = await api.get<Property[]>('/properties', { params: filters });
    return data;
  },
}; 