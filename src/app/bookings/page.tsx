'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/bookingService';
import { Booking, BookingStatus, UserRole } from '@/types';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';
import BookingForm from '@/components/bookings/BookingForm';

const BookingsPage: React.FC = () => {
  const { user: currentUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Permissões
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSupplier = currentUser?.role === UserRole.SUPPLIER;
  const isUser = currentUser?.role === UserRole.USER;

  // Buscar reservas
  React.useEffect(() => {
    setLoading(true);
    bookingService.getBookings()
      .then(setBookings)
      .catch(() => setError('Erro ao buscar reservas'))
      .finally(() => setLoading(false));
  }, []);

  // Handlers CRUD
  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir esta reserva?')) return;
    try {
      await bookingService.deleteBooking(id);
      setBookings(b => b.filter(r => r.id !== id));
      toast.success('Reserva excluída!');
    } catch {
      toast.error('Erro ao excluir reserva');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Recarregar a lista de reservas
    bookingService.getBookings()
      .then(setBookings)
      .catch(() => setError('Erro ao buscar reservas'));
    toast.success('Reserva criada!');
  };

  const handleApprove = async (id: string) => {
    try {
      await bookingService.approveBooking(id);
      setBookings(b => b.map(r => r.id === id ? { ...r, status: BookingStatus.APPROVED } : r));
      toast.success('Reserva aprovada!');
    } catch {
      toast.error('Erro ao aprovar reserva');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await bookingService.rejectBooking(id);
      setBookings(b => b.map(r => r.id === id ? { ...r, status: BookingStatus.REJECTED } : r));
      toast.success('Reserva rejeitada!');
    } catch {
      toast.error('Erro ao rejeitar reserva');
    }
  };

  if (authLoading) return <div>Carregando autenticação...</div>;
  if (!isAuthenticated) return <div>Você precisa estar logado para acessar esta página.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Reservas</h1>
      
      {isUser && (
        <Button onClick={() => setShowForm(true)} className="mb-4">
          Nova Reserva
        </Button>
      )}
      
      {showForm && (
        <div className="mb-6">
          <BookingForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propriedade</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas de Serviço</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8">Carregando...</td></tr>
          ) : bookings.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8">Nenhuma reserva encontrada</td></tr>
          ) : bookings.map((b) => (
            <tr key={b.id}>
              <td className="px-6 py-4">{b.property?.name || b.property_id}</td>
              <td className="px-6 py-4">{b.guest?.name || b.guest_id}</td>
              <td className="px-6 py-4">{b.number_of_days} dias</td>
              <td className="px-6 py-4">{b.work_hours_offered} horas de serviço</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  b.status === BookingStatus.APPROVED ? 'bg-green-100 text-green-800' :
                  b.status === BookingStatus.REJECTED ? 'bg-red-100 text-red-800' :
                  b.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {b.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right flex gap-2 justify-end">
                {(isUser && b.guest_id === currentUser?.id && b.status === BookingStatus.PENDING) && (
                  <Button variant="danger" size="sm" onClick={() => handleDelete(b.id)}>
                    Excluir
                  </Button>
                )}
                {(isAdmin || isSupplier) && b.status === BookingStatus.PENDING && (
                  <>
                    <Button variant="primary" size="sm" onClick={() => handleApprove(b.id)}>
                      Aprovar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleReject(b.id)}>
                      Rejeitar
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
};

export default BookingsPage; 