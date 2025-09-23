import React from 'react'
import { AuthLayout } from '../layout/AuthLayout'

export default function ErrorPage({ message }: { message?: string }) {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-red-400">Erro computável</h2>
      <p className="text-white/80 mb-6">{message ?? 'Ocorreu um erro inesperado. Tente novamente.'}</p>
      <a href="/" className="text-blue-400 underline">Voltar para o início</a>
    </AuthLayout>
  )
}