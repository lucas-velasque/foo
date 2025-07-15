"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/Button";

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      if (!window.location.pathname.includes('/auth/login-admin')) {
        router.replace("/auth/login-admin");
      }
    }
  }, [isAuthenticated, user, router, isLoading]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Painel do Administrador</h1>
      <p className="mb-4">Bem-vindo, {user?.name}!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <Link href="/users">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Gerenciar usuários</Button>
        </Link>
        <Link href="/properties">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Gerenciar propriedades</Button>
        </Link>
        <Link href="/bookings">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Gerenciar reservas</Button>
        </Link>
        <Link href="/social-assistance">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Gerenciar assistência social</Button>
        </Link>
        <Link href="/work-credits">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Gerenciar créditos de serviço</Button>
        </Link>
        <Link href="/tasks">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Gerenciar Tarefas</Button>
        </Link>
      </div>
    </div>
  );
} 