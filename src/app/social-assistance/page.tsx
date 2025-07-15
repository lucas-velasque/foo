'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { socialAssistanceService } from '@/services/socialAssistanceService';
import { SocialAssistance, UserRole } from '@/types';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const SocialAssistancePage: React.FC = () => {
  const { user: currentUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [assistances, setAssistances] = useState<SocialAssistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssistance, setEditingAssistance] = useState<SocialAssistance | null>(null);
  const [form, setForm] = useState<Partial<SocialAssistance>>({ 
    ong_name: '', 
    contact_person: '', 
    contact_email: '', 
    contact_phone: '', 
    description: '' 
  });

  const resetForm = () => {
    console.log('Resetting form');
    setForm({ 
      ong_name: '', 
      contact_person: '', 
      contact_email: '', 
      contact_phone: '', 
      description: '' 
    });
  };

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSupplier = currentUser?.role === UserRole.SUPPLIER;
  const isUser = currentUser?.role === UserRole.USER;

  useEffect(() => {
    console.log('useEffect triggered - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);
    if (authLoading) return;
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    console.log('Fetching social assistances...');
    
    // Assistência social é pública - todos podem ver todas as ONGs
    socialAssistanceService.getSocialAssistances()
      .then((data) => {
        console.log('Fetched social assistances:', data);
        setAssistances(data || []);
      })
      .catch((error: any) => {
        console.error('Erro ao buscar assistências:', error);
        setError('Erro ao buscar assistências');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir esta assistência?')) return;
    try {
      await socialAssistanceService.deleteSocialAssistance(id);
      setAssistances(as => {
        console.log('Previous assistances:', as);
        const updated = as.filter(r => r.id !== id);
        console.log('Updated assistances after delete:', updated);
        return updated;
      });
      toast.success('Assistência excluída!');
    } catch (error: any) {
      console.error('Erro ao excluir assistência:', error);
      toast.error(error.response?.data?.message || 'Erro ao excluir assistência');
    }
  };

  const handleEdit = (assistance: SocialAssistance) => {
    console.log('Editing assistance:', assistance);
    setEditingAssistance(assistance);
    setForm({
      ong_name: assistance.ong_name || '',
      contact_person: assistance.contact_person || '',
      contact_email: assistance.contact_email || '',
      contact_phone: assistance.contact_phone || '',
      description: assistance.description || '',
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', form);
    
    // Validar campos obrigatórios
    if (!form.ong_name?.trim() || !form.contact_person?.trim() || !form.contact_email?.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      if (editingAssistance) {
        console.log('Updating assistance with ID:', editingAssistance.id);
        const updatedAssistance = await socialAssistanceService.updateSocialAssistance(editingAssistance.id, form);
        console.log('Updated assistance:', updatedAssistance);
        setAssistances(as => {
          console.log('Previous assistances:', as);
          const updated = as.map(a => a.id === editingAssistance.id ? updatedAssistance : a);
          console.log('Updated assistances:', updated);
          return updated;
        });
        toast.success('Assistência atualizada!');
      } else {
        console.log('Creating new assistance');
        const newAssistance = await socialAssistanceService.createSocialAssistance(form);
        console.log('Created assistance:', newAssistance);
        setAssistances(as => {
          console.log('Previous assistances:', as);
          const updated = [...as, newAssistance];
          console.log('Updated assistances:', updated);
          return updated;
        });
        toast.success('Assistência criada!');
      }
      setShowForm(false);
      setEditingAssistance(null);
      resetForm();
    } catch (error: any) {
      console.error('Erro ao salvar assistência:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao salvar assistência';
      toast.error(errorMessage);
    }
  };

  console.log('Render state:', { 
    authLoading, 
    isAuthenticated, 
    loading, 
    assistances: assistances.length, 
    showForm, 
    editingAssistance: !!editingAssistance,
    form
  });

  if (authLoading) return <div>Carregando autenticação...</div>;
  if (!isAuthenticated) return <div>Você precisa estar logado para acessar esta página.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Assistências Sociais</h1>
      <p className="text-gray-600 mb-6">
        Lista de organizações não governamentais (ONGs) que oferecem assistência social.
      </p>
      
      {(isAdmin || isSupplier) && (
        <Button onClick={() => { 
          setShowForm(true); 
          setEditingAssistance(null); 
          resetForm();
          setError(null);
        }} className="mb-4">
          Nova ONG
        </Button>
      )}
      
      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg shadow space-y-2">
          <input 
            className="w-full border p-2 rounded" 
            placeholder="Nome da ONG" 
            value={form.ong_name || ''} 
            onChange={e => setForm(f => ({ ...f, ong_name: e.target.value }))} 
            required 
          />
          <input 
            className="w-full border p-2 rounded" 
            placeholder="Pessoa de Contato" 
            value={form.contact_person || ''} 
            onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} 
            required 
          />
          <input 
            className="w-full border p-2 rounded" 
            type="email" 
            placeholder="E-mail de Contato" 
            value={form.contact_email || ''} 
            onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} 
            required 
          />
          <input 
            className="w-full border p-2 rounded" 
            placeholder="Telefone de Contato" 
            value={form.contact_phone || ''} 
            onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} 
          />
          <textarea 
            className="w-full border p-2 rounded" 
            placeholder="Descrição" 
            value={form.description || ''} 
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
            rows={3} 
          />
          <div className="flex gap-2">
            <Button type="submit">{editingAssistance ? 'Atualizar' : 'Criar'}</Button>
            <Button type="button" variant="outline" onClick={() => { 
              setShowForm(false); 
              setEditingAssistance(null); 
              resetForm();
            }}>Cancelar</Button>
          </div>
        </form>
      )}
      
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ONG</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8">Carregando...</td></tr>
          ) : !assistances || assistances.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8">Nenhuma ONG encontrada</td></tr>
          ) : assistances.map((a) => (
            <tr key={a.id}>
              <td className="px-6 py-4 font-medium">{a.ong_name || 'N/A'}</td>
              <td className="px-6 py-4">{a.contact_person || 'N/A'}</td>
              <td className="px-6 py-4">{a.contact_email || 'N/A'}</td>
              <td className="px-6 py-4">{a.contact_phone || 'N/A'}</td>
              <td className="px-6 py-4">{a.description || 'N/A'}</td>
              <td className="px-6 py-4 text-right">
                {(isAdmin || isSupplier) && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(a)}>Editar</Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>Excluir</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
};

export default SocialAssistancePage; 