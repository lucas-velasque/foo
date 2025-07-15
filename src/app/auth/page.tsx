import { redirect } from 'next/navigation';

export default function AuthRedirect() {
  // Redireciona para login de usuário por padrão
  redirect('/auth/login-user');
  return null;
} 