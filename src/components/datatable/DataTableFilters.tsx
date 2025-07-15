'use client';

import React from 'react';

interface FilterProps {
  filters: {
    name: string;
    location: string;
    payment_type: string;
    availability_period: string;
    is_active: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const DataTableFilters: React.FC<FilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Limpar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Filtro por Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filtro por Localização */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Localização
          </label>
          <input
            type="text"
            id="location"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="Buscar por localização..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filtro por Tipo de Pagamento */}
        <div>
          <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Pagamento
          </label>
          <select
            id="payment_type"
            value={filters.payment_type}
            onChange={(e) => onFilterChange('payment_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos</option>
            <option value="work_hours">Horas de Trabalho</option>
            <option value="money">Dinheiro</option>
            <option value="mixed">Misto</option>
          </select>
        </div>

        {/* Filtro por Período de Disponibilidade */}
        <div>
          <label htmlFor="availability_period" className="block text-sm font-medium text-gray-700 mb-1">
            Período
          </label>
          <select
            id="availability_period"
            value={filters.availability_period}
            onChange={(e) => onFilterChange('availability_period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos</option>
            <option value="nightly">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>

        {/* Filtro por Status */}
        <div>
          <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="is_active"
            value={filters.is_active}
            onChange={(e) => onFilterChange('is_active', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DataTableFilters;

