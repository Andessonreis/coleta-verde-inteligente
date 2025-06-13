
"use client"

import { Agendamento } from "@/components/feature/appointment/appointmentPage"
import { Button } from "@/components/ui/button"
import { MapPin, Trash2, Package, Edit3, AlertCircle, CheckCircle2, XCircle, Timer } from "lucide-react"

interface AppointmentCardProps {
  agendamento: Agendamento
  onEditar: () => void
  onExcluir: () => void
  statusOptions: { value: string; label: string; color: string }[]
}

// Função para obter ícone do status
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pendente':
      return <Timer className="w-4 h-4" />
    case 'confirmado':
      return <CheckCircle2 className="w-4 h-4" />
    case 'concluido':
      return <CheckCircle2 className="w-4 h-4" />
    case 'cancelado':
      return <XCircle className="w-4 h-4" />
    default:
      return <AlertCircle className="w-4 h-4" />
  }
}

// Função para obter cor do tipo de resíduo
const getWasteTypeColor = (tipo: string) => {
  const colors: Record<string, string> = {
    'ORGANIC': 'bg-green-100 text-green-800 border-green-200',
    'RECYCLABLE': 'bg-blue-100 text-blue-800 border-blue-200',
    'ELECTRONIC': 'bg-purple-100 text-purple-800 border-purple-200',
    'HAZARDOUS': 'bg-red-100 text-red-800 border-red-200',
    'CONSTRUCTION': 'bg-orange-100 text-orange-800 border-orange-200',
    'GENERAL': 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[tipo] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Função para traduzir tipo de resíduo
const translateWasteType = (tipo: string) => {
  const translations: Record<string, string> = {
    'ORGANIC': 'Orgânico',
    'RECYCLABLE': 'Reciclável',
    'ELECTRONIC': 'Eletrônico',
    'HAZARDOUS': 'Perigoso',
    'CONSTRUCTION': 'Construção',
    'GENERAL': 'Geral'
  }
  return translations[tipo] || tipo
}

// Função para formatar data mais elegante
const formatDateElegant = (dateStr: string) => {
  if (!dateStr) return { day: '--', month: '--', weekday: '--' }
  
  const [day, month, year] = dateStr.split('/')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  return {
    day: String(day).padStart(2, '0'),
    month: months[date.getMonth()],
    weekday: weekdays[date.getDay()]
  }
}

export default function AppointmentCard({ 
  agendamento, 
  onEditar, 
  onExcluir, 
  statusOptions 
}: AppointmentCardProps) {
  const statusOption = statusOptions.find(opt => opt.value === agendamento.status)
  const dateInfo = formatDateElegant(agendamento.data)
  
  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg overflow-hidden">
      {/* Header com Data */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-2 shadow-sm min-w-[60px]">
              <span className="text-lg font-bold text-gray-900">{dateInfo.day}</span>
              <span className="text-xs text-gray-600 uppercase">{dateInfo.month}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{dateInfo.weekday}</p>
              <p className="text-xs text-gray-600">Coleta agendada</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusOption?.color || 'bg-gray-100 text-gray-800'}`}>
            {getStatusIcon(agendamento.status)}
            {statusOption?.label || agendamento.status}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-4 space-y-3">
        {/* Tipo de Resíduo */}
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">Tipo de resíduo:</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getWasteTypeColor(agendamento.tipoResiduo)}`}>
            {translateWasteType(agendamento.tipoResiduo)}
          </span>
        </div>

        {/* ID do Agendamento */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            ID: #{String(agendamento.id).slice(-8)}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditar}
            className="flex items-center gap-1.5 text-xs hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExcluir}
            className="flex items-center gap-1.5 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Excluir
          </Button>
        </div>
        
        {/* Indicador de urgência baseado na data */}
        {agendamento.data && (() => {
          const [day, month, year] = agendamento.data.split('/')
          const appointmentDate = new Date(Number(year), Number(month) - 1, Number(day))
          const today = new Date()
          const diffTime = appointmentDate.getTime() - today.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays <= 1 && diffDays >= 0) {
            return (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <AlertCircle className="w-3 h-3" />
                {diffDays === 0 ? 'Hoje' : 'Amanhã'}
              </div>
            )
          }
          return null
        })()}
      </div>
    </div>
  )
}