
import { AlertCircle, CheckCircle2, XCircle, Timer } from "lucide-react"

export type StatusAgendamentoValue =
  | "pendente"
  | "confirmado"
  | "concluido"
  | "cancelado"

export interface StatusAgendamentoOption {
  value: StatusAgendamentoValue
  label: string
  color: string
}

export const statusOptions: StatusAgendamentoOption[] = [
  { value: "pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmado", label: "Confirmado", color: "bg-green-100 text-green-800" },
  { value: "concluido", label: "Concluído", color: "bg-blue-100 text-blue-800" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" }
]

export const getStatusColor = (status: string) => {
  return statusOptions.find((opt) => opt.value === status)?.color || "bg-gray-100 text-gray-800"
}

