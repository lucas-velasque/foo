'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { propertyService } from '@/services/propertyService';
import { Property, PaymentType, AvailabilityPeriod, PropertyFilters } from '@/types';
import Button from '@/components/common/Button';
import { Search, MapPin, Calendar, Clock, DollarSign, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const PropertySearchPage: React.FC = () => {
  const { user: currentUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState<PropertyFilters>({
    location: '',
    payment_type: undefined,
    availability_period: undefined,
    min_price: undefined,
    max_price: undefined,
    is_active: true,
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    loadProperties();
  }, [isAuthenticated]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getProperties();
      setProperties(data);
    } catch (err) {
      setError('Erro ao carregar propriedades');
      toast.error('Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implementar busca com filtros

  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      payment_type: undefined,
      availability_period: undefined,
      min_price: undefined,
      max_price: undefined,
      is_active: true,
    });
    setSearchQuery('');
  };

  const filteredProperties = properties.filter(property => {
    // Filtro por busca
    if (searchQuery && !property.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filtro por localização
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Filtro por tipo de pagamento
    if (filters.payment_type && property.payment_type !== filters.payment_type) {
      return false;
    }

    // Filtro por período de disponibilidade
    if (filters.availability_period && property.availability_period !== filters.availability_period) {
      return false;
    }

    // Filtro por preço mínimo
    if (filters.min_price && (property.price || 0) < filters.min_price) {
      return false;
    }

    // Filtro por preço máximo
    if (filters.max_price && (property.price || 0) > filters.max_price) {
      return false;
    }

    // Filtro por propriedades ativas
    if (filters.is_active && !property.is_active) {
      return false;
    }

    return true;
  });

  const getPaymentTypeLabel = (type: PaymentType) => {
    switch (type) {
      case PaymentType.WORK_HOURS:
        return 'Apenas Trabalho';
      case PaymentType.MONEY:
        return 'Apenas Dinheiro';
      case PaymentType.MIXED:
        return 'Trabalho + Dinheiro';
      default:
        return type;
    }
  };

  const getAvailabilityPeriodLabel = (period: AvailabilityPeriod) => {
    switch (period) {
      case AvailabilityPeriod.NIGHTLY:
        return 'Por Noite';
      case AvailabilityPeriod.WEEKLY:
        return 'Por Semana';
      case AvailabilityPeriod.MONTHLY:
        return 'Por Mês';
      default:
        return period;
    }
  };

  if (authLoading) return <div>Carregando autenticação...</div>;
  if (!isAuthenticated) return <div>Você precisa estar logado para acessar esta página.</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar Propriedades</h1>
        <p className="text-gray-600">
          Encontre propriedades disponíveis para aluguel em troca de trabalho ou pagamento
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros de Busca</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Busca geral */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nome ou localização..."
                className="pl-10 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              />
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Centro, Praia..."
                className="pl-10 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              />
            </div>
          </div>

          {/* Tipo de pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Pagamento
            </label>
            <select
              value={filters.payment_type || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, payment_type: e.target.value as PaymentType || undefined }))}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value="">Todos</option>
              <option value={PaymentType.WORK_HOURS}>Apenas Trabalho</option>
              <option value={PaymentType.MONEY}>Apenas Dinheiro</option>
              <option value={PaymentType.MIXED}>Trabalho + Dinheiro</option>
            </select>
          </div>

          {/* Período de disponibilidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={filters.availability_period || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, availability_period: e.target.value as AvailabilityPeriod || undefined }))}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value="">Todos</option>
              <option value={AvailabilityPeriod.NIGHTLY}>Por Noite</option>
              <option value={AvailabilityPeriod.WEEKLY}>Por Semana</option>
              <option value={AvailabilityPeriod.MONTHLY}>Por Mês</option>
            </select>
          </div>
        </div>

        {/* Filtros de preço */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço Mínimo (R$)
            </label>
            <input
              type="number"
              value={filters.min_price || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço Máximo (R$)
            </label>
            <input
              type="number"
              value={filters.max_price || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="1000.00"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleResetFilters}>
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Resultados ({filteredProperties.length} propriedades encontradas)
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando propriedades...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-8">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhuma propriedade encontrada com os filtros aplicados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    property.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{property.location}</span>
                  </div>

                  {property.description && (
                    <p className="text-gray-600 text-sm">{property.description}</p>
                  )}

                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{property.daily_work_hours_required}h de trabalho</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{getAvailabilityPeriodLabel(property.availability_period)}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{getPaymentTypeLabel(property.payment_type)}</span>
                    {property.price && property.price > 0 && (
                      <span className="ml-2 font-semibold">R$ {property.price.toFixed(2)}</span>
                    )}
                  </div>

                  {property.available_dates && property.available_dates.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Datas disponíveis:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {property.available_dates.slice(0, 3).map((date, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {new Date(date).toLocaleDateString('pt-BR')}
                          </span>
                        ))}
                        {property.available_dates.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{property.available_dates.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-2">
                  <Button className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Solicitar Reserva
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertySearchPage; 