'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../common/Button';
import { PaymentType, AvailabilityPeriod } from '../../properties/entities/property.entity';

const propertySchema = z.object({
  name: z.string().min(1, 'Nome da propriedade é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  description: z.string().optional(),
  daily_work_hours_required: z.number().min(1, 'Mínimo 1 hora').max(24, 'Máximo 24 horas'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0').optional(),
  payment_type: z.nativeEnum(PaymentType),
  availability_period: z.nativeEnum(AvailabilityPeriod),
  available_dates: z.array(z.string()).optional(),
  is_active: z.boolean(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

type PropertyFormProps = {
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PropertyFormData>;
  isLoading?: boolean;
};

export default function PropertyForm({ onSubmit, onCancel, initialData, isLoading }: PropertyFormProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(initialData?.available_dates || []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: initialData?.name || '',
      location: initialData?.location || '',
      description: initialData?.description || '',
      daily_work_hours_required: initialData?.daily_work_hours_required || 4,
      price: initialData?.price || 0,
      payment_type: initialData?.payment_type || PaymentType.WORK_HOURS,
      availability_period: initialData?.availability_period || AvailabilityPeriod.NIGHTLY,
      is_active: initialData?.is_active ?? true,
    },
  });

  const paymentType = watch('payment_type');
  const availabilityPeriod = watch('availability_period');

  const handleFormSubmit = async (data: PropertyFormData) => {
    await onSubmit({
      ...data,
      available_dates: selectedDates,
    });
  };

  const addDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDates(prev => [...prev, today]);
  };

  const removeDate = (index: number) => {
    setSelectedDates(prev => prev.filter((_, i) => i !== index));
  };

  const updateDate = (index: number, value: string) => {
    setSelectedDates(prev => prev.map((date, i) => i === index ? value : date));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {initialData ? 'Editar Propriedade' : 'Nova Propriedade'}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome da Propriedade *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              placeholder="Ex: Hotel Central, Pousada da Praia"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Localização *
            </label>
            <input
              {...register('location')}
              type="text"
              id="location"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              placeholder="Ex: Centro, Praia, Zona Sul"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              placeholder="Descreva a propriedade, comodidades, etc."
            />
          </div>
        </div>

        {/* Configurações de Pagamento */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Configurações de Pagamento</h3>
          
          <div>
            <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
              Tipo de Pagamento *
            </label>
            <select
              {...register('payment_type')}
              id="payment_type"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value={PaymentType.WORK_HOURS}>Apenas Horas de Trabalho</option>
              <option value={PaymentType.MONEY}>Apenas Dinheiro</option>
              <option value={PaymentType.MIXED}>Trabalho + Dinheiro</option>
            </select>
          </div>

          <div>
            <label htmlFor="daily_work_hours_required" className="block text-sm font-medium text-gray-700">
              Horas de Trabalho por Período *
            </label>
            <input
              {...register('daily_work_hours_required', { valueAsNumber: true })}
              type="number"
              id="daily_work_hours_required"
              min="1"
              max="24"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            />
            {errors.daily_work_hours_required && (
              <p className="mt-1 text-sm text-red-600">{errors.daily_work_hours_required.message}</p>
            )}
          </div>

          {(paymentType === PaymentType.MONEY || paymentType === PaymentType.MIXED) && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Preço em Dinheiro (R$)
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                id="price"
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Período de Disponibilidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Período de Disponibilidade</h3>
          
          <div>
            <label htmlFor="availability_period" className="block text-sm font-medium text-gray-700">
              Tipo de Período *
            </label>
            <select
              {...register('availability_period')}
              id="availability_period"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value={AvailabilityPeriod.NIGHTLY}>Por Noite</option>
              <option value={AvailabilityPeriod.WEEKLY}>Por Semana</option>
              <option value={AvailabilityPeriod.MONTHLY}>Por Mês</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datas Disponíveis
            </label>
            <div className="space-y-2">
              {selectedDates.map((date, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => updateDate(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeDate(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addDate}
                className="w-full"
              >
                Adicionar Data
              </Button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center">
            <input
              {...register('is_active')}
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Propriedade Ativa</span>
          </label>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1"
            loading={isLoading}
            disabled={isLoading}
          >
            {initialData ? 'Atualizar Propriedade' : 'Criar Propriedade'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
} 