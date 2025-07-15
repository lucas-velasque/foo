'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { workCreditsService } from '@/services/workCreditsService';
import { WorkCredit, UserRole, CreateWorkCreditDto, UpdateWorkCreditDto, CreditType, User } from '@/types';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

export default function WorkCreditsPage() {
  const { user: currentUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<WorkCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCredit, setEditingCredit] = useState<WorkCredit | null>(null);
  const [form, setForm] = useState<CreateWorkCreditDto>({ 
    user_id: '',
    type: CreditType.EARNED,
    hours: 0,
    description: '',
    date: new Date().toISOString()
  });
  const [users, setUsers] = useState<User[]>([]);

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSupplier = currentUser?.role === UserRole.SUPPLIER;
  const isUser = currentUser?.role === UserRole.USER;

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    
    let fetchPromise;
    if (isAdmin || isSupplier) {
      fetchPromise = workCreditsService.getWorkCredits();
    } else {
      fetchPromise = workCreditsService.getMyWorkCredits();
    }
    
    fetchPromise.then((data) => {
      setCredits(data);
    }).catch((error) => {
      console.error('Erro ao carregar créditos:', error);
      setError('Erro ao buscar créditos de serviço');
    }).finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin, isSupplier, currentUser]);

  // Carregar usuários para o admin
  useEffect(() => {
    if (isAdmin) {
      // Importar o serviço de usuários dinamicamente para evitar dependência circular
      import('@/services/userService').then(({ userService }) => {
        userService.getUsers().then((data) => {
          setUsers(data);
        }).catch((error) => {
          console.error('Erro ao carregar usuários:', error);
        });
      });
    }
  }, [isAdmin]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir este crédito de serviço?')) return;
    try {
      await workCreditsService.deleteWorkCredit(id);
      setCredits(c => c.filter(r => r.id !== id));
      toast.success('Crédito de serviço excluído!');
    } catch {
      toast.error('Erro ao excluir crédito de serviço');
    }
  };

  const handleEdit = (credit: WorkCredit) => {
    setEditingCredit(credit);
    setForm({
      user_id: credit.user_id,
      type: credit.type,
      hours: credit.hours,
      description: credit.description,
      date: typeof credit.date === 'string' ? credit.date : new Date(credit.date).toISOString(),
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCredit) {
        const updateData: UpdateWorkCreditDto = {
          type: form.type,
          hours: form.hours,
          description: form.description,
          date: form.date,
        };
        await workCreditsService.updateWorkCredit(editingCredit.id, updateData);
        setCredits(cs => cs.map(c => c.id === editingCredit.id ? { ...c, ...updateData } : c));
        toast.success('Crédito de serviço atualizado!');
      } else {
        const createData: CreateWorkCreditDto = {
          ...form,
          user_id: isAdmin ? form.user_id : (currentUser?.id || ''),
        };
        const newCredit = await workCreditsService.createWorkCredit(createData);
        setCredits(cs => [...cs, newCredit]);
        toast.success('Crédito de serviço criado!');
      }
      setShowForm(false);
      setEditingCredit(null);
      setForm({ user_id: '', type: CreditType.EARNED, hours: 0, description: '', date: new Date().toISOString() });
    } catch {
      toast.error('Erro ao salvar crédito de serviço');
    }
  };

  const getCreditTypeLabel = (type: string) => {
    switch (type) {
      case CreditType.EARNED:
        return 'Ganho';
      case CreditType.REDEEMED:
        return 'Resgatado';
      case CreditType.PURCHASED:
        return 'Comprado';
      case CreditType.ADJUSTMENT_ADD:
        return 'Ajuste +';
      case CreditType.ADJUSTMENT_SUBTRACT:
        return 'Ajuste -';
      case CreditType.EXPIRATION:
        return 'Expirado';
      case CreditType.TRANSFER_SENT:
        return 'Transferido';
      case CreditType.TRANSFER_RECEIVED:
        return 'Recebido';
      default:
        return type;
    }
  };

  const getBalance = (credit: WorkCredit) => {
    return credit.hours;
  };

  const getTotalEarned = () => {
    return credits
      .filter(c => c.type === CreditType.EARNED || c.type === CreditType.PURCHASED || c.type === CreditType.ADJUSTMENT_ADD || c.type === CreditType.TRANSFER_RECEIVED)
      .reduce((total, credit) => total + credit.hours, 0);
  };

  const getTotalUsed = () => {
    return credits
      .filter(c => c.type === CreditType.REDEEMED || c.type === CreditType.ADJUSTMENT_SUBTRACT || c.type === CreditType.EXPIRATION || c.type === CreditType.TRANSFER_SENT)
      .reduce((total, credit) => total + credit.hours, 0);
  };

  if (authLoading) return <div>Carregando autenticação...</div>;
  if (!isAuthenticated) return <div>Você precisa estar logado para acessar esta página.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Créditos de Serviço</h1>
      
      {/* Resumo para usuários */}
      {isUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Seu Saldo de Créditos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getTotalEarned()}h
              </div>
              <div className="text-sm text-blue-700">Total Ganho</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {getTotalUsed()}h
              </div>
              <div className="text-sm text-red-700">Total Usado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getTotalEarned() - getTotalUsed()}h
              </div>
              <div className="text-sm text-green-700">Saldo Disponível</div>
            </div>
          </div>
        </div>
      )}

      {(isAdmin || isSupplier) && (
        <Button 
          onClick={() => { 
            setShowForm(true); 
            setEditingCredit(null); 
            setForm({ user_id: '', type: CreditType.EARNED, hours: 0, description: '', date: new Date().toISOString() }); 
          }} 
          className="mb-4"
        >
          Novo Crédito de Serviço
        </Button>
      )}

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg shadow space-y-4">
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário
              </label>
              <select 
                className="w-full border p-2 rounded" 
                value={form.user_id} 
                onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))} 
                required
              >
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Crédito de Serviço
            </label>
            <select 
              className="w-full border p-2 rounded" 
              value={form.type} 
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))} 
              required
            >
              <option value={CreditType.EARNED}>Ganho</option>
              <option value={CreditType.REDEEMED}>Resgatado</option>
              <option value={CreditType.PURCHASED}>Comprado</option>
              <option value={CreditType.ADJUSTMENT_ADD}>Ajuste +</option>
              <option value={CreditType.ADJUSTMENT_SUBTRACT}>Ajuste -</option>
              <option value={CreditType.EXPIRATION}>Expirado</option>
              <option value={CreditType.TRANSFER_SENT}>Transferido</option>
              <option value={CreditType.TRANSFER_RECEIVED}>Recebido</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas
            </label>
            <input 
              className="w-full border p-2 rounded" 
              type="number" 
              placeholder="0" 
              value={form.hours} 
              onChange={e => setForm(f => ({ ...f, hours: Number(e.target.value) }))} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input 
              className="w-full border p-2 rounded" 
              type="text" 
              placeholder="Descrição do crédito de serviço" 
              value={form.description} 
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
              required 
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit">{editingCredit ? 'Atualizar' : 'Criar'}</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingCredit(null); }}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
            {isAdmin && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr><td colSpan={isAdmin ? 6 : 5} className="text-center py-8">Carregando...</td></tr>
          ) : credits.length === 0 ? (
            <tr><td colSpan={isAdmin ? 6 : 5} className="text-center py-8">Nenhum crédito de serviço encontrado</td></tr>
          ) : credits.map((c) => (
            <tr key={c.id}>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {getCreditTypeLabel(c.type)}
                </span>
              </td>
              <td className="px-6 py-4 font-medium">{c.hours}h</td>
              <td className="px-6 py-4">{c.description}</td>
              <td className="px-6 py-4">{new Date(c.date).toLocaleDateString()}</td>
              {isAdmin && (
                <td className="px-6 py-4">{c.user?.name || 'N/A'}</td>
              )}
              <td className="px-6 py-4 text-right">
                {(isAdmin || isSupplier) && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>Editar</Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>Excluir</Button>
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
} 