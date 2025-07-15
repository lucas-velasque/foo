import api from './api';
import { Booking, CreateBookingDto } from '@/types';

export const bookingService = {
  // Listar todos os agendamentos
  async getBookings(): Promise<Booking[]> {
    const { data } = await api.get<Booking[]>('/bookings');
    return data;
  },

  // Obter agendamento por ID
  async getBookingById(id: string): Promise<Booking> {
    const { data } = await api.get<Booking>(`/bookings/${id}`);
    return data;
  },

  // Criar novo agendamento
  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    try {
      console.log('[BOOKING SERVICE] === DEBUG CRIAR RESERVA ===');
      console.log('[BOOKING SERVICE] Dados recebidos:', bookingData);
      console.log('[BOOKING SERVICE] Property ID sendo enviado:', bookingData.property_id);
      console.log('[BOOKING SERVICE] Tipo do property_id:', typeof bookingData.property_id);
      console.log('[BOOKING SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
      
      const { data } = await api.post<Booking>('/bookings', bookingData);
      console.log('[BOOKING SERVICE] Reserva criada com sucesso:', data);
      return data;
    } catch (error: any) {
      console.error('[BOOKING SERVICE] === ERRO AO CRIAR RESERVA ===');
      console.error('[BOOKING SERVICE] Erro completo:', error);
      console.error('[BOOKING SERVICE] Response data:', error.response?.data);
      console.error('[BOOKING SERVICE] Response status:', error.response?.status);
      
      if (error.response && error.response.data) {
        // Lança a mensagem detalhada do backend para o frontend
        throw new Error(
          typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message || JSON.stringify(error.response.data)
        );
      }
      throw error;
    }
  },

  // Atualizar agendamento
  async updateBooking(id: string, bookingData: Partial<CreateBookingDto>): Promise<Booking> {
    const { data } = await api.put<Booking>(`/bookings/${id}`, bookingData);
    return data;
  },

  // Deletar agendamento
  async deleteBooking(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },

  // Buscar agendamentos com filtros
  async searchBookings(filters: {
    userId?: string;
    propertyId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Booking[]> {
    const { data } = await api.get<Booking[]>('/bookings', { params: filters });
    return data;
  },

  // Obter agendamentos do usuário atual
  async getUserBookings(): Promise<Booking[]> {
    const { data } = await api.get<Booking[]>('/bookings/my-bookings');
    return data;
  },

  // Aprovar reserva
  async approveBooking(id: string): Promise<Booking> {
    const { data } = await api.put<Booking>(`/bookings/${id}/approve`);
    return data;
  },

  // Rejeitar reserva
  async rejectBooking(id: string): Promise<Booking> {
    const { data } = await api.put<Booking>(`/bookings/${id}/reject`);
    return data;
  },
}; 