'use client';

import SupplierLoginForm from '../../../components/auth/SupplierLoginForm';
import Link from 'next/link';

export default function LoginSupplierPage() {
  return (
    <>
      <SupplierLoginForm />
      <div className="text-center mt-4">
        <Link href="/auth/register-user" className="text-blue-600 underline">Fazer Cadastro</Link>
      </div>
    </>
  );
} 