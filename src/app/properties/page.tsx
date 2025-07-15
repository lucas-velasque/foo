'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { propertyService } from '@/services/propertyService';
import { Property, CreatePropertyDto, UserRole, PaymentType, AvailabilityPeriod } from '@/types';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const PropertiesPage: React.FC = () => {
  const { user: currentUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [form, setForm] = useState<CreatePropertyDto>({
    name: '',
    location: '',
    description: '',
    price: 0,
    payment_type: PaymentType.MONEY,
    availability_period: AvailabilityPeriod.NIGHTLY,
    daily_work_hours_required: 4,
    is_active: true,
  });

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSupplier = currentUser?.role === UserRole.SUPPLIER;

  // Debug logs
  console.log('[PROPERTIES PAGE] User:', currentUser);
  console.log('[PROPERTIES PAGE] Is authenticated:', isAuthenticated);
  console.log('[PROPERTIES PAGE] Is admin:', isAdmin);
  console.log('[PROPERTIES PAGE] Is supplier:', isSupplier);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    propertyService.getProperties()
      .then(setProperties)
      .catch(() => setError('Erro ao buscar propriedades'))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    console.log('[PROPERTIES PAGE] handleDelete chamado com ID:', id);
    if (!window.confirm('Deseja excluir esta propriedade?')) return;
    try {
      await propertyService.deleteProperty(id);
      setProperties(p => p.filter(r => r.id !== id));
      toast.success('Propriedade excluída!');
    } catch (error) {
      console.error('[PROPERTIES PAGE] Erro ao excluir propriedade:', error);
      toast.error('Erro ao excluir propriedade');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setForm({
      name: property.name,
      location: property.location,
      description: property.description || '',
      price: property.price || 0,
      payment_type: property.payment_type,
      availability_period: property.availability_period,
      daily_work_hours_required: property.daily_work_hours_required || 4,
      is_active: property.is_active,
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[PROPERTIES PAGE] handleFormSubmit chamado');
    console.log('[PROPERTIES PAGE] Form data:', form);
    console.log('[PROPERTIES PAGE] Editing property:', editingProperty);
    try {
      if (editingProperty) {
        await propertyService.updateProperty(editingProperty.id, form);
        setProperties(props => props.map(p => p.id === editingProperty.id ? { ...p, ...form } : p));
        toast.success('Propriedade atualizada!');
      } else {
        const newProp = await propertyService.createProperty(form);
        setProperties(props => [...props, newProp]);
        toast.success('Propriedade criada!');
      }
      setShowForm(false);
      setEditingProperty(null);
      setForm({ name: '', location: '', description: '', price: 0, payment_type: PaymentType.MONEY, availability_period: AvailabilityPeriod.NIGHTLY, daily_work_hours_required: 4, is_active: true });
    } catch (error) {
      console.error('[PROPERTIES PAGE] Erro ao salvar propriedade:', error);
      toast.error('Erro ao salvar propriedade');
    }
  };

  if (authLoading) return <div>Carregando autenticação...</div>;
  if (!isAuthenticated) return <div>Você precisa estar logado para acessar esta página.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Propriedades</h1>
      {(isSupplier) && (
        <Button onClick={() => { setShowForm(true); setEditingProperty(null); setForm({ name: '', location: '', description: '', price: 0, payment_type: PaymentType.MONEY, availability_period: AvailabilityPeriod.NIGHTLY, daily_work_hours_required: 4, is_active: true }); }} className="mb-4">Nova Propriedade</Button>
      )}
      {showForm && isSupplier && (
        <form onSubmit={handleFormSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do imóvel</label>
            <input className="w-full border p-2 rounded" placeholder="Ex: Casa de Praia" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
            <input className="w-full border p-2 rounded" placeholder="Ex: Rua das Flores, 123" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input className="w-full border p-2 rounded" placeholder="Breve descrição do imóvel" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
            <input className="w-full border p-2 rounded" type="number" placeholder="Valor em reais" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pagamento</label>
            <select className="w-full border p-2 rounded" value={form.payment_type} onChange={e => setForm(f => ({ ...f, payment_type: e.target.value as PaymentType }))} required>
              <option value="money">Dinheiro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período de Disponibilidade</label>
            <select className="w-full border p-2 rounded" value={form.availability_period} onChange={e => setForm(f => ({ ...f, availability_period: e.target.value as AvailabilityPeriod }))} required>
              <option value="nightly">Por noite</option>
              <option value="monthly">Por mês</option>
              <option value="weekly">Por semana</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horas de serviço diárias</label>
            <input className="w-full border p-2 rounded" type="number" placeholder="Ex: 4" value={form.daily_work_hours_required ?? 4} onChange={e => setForm(f => ({ ...f, daily_work_hours_required: Number(e.target.value) }))} required />
            <p className="text-xs text-gray-500 mt-1">Quantidade de horas de serviço exigidas por dia de estadia.</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit">{editingProperty ? 'Atualizar' : 'Criar'}</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingProperty(null); }}>Cancelar</Button>
          </div>
        </form>
      )}
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Pagamento</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas de Serviço/Dia</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr><td colSpan={7} className="text-center py-8">Carregando...</td></tr>
          ) : properties.length === 0 ? (
            <tr><td colSpan={7} className="text-center py-8">Nenhuma propriedade encontrada</td></tr>
          ) : properties.map((p) => (
            <tr key={p.id}>
              <td className="px-6 py-4">{p.name}</td>
              <td className="px-6 py-4">{p.location}</td>
              <td className="px-6 py-4">R$ {p.price}</td>
              <td className="px-6 py-4">{p.payment_type}</td>
              <td className="px-6 py-4">{p.availability_period}</td>
              <td className="px-6 py-4">{p.daily_work_hours_required}</td>
              <td className="px-6 py-4 text-right">
                {isSupplier && p.owner_id === currentUser?.id && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(p)}>Editar</Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>Excluir</Button>
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

export default PropertiesPage; 