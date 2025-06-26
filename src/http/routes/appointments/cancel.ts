import { API_BASE_URL } from "@/http/config"

export async function cancelarAgendamentoService(id: string | number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: "CANCELED",
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Erro ao cancelar o agendamento.")
  }
}
