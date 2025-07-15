'use client';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { LoginCredentials, User } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const syncUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };
    syncUser();
    setIsLoading(false);
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      authService.saveAuthData(data.access_token, data.user);
      setUser(data.user);
      toast.success('Login realizado com sucesso!');
      
      // Redirecionamento baseado no role e na página atual
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      
      if (data.user.role === 'admin' && currentPath.includes('login-admin')) {
        window.location.href = '/admin';
      } else if (data.user.role === 'supplier' && currentPath.includes('login-supplier')) {
        window.location.href = '/supplier';
      } else if (data.user.role === 'user' && currentPath.includes('login-user')) {
        window.location.href = '/users';
      } else {
        // Redirecionamento genérico baseado no role
        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        } else if (data.user.role === 'supplier') {
          window.location.href = '/supplier';
        } else if (data.user.role === 'user') {
          window.location.href = '/users';
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      const currentUser = user;
      setUser(null);
      queryClient.clear();
      toast.success('Logout realizado com sucesso!');
      
      if (currentUser?.role === 'admin') {
        window.location.href = '/auth/login-admin';
      } else if (currentUser?.role === 'supplier') {
        window.location.href = '/auth/login-supplier';
      } else {
        window.location.href = '/auth/login-user';
      }
    },
    onError: () => {
      const currentUser = user;
      setUser(null);
      queryClient.clear();
      
      if (currentUser?.role === 'admin') {
        window.location.href = '/auth/login-admin';
      } else if (currentUser?.role === 'supplier') {
        window.location.href = '/auth/login-supplier';
      } else {
        window.location.href = '/auth/login-user';
      }
    },
  });

  const login = (credentials: LoginCredentials, onProfileError?: () => void) => {
    loginMutation.mutate(credentials, {
      onSuccess: (data) => {
        authService.saveAuthData(data.access_token, data.user);
        setUser(data.user);
        toast.success('Login realizado com sucesso!');
        
        // Redirecionamento baseado no role e na página atual
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        
        if (data.user.role === 'admin' && currentPath.includes('login-admin')) {
          window.location.href = '/admin';
        } else if (data.user.role === 'supplier' && currentPath.includes('login-supplier')) {
          window.location.href = '/supplier';
        } else if (data.user.role === 'user' && currentPath.includes('login-user')) {
          window.location.href = '/users';
        } else {
          // Redirecionamento genérico baseado no role
          if (data.user.role === 'admin') {
            window.location.href = '/admin';
          } else if (data.user.role === 'supplier') {
            window.location.href = '/supplier';
          } else if (data.user.role === 'user') {
            window.location.href = '/users';
          }
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Erro ao fazer login');
      },
    });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}; 