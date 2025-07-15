'use client';

import React, { useState, useEffect } from 'react';
import { suggestionsApi } from '../../api';

interface User {
  id: string;
  name: string;
}

interface Property {
  id: string;
  name: string;
  location: string;
}

interface Suggestion {
  id: string;
  content: string;
  user: User;
  property: Property;
  createdAt: string;
  updatedAt: string;
}

interface SuggestionListProps {
  refreshTrigger: number;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ refreshTrigger }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSuggestions();
  }, [refreshTrigger]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await suggestionsApi.getSuggestions();
      
      if (response.success && response.data) {
        setSuggestions(response.data);
      } else {
        setError(response.error || 'Erro ao carregar sugestões');
      }
    } catch (err) {
      setError('Erro ao carregar sugestões');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sugestões de Melhoria
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sugestões de Melhoria
        </h3>
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">Erro ao carregar</h4>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSuggestions}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Sugestões de Melhoria ({suggestions.length})
      </h3>
      
      {suggestions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Nenhuma sugestão ainda
          </h4>
          <p className="text-gray-600">
            Seja o primeiro a enviar uma sugestão de melhoria!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {suggestion.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {suggestion.user.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {suggestion.property.name} - {suggestion.property.location}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(suggestion.createdAt)}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-gray-800 leading-relaxed">
                  {suggestion.content}
                </p>
              </div>
              
              {suggestion.updatedAt !== suggestion.createdAt && (
                <div className="mt-2 text-xs text-gray-500">
                  Editado em {formatDate(suggestion.updatedAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionList;

