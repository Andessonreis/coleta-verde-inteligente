/* src/components/feature/appointment/appointmentList.tsx */
"use client"

import { Agendamento } from "@/components/feature/appointment/appointmentPage"
import { Button } from "@/components/ui/button"
import { Calendar, Timer, CheckCircle2 } from "lucide-react"
import AppointmentCard from "@/components/feature/appointment/appointmentCard"

interface AppointmentListProps {
  agendamentos: Agendamento[]
  onEditar: (agendamento: Agendamento) => void
  onExcluir: (id: string | number) => void
  getStatusColor: (status: string) => string
  statusOptions: { value: string; label: string; color: string }[]
  novoAgendamento: () => void
}

export default function AppointmentList({
  agendamentos,
  onEditar,
  onExcluir,
  getStatusColor,
  statusOptions,
  novoAgendamento,
}: AppointmentListProps) {
  // Estatísticas dos agendamentos
  const stats = {
    total: agendamentos.length,
    pendentes: agendamentos.filter(a => a.status === 'pendente').length,
    confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
    concluidos: agendamentos.filter(a => a.status === 'concluido').length,
    cancelados: agendamentos.filter(a => a.status === 'cancelado').length,
  }

  // Ordenar agendamentos por data
  const agendamentosOrdenados = [...agendamentos].sort((a, b) => {
    if (!a.data || !b.data) return 0
    const [dayA, monthA, yearA] = a.data.split('/')
    const [dayB, monthB, yearB] = b.data.split('/')
    const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA))
    const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB))
    return dateA.getTime() - dateB.getTime()
  })

  if (agendamentos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            Você ainda não possui agendamentos de coleta. Crie seu primeiro agendamento para começar a contribuir com a sustentabilidade.
          </p>
          <Button 
            onClick={novoAgendamento} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Criar primeiro agendamento
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 font-medium">Total</p>
              <p className="text-2xl font-bold text-emerald-900">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pendentes}</p>
            </div>
            <Timer className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Confirmados</p>
              <p className="text-2xl font-bold text-green-900">{stats.confirmados}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Concluídos</p>
              <p className="text-2xl font-bold text-blue-900">{stats.concluidos}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Seus Agendamentos ({agendamentos.length})
          </h3>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {agendamentosOrdenados.map((agendamento) => (
            <AppointmentCard
              key={agendamento.id}
              agendamento={agendamento}
              onEditar={() => onEditar(agendamento)}
              onExcluir={() => onExcluir(agendamento.id)}
              statusOptions={statusOptions}
            />
          ))}
        </div>
      </div>
    </div>
  )
}