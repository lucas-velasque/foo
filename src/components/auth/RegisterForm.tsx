'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../common/Button';
import { userService } from '../../services/userService';
import { User, UserRole, CreateUserDto, UpdateUserDto } from '../../types';

const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  userType: z.enum(['user', 'supplier'], {
    required_error: 'Selecione o tipo de usuário',
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  role?: 'user' | 'supplier' | 'admin';
};

export default function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: role === 'supplier' ? 'supplier' : 'user',
    },
  });

  const selectedUserType = watch('userType');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setSuccess('');
      
      // Determinar o role baseado na seleção do usuário
      const finalRole = data.userType === 'supplier' ? UserRole.SUPPLIER : UserRole.USER;
      
      await userService.createUser({ 
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        password: data.password,
        role: finalRole
      });
      
      setSuccess('Cadastro realizado com sucesso! Faça login para acessar.');
      setTimeout(() => {
        if (finalRole === UserRole.SUPPLIER) {
          router.push('/auth/login-supplier');
        } else {
          router.push('/auth/login-user');
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Cadastro de Usuário
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Aluguel Social
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                placeholder="Digite seu nome completo"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input
                {...register('cpf')}
                type="text"
                id="cpf"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                placeholder="Digite seu CPF (apenas números)"
              />
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                placeholder="Digite seu e-mail"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                placeholder="Digite sua senha (mínimo 6 caracteres)"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                Tipo de Usuário
              </label>
              <select
                {...register('userType')}
                id="userType"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              >
                <option value="user">Apenas Usuário</option>
                <option value="supplier">Usuário Fornecedor</option>
              </select>
              {errors.userType && (
                <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
              )}
            </div>

            {selectedUserType === 'supplier' && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Informações para Fornecedores
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Você poderá disponibilizar propriedades para aluguel</li>
                  <li>• Receberá solicitações de reservas</li>
                  <li>• Poderá aprovar ou rejeitar reservas</li>
                  <li>• Terá acesso ao painel de fornecedor</li>
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <a href="/auth/login-user" className="text-blue-600 underline">
                Faça login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 