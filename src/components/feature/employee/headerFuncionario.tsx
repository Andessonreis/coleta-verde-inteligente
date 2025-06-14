"use client"

import { Leaf } from "lucide-react"

type Props = {
  funcionario: string | undefined
}

export function HeaderFuncionario({ funcionario }: Props) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <Leaf className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold text-green-800">Coleta Verde</h1>
        <span className="text-lg text-gray-600">- Funcionário</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Bem-vindo,</span>
        <span className="font-semibold">{funcionario}</span>
      </div>
    </header>
  )
}
