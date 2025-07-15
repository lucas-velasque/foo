'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { propertyService } from '../../services/propertyService';
import { Property } from '../../types';

interface BookingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BookingForm({ onSuccess, onCancel }: BookingFormProps) {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    property_id: '',
    number_of_days: 1,
    work_hours_offered: 4,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('[FRONT] Buscando propriedades...');
        const data = await propertyService.getProperties();
        console.log('[FRONT] Propriedades carregadas:', data);
        setProperties(data);
      } catch (err) {
        console.error('Erro ao carregar propriedades:', err);
        setError('Erro ao carregar propriedades');
      }
    };

    fetchProperties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('[FRONT] Enviando reserva:', formData);
    console.log('[FRONT] Usuário atual:', user);
    console.log('[FRONT] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
    
    try {
      const result = await bookingService.createBooking(formData);
      console.log('[FRONT] Reserva criada com sucesso:', result);
      setFormData({
        property_id: '',
        number_of_days: 1,
        work_hours_offered: 4,
      });
      onSuccess?.();
    } catch (err: any) {
      console.error('[FRONT] Erro ao criar reserva:', err);
      console.error('[FRONT] Detalhes do erro:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      setError(err.message || 'Erro ao criar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_days' || name === 'work_hours_offered' ? parseInt(value) : value,
    }));
  };

  const hasProperties = properties.length > 0;

  if (!user) {
    return <div className="text-center p-4">Faça login para criar uma reserva.</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Nova Reserva</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="property_id" className="block text-sm font-medium text-gray-700 mb-1">
            Propriedade *
          </label>
          <select
            id="property_id"
            name="property_id"
            value={formData.property_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!hasProperties}
          >
            <option value="">Selecione uma propriedade</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name} - {property.location}
              </option>
            ))}
          </select>
          {!hasProperties && (
            <div className="text-red-600 text-sm mt-2">Nenhuma propriedade disponível para reserva.</div>
          )}
        </div>

        <div>
          <label htmlFor="number_of_days" className="block text-sm font-medium text-gray-700 mb-1">
            Número de Dias *
          </label>
          <input
            type="number"
            id="number_of_days"
            name="number_of_days"
            min="1"
            value={formData.number_of_days}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="work_hours_offered" className="block text-sm font-medium text-gray-700 mb-1">
            Horas de Trabalho Oferecidas
          </label>
          <input
            type="number"
            id="work_hours_offered"
            name="work_hours_offered"
            min="1"
            value={formData.work_hours_offered}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading || !hasProperties}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Reserva'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 