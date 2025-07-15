"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import { Lock, Mail } from "lucide-react";

const loginSchema = z.object({
  email: z.string()
    .refine(val => /\d{11}/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Digite um e-mail válido ou um CPF com 11 dígitos",
    }),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SupplierLoginForm() {
  const router = useRouter();
  const { login, isLoginLoading } = useAuth();
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setValue('password', password);
  }, [password, setValue]);

  const onSubmit = (data: LoginFormData) => {
    setError("");
    login(
      { login: data.email, password: data.password, role: "supplier" },
      () => {
        setError("Credenciais inválidas para este perfil");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    if (e.target.id === 'password') {
      setPassword(e.target.value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entrar como Fornecedor
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Aluguel Social - Área do Fornecedor
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail ou CPF
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  {...register("email")}
                  type="text"
                  id="email"
                  className="pl-10 pr-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite seu e-mail ou CPF"
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  className="pl-10 pr-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={handleInputChange}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              loading={isLoginLoading}
              disabled={isLoginLoading}
            >
              Entrar como Fornecedor
            </Button>
          </div>

          <div className="text-center mt-4">
            <a href="/auth/register-user" className="text-green-600 underline">Fazer Cadastro</a>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Acesso exclusivo para fornecedores de propriedades
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 