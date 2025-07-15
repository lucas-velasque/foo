'use client';

import React, { useState, useEffect } from 'react';
import { suggestionsApi, propertiesApi } from '../../api';

interface Property {
  id: string;
  name: string;
  location: string;
}

interface SuggestionFormProps {
  onSuggestionAdded: () => void;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({ onSuggestionAdded }) => {
  const [content, setContent] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [visitedProperties, setVisitedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingProperties, setLoadingProperties] = useState(true);

  const maxLength = 1000;

  useEffect(() => {
    loadVisitedProperties();
  }, []);

  const loadVisitedProperties = async () => {
    try {
      setLoadingProperties(true);
      const response = await propertiesApi.getAllProperties();
      if (response.success && response.data) {
        setVisitedProperties(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar propriedades visitadas:', err);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Por favor, digite sua sugestão de melhoria.');
      return;
    }

    if (!selectedPropertyId) {
      setError('Por favor, selecione um hotel.');
      return;
    }

    if (content.length > maxLength) {
      setError(`A sugestão deve ter no máximo ${maxLength} caracteres.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await suggestionsApi.createSuggestion({
        content: content.trim(),
        propertyId: selectedPropertyId,
      });

      if (response.success) {
        setContent('');
        setSelectedPropertyId('');
        onSuggestionAdded();
      } else {
        setError(response.error || 'Erro ao enviar sugestão');
      }
    } catch (err) {
      setError('Erro ao enviar sugestão');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !content.trim() || !selectedPropertyId || loading;

  if (loadingProperties) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sugestões de Melhoria
        </h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Carregando hotéis visitados...</p>
        </div>
      </div>
    );
  }

  if (visitedProperties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sugestões de Melhoria
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 3h10M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 21h6" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Nenhum hotel visitado
          </h4>
          <p className="text-gray-600">
            Você só pode enviar sugestões de melhoria para hotéis que já visitou.
            <br />
            Faça uma reserva e complete sua estadia para poder sugerir melhorias!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Sugestões de Melhoria
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seleção de Hotel */}
        <div>
          <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o hotel visitado
          </label>
          <select
            id="property"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Escolha um hotel...</option>
            {visitedProperties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name} - {property.location}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de Sugestão */}
        <div>
          <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-2">
            Sua sugestão de melhoria
          </label>
          <textarea
            id="suggestion"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Descreva sua sugestão de melhoria para este hotel..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={maxLength}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-sm ${content.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/{maxLength} caracteres
            </span>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSubmitDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando...
            </div>
          ) : (
            'Enviar Sugestão'
          )}
        </button>
      </form>
    </div>
  );
};

export default SuggestionForm;

