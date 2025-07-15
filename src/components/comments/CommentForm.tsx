'use client';

import React, { useState } from 'react';
import { commentsApi } from '../../api';

interface CommentFormProps {
  onCommentAdded: () => void;
}

export default function CommentForm({ onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('O comentário não pode estar vazio');
      return;
    }

    if (content.length > 1000) {
      setError('O comentário não pode ter mais de 1000 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await commentsApi.createComment({ content: content.trim() });
      
      if (response.success) {
        setContent('');
        onCommentAdded();
      } else {
        setError(response.error || 'Erro ao criar comentário');
      }
    } catch (err) {
      setError('Erro ao criar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Comentário</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva seu comentário aqui..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {content.length}/1000 caracteres
            </span>
            {error && (
              <span className="text-sm text-red-500">{error}</span>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
        </button>
      </form>
    </div>
  );
}

