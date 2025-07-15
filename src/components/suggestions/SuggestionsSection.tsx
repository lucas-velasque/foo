'use client';

import React, { useState } from 'react';
import SuggestionForm from './SuggestionForm';
import SuggestionList from './SuggestionList';

const SuggestionsSection: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuggestionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Sugestões de Melhoria
        </h1>
        <p className="text-gray-600">
          Compartilhe suas ideias para melhorar a experiência nos hotéis que você visitou
        </p>
      </div>

      {/* Formulário de sugestão */}
      <SuggestionForm onSuggestionAdded={handleSuggestionAdded} />

      {/* Lista de sugestões */}
      <SuggestionList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default SuggestionsSection;

