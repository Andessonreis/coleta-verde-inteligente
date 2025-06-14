"use client"

import { Agendamento } from "@/components/feature/appointment/appointmentPage"
import { Button } from "@/components/ui/button"
import { X, Calendar, Package } from "lucide-react"

interface AppointmentModalProps {
  aberto: boolean
  setAberto: React.Dispatch<React.SetStateAction<boolean>>
  agendamento: Agendamento | null
  modoEdicao: boolean
  atualizarAgendamento: (campo: keyof Agendamento, valor: string) => void
  salvarAgendamento: () => void
  statusOptions: { value: string; label: string; color: string }[]
  enderecoUsuario: string 
}

const tiposResiduoOptions = [
  { value: 'ORGANIC', label: 'Orgânico' },
  { value: 'RECYCLABLE', label: 'Reciclável' },
  { value: 'ELECTRONIC', label: 'Eletrônico' },
  { value: 'HAZARDOUS', label: 'Perigoso' },
  { value: 'CONSTRUCTION', label: 'Construção' },
  { value: 'GENERAL', label: 'Geral' }
]

export default function AppointmentModal({
  aberto,
  setAberto,
  agendamento,
  modoEdicao,
  atualizarAgendamento,
  salvarAgendamento,
  enderecoUsuario, 
}: AppointmentModalProps) {
  if (!aberto || !agendamento) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    salvarAgendamento()
  }

  const handleClose = () => {
    setAberto(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {modoEdicao ? "Editar Agendamento" : "Novo Agendamento"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Data */}
          <div className="space-y-2">
            <label htmlFor="data" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Data da Coleta
            </label>
            <input
              id="data"
              type="date"
              value={agendamento.data}
              onChange={(e) => atualizarAgendamento("data", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Tipo de Resíduo */}
          <div className="space-y-2">
            <label htmlFor="tipoResiduo" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="w-4 h-4 text-emerald-600" />
              Tipo de Resíduo
            </label>
            <select
              id="tipoResiduo"
              value={agendamento.tipoResiduo}
              onChange={(e) => atualizarAgendamento("tipoResiduo", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            >
              <option value="">Selecione o tipo de resíduo</option>
              {tiposResiduoOptions.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Endereço (apenas exibição) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Endereço de Coleta
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
              {enderecoUsuario || "Endereço não cadastrado"}
            </div>
            <p className="text-xs text-gray-500">
              O endereço é vinculado ao seu perfil de usuário.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {modoEdicao ? "Atualizar" : "Criar"} Agendamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}