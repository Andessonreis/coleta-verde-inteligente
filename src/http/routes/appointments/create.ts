import type { StatusAgendamentoValue } from "@/types/statusOptions"
import { formatDate } from "@/utils/formatters"

const mapBackendToAppStatus: Record<string, StatusAgendamentoValue> = {
  SCHEDULED: "pendente",
  CANCELED: "cancelado",
  COMPLETED: "concluido",
  NOT_COMPLETED: "cancelado",
}

const traduzirStatus = (status: string): StatusAgendamentoValue => {
  return mapBackendToAppStatus[status] || "pendente"
}

export async function salvarAgendamentoService(
  agendamento: Agendamento,
  token: string,
  modoEdicao: boolean
): Promise<Agendamento> {
  const urlBase = "http://localhost:8080/api/appointments"

  const payload = {
    scheduled_at: new Date(agendamento.data).toISOString(),
    optional_photo_url: "http://example.com/photo2.jpg",
    waste: {
      type: agendamento.tipoResiduo,
      description: "Descrição opcional aqui",
    },
  }

  const response = await fetch(
    modoEdicao ? `${urlBase}/${agendamento.id}` : urlBase,
    {
      method: modoEdicao ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Erro ao salvar agendamento")
  }

  const agendamentoSalvo = await response.json()

  return {
    id: agendamentoSalvo.id,
    data: formatDate(agendamentoSalvo.scheduled_at),
    tipoResiduo: agendamentoSalvo.wasteItem?.type || "",
    status: traduzirStatus(agendamentoSalvo.status),
  }
}
