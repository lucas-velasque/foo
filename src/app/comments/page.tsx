'use client';

import React, { useState, useEffect } from 'react';
import CommentsSection from '../../components/comments/CommentsSection';

export default function CommentsPage() {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentUserId('user-id-example');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Comentários</h1>
          <p className="mt-2 text-gray-600">
            Compartilhe suas opiniões e participe da discussão.
          </p>
        </div>
        
        <CommentsSection currentUserId={currentUserId} />
      </div>
    </div>
  );
}

