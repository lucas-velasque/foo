'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { propertiesApi } from '../../api';
import DataTableFilters from './DataTableFilters';
import DataTablePagination from './DataTablePagination';

interface Property {
  id: string;
  name: string;
  location: string;
  payment_type: string;
  availability_period: string;
  daily_work_hours_required: number;
  price?: number;
  is_active: boolean;
  has_pending_bookings?: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

interface PropertiesResponse {
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const PropertiesDataTable: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    name: '',
    location: '',
    payment_type: '',
    availability_period: '',
    is_active: '',
  });

  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    sort_order: 'DESC' as 'ASC' | 'DESC',
  });

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        ...sortConfig,
      };

      const response = await propertiesApi.getAllProperties(queryParams);

      if (response.success && response.data) {
        const data = response.data as PropertiesResponse;
        setProperties(data.data);
        setPagination(data.pagination);
      } else {
        setError(response.error || 'Erro ao carregar propriedades');
      }
    } catch (err) {
      setError('Erro ao carregar propriedades');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, sortConfig]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      location: '',
      payment_type: '',
      availability_period: '',
      is_active: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSort = (column: string) => {
    setSortConfig(prev => ({
      sort_by: column,
      sort_order: prev.sort_by === column && prev.sort_order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta propriedade?')) {
      return;
    }

    try {
      const response = await propertiesApi.deleteProperty(id);
      if (response.success) {
        loadProperties(); // Reload the data
      } else {
        alert(response.error || 'Erro ao excluir propriedade');
      }
    } catch (err) {
      alert('Erro ao excluir propriedade');
      console.error('Erro:', err);
    }
  };

  const formatPaymentType = (type: string) => {
    const types = {
      work_hours: 'Horas de Trabalho',
      money: 'Dinheiro',
      mixed: 'Misto',
    };
    return types[type as keyof typeof types] || type;
  };

  const formatAvailabilityPeriod = (period: string) => {
    const periods = {
      nightly: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
    };
    return periods[period as keyof typeof periods] || period;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getSortIcon = (column: string) => {
    if (sortConfig.sort_by !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortConfig.sort_order === 'ASC' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading && properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando propriedades...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Gerenciar Propriedades
        </h1>
        <p className="text-gray-600">
          Visualize, filtre e gerencie todas as propriedades do sistema
        </p>
      </div>

      <DataTableFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nome</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Localização</span>
                    {getSortIcon('location')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proprietário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Criado em</span>
                    {getSortIcon('created_at')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {property.name}
                    </div>
                    {property.has_pending_bookings && (
                      <div className="text-xs text-orange-600 font-medium">
                        Reservas pendentes
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.owner.name}</div>
                    <div className="text-xs text-gray-500">{property.owner.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPaymentType(property.payment_type)}
                    </div>
                    {property.price && (
                      <div className="text-xs text-gray-500">
                        R$ {property.price.toFixed(2)}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {property.daily_work_hours_required}h/dia
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatAvailabilityPeriod(property.availability_period)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {property.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(property.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => alert(`Visualizar propriedade: ${property.name}`)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Visualizar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => alert(`Editar propriedade: ${property.name}`)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Excluir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {properties.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 3h10M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 21h6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Nenhuma propriedade encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou adicionar novas propriedades ao sistema.
            </p>
          </div>
        )}

        <DataTablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {loading && properties.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Atualizando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesDataTable;

