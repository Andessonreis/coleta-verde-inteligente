import type { ColetaRota } from "@/types"
import type { StatusAgendamentoValue } from "@/types/statusOptions"

const mapBackendToAppStatus: Record<string, StatusAgendamentoValue> = {
  SCHEDULED: "pendente",
  CANCELED: "cancelado",
  COMPLETED: "concluido",
  NOT_COMPLETED: "cancelado",
}

export function traduzirStatus(status: string): StatusAgendamentoValue {
  return mapBackendToAppStatus[status] || "pendente"
}


export function converterStatus(statusBackend: string): ColetaRota["status"] {
  switch (statusBackend) {
    case "SCHEDULED":
      return "pendente"
    case "IN_PROGRESS":
      return "em_andamento"
    case "COMPLETED":
      return "concluida"
    case "CANCELED":
      return "problema"
    default:
      return "pendente"
  }
}

export function converterStatusParaBackend(statusInterno: ColetaRota["status"]): string {
  switch (statusInterno) {
    case "pendente":
      return "SCHEDULED"
    case "em_andamento":
      return "IN_PROGRESS"
    case "concluida":
      return "COMPLETED"
    case "problema":
      return "CANCELED"
    default:
      return "SCHEDULED"
  }
}