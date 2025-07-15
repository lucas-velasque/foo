'use client';

import UserLoginForm from '../../../components/auth/UserLoginForm';
import Link from 'next/link';

export default function LoginUserPage() {
  return (
    <>
      <UserLoginForm />
      <div className="text-center mt-4">
        <Link href="/auth/register-user" className="text-blue-600 underline">Fazer Cadastro</Link>
      </div>
    </>
  );
} 