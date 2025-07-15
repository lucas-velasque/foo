'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  Building,
  Calendar,
  Users,
  CheckSquare,
  Plus,
  LogOut
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function SupplierPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'supplier')) {
      if (!window.location.pathname.includes('/auth/login-supplier')) {
        router.push('/auth/login-supplier');
      }
    }
  }, [isAuthenticated, user, router, isLoading]);

  const handleLogout = () => {
    logout();
  };

  const modules = [
    {
      title: 'Minhas Propriedades',
      description: 'Gerenciar propriedades disponíveis para aluguel',
      icon: Building,
      href: '/properties',
      color: 'bg-blue-500',
    },
    {
      title: 'Solicitações de Reserva',
      description: 'Ver e gerenciar solicitações de reserva',
      icon: Calendar,
      href: '/bookings',
      color: 'bg-green-500',
    },
    {
      title: 'Hóspedes',
      description: 'Visualizar informações dos hóspedes',
      icon: Users,
      href: '/users',
      color: 'bg-purple-500',
    },
    {
      title: 'Tarefas',
      description: 'Gerenciar tarefas e trabalhos',
      icon: CheckSquare,
      href: '/tasks',
      color: 'bg-yellow-500',
    },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!isAuthenticated || user?.role !== 'supplier') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">Painel do Fornecedor</h1>
              <p className="text-green-100">Bem-vindo, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-100">Fornecedor</span>
              <Button
                onClick={handleLogout}
                className="bg-green-700 hover:bg-green-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Gerenciar Propriedades e Reservas
          </h2>
          <p className="text-gray-600">
            Aqui você pode gerenciar suas propriedades, visualizar solicitações de reserva 
            e acompanhar os hóspedes que trabalharão em troca da hospedagem.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/properties">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Propriedade
                </Button>
              </Link>
              <Link href="/bookings">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Solicitações
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
                <div className={`${module.color} rounded-lg p-3 w-fit mb-4`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {module.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Como Funciona
            </h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• Cadastre suas propriedades disponíveis</li>
              <li>• Defina as datas e horários de trabalho</li>
              <li>• Receba solicitações de reserva</li>
              <li>• Aprove ou rejeite as solicitações</li>
              <li>• Acompanhe o trabalho dos hóspedes</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Benefícios
            </h3>
            <ul className="text-green-800 space-y-2 text-sm">
              <li>• Receba ajuda com tarefas domésticas</li>
              <li>• Contribua para a assistência social</li>
              <li>• Gerencie suas propriedades facilmente</li>
              <li>• Controle total sobre as reservas</li>
              <li>• Sistema seguro e confiável</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 