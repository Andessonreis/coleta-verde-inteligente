import { Timer, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { ComponentType, SVGProps } from "react"

type StatusType = "pendente" | "confirmado" | "concluido" | "cancelado"

const statusIcons: Record<StatusType, ComponentType<SVGProps<SVGSVGElement>>> = {
  pendente: Timer,
  confirmado: CheckCircle2,
  concluido: CheckCircle2,
  cancelado: XCircle,
}

export const getStatusIcon = (status: string) => {
  const IconComponent = statusIcons[status.toLowerCase() as StatusType] || AlertCircle
  return <IconComponent className="w-4 h-4" />
}


// Função para obter cor do tipo de resíduo
export const getWasteTypeColor = (tipo: string): string => {
  const colors: Record<string, string> = {
    ORGANIC: 'bg-green-100 text-green-800 border-green-200',
    RECYCLABLE: 'bg-blue-100 text-blue-800 border-blue-200',
    ELECTRONIC: 'bg-purple-100 text-purple-800 border-purple-200',
    HAZARDOUS: 'bg-red-100 text-red-800 border-red-200',
    CONSTRUCTION: 'bg-orange-100 text-orange-800 border-orange-200',
    GENERAL: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return colors[tipo] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Função para traduzir tipo de resíduo
export const translateWasteType = (tipo: string): string => {
  const translations: Record<string, string> = {
    ORGANIC: 'Orgânico',
    RECYCLABLE: 'Reciclável',
    ELECTRONIC: 'Eletrônico',
    HAZARDOUS: 'Perigoso',
    CONSTRUCTION: 'Construção',
    GENERAL: 'Geral',
  }
  return translations[tipo] || tipo
}

// Interface para agendamento
export interface Agendamento {
  status: StatusType
  data: string // formato "dd/mm/yyyy"

}

// Função para calcular urgência
export const getUrgencyInfo = (dateStr: string) => {
  if (!dateStr) return null
  
  const [day, month, year] = dateStr.split('/')
  const appointmentDate = new Date(Number(year), Number(month) - 1, Number(day))
  const today = new Date()
  const diffTime = appointmentDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 1 && diffDays >= 0) {
    return diffDays === 0 ? 'Hoje' : 'Amanhã'
  }
  return null
}

// Função para calcular estatísticas de agendamentos
export const calculateStats = (agendamentos: Agendamento[]) => ({
  total: agendamentos.length,
  pendentes: agendamentos.filter(a => a.status === 'pendente').length,
  confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
  concluidos: agendamentos.filter(a => a.status === 'concluido').length,
  cancelados: agendamentos.filter(a => a.status === 'cancelado').length,
})

// Função para ordenar agendamentos por data
export const sortAppointmentsByDate = (agendamentos: Agendamento[]) => {
  return [...agendamentos].sort((a, b) => {
    if (!a.data || !b.data) return 0
    const [dayA, monthA, yearA] = a.data.split('/')
    const [dayB, monthB, yearB] = b.data.split('/')
    const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA))
    const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB))
    return dateA.getTime() - dateB.getTime()
  })
}
