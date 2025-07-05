import type { Penalidade } from "@/types/penalidade"

export const getStatusColor = (status: Penalidade["status"]) => {
  switch (status) {
    case "PENDING_ANALYSIS":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "APPROVED":
      return "bg-red-100 text-red-800 border-red-200"
    case "REJECTED":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getStatusText = (status: Penalidade["status"]) => {
  switch (status) {
    case "PENDING_ANALYSIS":
      return "Pendente de Análise"
    case "APPROVED":
      return "Aprovada"
    case "REJECTED":
      return "Rejeitada"
    default:
      return status
  }
}

export const getStatusIcon = (status: Penalidade["status"]) => {
  switch (status) {
    case "PENDING_ANALYSIS":
      return "⏳"
    case "APPROVED":
      return "✅"
    case "REJECTED":
      return "❌"
    default:
      return "❓"
  }
}

export const getTipoText = (tipo: Penalidade["tipo"]) => {
  switch (tipo) {
    case "RESIDUE_MISMATCH":
      return "Resíduo Incorreto"
    case "UNAUTHORIZED_ITEM":
      return "Item Não Autorizado"
    case "DANGEROUS_MATERIAL":
      return "Material Perigoso"
    case "VOLUME_EXCEEDED":
      return "Volume Excedido"
    case "OTHER":
      return "Outros"
    default:
      return tipo
  }
}

export const getTipoColor = (tipo: Penalidade["tipo"]) => {
  switch (tipo) {
    case "RESIDUE_MISMATCH":
      return "bg-orange-100 text-orange-800"
    case "UNAUTHORIZED_ITEM":
      return "bg-red-100 text-red-800"
    case "DANGEROUS_MATERIAL":
      return "bg-purple-100 text-purple-800"
    case "VOLUME_EXCEEDED":
      return "bg-blue-100 text-blue-800"
    case "OTHER":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
