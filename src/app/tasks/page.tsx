'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { tasksService } from '@/services/tasksService';
import { propertyService } from '@/services/propertyService';
import { Task, UserRole, Property } from '@/types';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const TasksPage: React.FC = () => {
  const { user: currentUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<Partial<Task>>({ name: '', description: '' });
  const [properties, setProperties] = useState<Property[]>([]);

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSupplier = currentUser?.role === UserRole.SUPPLIER;
  const isUser = currentUser?.role === UserRole.USER;

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    const fetch = isAdmin || isSupplier
      ? tasksService.getTasks()
      : tasksService.searchTasks({ assignedTo: Number(currentUser?.id) });
    fetch.then(setTasks).catch(() => setError('Erro ao buscar tarefas')).finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin, isSupplier, currentUser]);

  useEffect(() => {
    if (!isAuthenticated) return;
    propertyService.getProperties().then(setProperties);
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir esta tarefa?')) return;
    try {
      await tasksService.deleteTask(id);
      setTasks(t => t.filter(r => r.id !== id));
      toast.success('Tarefa excluída!');
    } catch {
      toast.error('Erro ao excluir tarefa');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      name: task.name,
      description: task.description,
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const updatePayload = {
          name: form.name || editingTask.name,
          description: form.description || editingTask.description,
        };
        await tasksService.updateTask(editingTask.id, updatePayload);
        setTasks(ts => ts.map(t => t.id === editingTask.id ? { ...t, ...updatePayload } : t));
        toast.success('Tarefa atualizada!');
      } else {
        const newTask = await tasksService.createTask({ ...form });
        setTasks(ts => [...ts, newTask]);
        toast.success('Tarefa criada!');
      }
      setShowForm(false);
      setEditingTask(null);
      setForm({ name: '', description: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Erro ao salvar tarefa';
      setError(msg);
      toast.error(msg);
    }
  };

  if (authLoading) return <div>Carregando autenticação...</div>;
  if (!isAuthenticated) return <div>Você precisa estar logado para acessar esta página.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tarefas</h1>
      {(isAdmin || isSupplier || isUser) && (
        <Button onClick={() => { setShowForm(true); setEditingTask(null); setForm({ name: '', description: '' }); }} className="mb-4">Nova Tarefa</Button>
      )}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg shadow space-y-2">
          <input className="w-full border p-2 rounded" placeholder="Título" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <input className="w-full border p-2 rounded" placeholder="Descrição" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          {isAdmin && properties.length > 0 && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Propriedades disponíveis</label>
              <ul className="list-disc pl-5 text-sm">
                {properties.map((p) => (
                  <li key={p.id}>{p.name} - {p.location}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit">{editingTask ? 'Atualizar' : 'Criar'}</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingTask(null); }}>Cancelar</Button>
          </div>
        </form>
      )}
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Carregando...</td></tr>
          ) : tasks.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">Nenhuma tarefa encontrada</td></tr>
          ) : tasks.map((t) => (
            <tr key={t.id}>
              <td className="px-6 py-4">{t.name}</td>
              <td className="px-6 py-4">{t.description}</td>
              <td className="px-6 py-4 text-right">
                {(isAdmin || isSupplier) && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(t)}>Editar</Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>Excluir</Button>
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

export default TasksPage; 