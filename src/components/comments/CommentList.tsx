'use client';

import React, { useState } from 'react';
import { commentsApi } from '../../api';

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface CommentListProps {
  comments: Comment[];
  onCommentUpdated: () => void;
  currentUserId?: string;
}

export default function CommentList({ comments, onCommentUpdated, currentUserId }: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setError('');
  };

  const handleUpdate = async (commentId: string) => {
    if (!editContent.trim()) {
      setError('O comentário não pode estar vazio');
      return;
    }

    if (editContent.length > 1000) {
      setError('O comentário não pode ter mais de 1000 caracteres');
      return;
    }

    setIsUpdating(true);
    setError('');

    try {
      const response = await commentsApi.updateComment(commentId, { content: editContent.trim() });
      
      if (response.success) {
        setEditingId(null);
        setEditContent('');
        onCommentUpdated();
      } else {
        setError(response.error || 'Erro ao atualizar comentário');
      }
    } catch (err) {
      setError('Erro ao atualizar comentário');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) {
      return;
    }

    try {
      const response = await commentsApi.deleteComment(commentId);
      
      if (response.success) {
        onCommentUpdated();
      } else {
        alert(response.error || 'Erro ao deletar comentário');
      }
    } catch (err) {
      alert('Erro ao deletar comentário');
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

  if (comments.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Comentários ({comments.length})
      </h3>
      
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium text-gray-800">{comment.user.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                {formatDate(comment.createdAt)}
                {comment.updatedAt !== comment.createdAt && ' (editado)'}
              </span>
            </div>
            
            {currentUserId === comment.userId && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(comment)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Deletar
                </button>
              </div>
            )}
          </div>
          
          {editingId === comment.id ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {editContent.length}/1000 caracteres
                </span>
                {error && (
                  <span className="text-sm text-red-500">{error}</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(comment.id)}
                  disabled={isUpdating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                >
                  {isUpdating ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}

