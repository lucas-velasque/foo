'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return null;
  
  const isAdmin = user?.role === 'admin';
  const isSupplier = user?.role === 'supplier';
  const isUser = user?.role === 'user';
  
  return (
    <nav className="bg-blue-600 text-white px-4 py-2 flex items-center gap-4">
      {/* Links específicos por role */}
      {isAdmin && <Link href="/admin" className="font-bold">Painel Admin</Link>}
      {isSupplier && <Link href="/supplier" className="font-bold">Painel Fornecedor</Link>}
      
      {/* Links comuns */}
      <Link href="/users" className="font-bold">{isUser ? 'Usuário' : 'Usuários'}</Link>
      <Link href="/bookings">Reservas</Link>
      <Link href="/properties">Propriedades</Link>
      
      {/* Links específicos por role */}
      {isAdmin && <Link href="/tasks">Tarefas</Link>}
              {isAdmin && <Link href="/work-credits">Créditos de Serviço</Link>}
      <Link href="/social-assistance">Assistência Social</Link>
      
      {/* Links específicos para usuários */}
              {isUser && <Link href="/work-credits">Meus Créditos de Serviço</Link>}
      
      {/* Informações do usuário e logout */}
      <span className="ml-auto">
        {user?.name} ({user?.role === 'admin' ? 'Administrador' : user?.role === 'supplier' ? 'Fornecedor' : 'Usuário'})
      </span>
      <button onClick={logout} className="ml-4 underline">Sair</button>
    </nav>
  );
} 