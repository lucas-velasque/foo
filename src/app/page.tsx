'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Home, 
  Calendar, 
  Heart, 
  CreditCard, 
  CheckSquare, 
  LogOut,
  Building
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/users');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
  };

  const modules = [
    {
      title: 'Usuários',
      description: 'Gerenciar usuários do sistema',
      icon: Users,
      href: '/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Propriedades',
      description: 'Cadastrar e gerenciar imóveis',
      icon: Building,
      href: '/properties',
      color: 'bg-green-500',
    },
    {
      title: 'Agendamentos',
      description: 'Controle de visitas e reservas',
      icon: Calendar,
      href: '/bookings',
      color: 'bg-purple-500',
    },
    {
      title: 'Assistência Social',
      description: 'Programas de assistência social',
      icon: Heart,
      href: '/social-assistance',
      color: 'bg-red-500',
    },
    {
      title: 'Créditos de Trabalho',
      description: 'Sistema de créditos e benefícios',
      icon: CreditCard,
      href: '/work-credits',
      color: 'bg-yellow-500',
    },
    {
      title: 'Tarefas',
      description: 'Gerenciamento de tarefas',
      icon: CheckSquare,
      href: '/tasks',
      color: 'bg-indigo-500',
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Aluguel Social
              </h1>
              <p className="text-sm text-gray-600">
                Bem-vindo, {user?.name}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Módulos do Sistema
            </h2>
            <p className="text-gray-600">
              Selecione um módulo para acessar suas funcionalidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Link
                  key={module.title}
                  href={module.href}
                  className="block group"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                      <div className={`${module.color} p-3 rounded-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Estatísticas Rápidas */}
          <div className="mt-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Resumo do Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Usuários</p>
                    <p className="text-lg font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Propriedades</p>
                    <p className="text-lg font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Agendamentos</p>
                    <p className="text-lg font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Assistências</p>
                    <p className="text-lg font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 