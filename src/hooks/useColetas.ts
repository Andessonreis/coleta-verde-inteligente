import { useState, useEffect } from "react"
import { ColetaRota } from "@/types/coleta"

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2FvLmZ1bmNpb25hcmlvQGdtYWlsLmNvbSIsImlzcyI6ImxvZ2luLWF1dGgtYXBpIiwiaWF0IjoxNzQ5OTYzNzI3LCJleHAiOjE3NDk5NjczMjd9.pnL51pyrTQJ21ON-DjQJbf79AEqvqGABh6m5DYhF540"

export function useColetas() {
  const [coletas, setColetas] = useState<ColetaRota[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchColetas()
  }, [])

  const fetchColetas = async () => {
    try {
      setLoading(true)

      const response = await fetch("http://localhost:8080/api/appointments/employee", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: TOKEN
        }
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      const mappedColetas: ColetaRota[] = data.map((item: any) => ({
        id: item.id,
        endereco: `${item.address.publicPlace}, ${item.address.number} - ${item.address.street}, ${item.address.city} - ${item.address.uf}`,
        tipoResiduo: item.wasteItem.description,
        horarioAgendado: new Date(item.scheduledAt).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short"
        }),
        status: converterStatus(item.status), // converter do backend para frontend
        observacoes: item.observacoes || "",
        cidadao: {
          nome: item.requester.name,
          telefone: item.requester.phone
        },
        coordenadas: undefined // TODO: implementar depois
      }))

      setColetas(mappedColetas)
    } catch (error) {
      console.error("Erro ao buscar coletas:", error)
    } finally {
      setLoading(false)
    }
  }

  const atualizarStatusColeta = async (
    id: string,
    novoStatus: ColetaRota["status"],
    observacoes?: string
  ) => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: TOKEN,
        },
        body: JSON.stringify({ status: converterStatusParaBackend(novoStatus), observacoes }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao atualizar status: ${response.status}`)
      }

      const updatedColeta = await response.json()

      setColetas((coletas) =>
        coletas.map((coleta) =>
          coleta.id === id
            ? {
                ...coleta,
                status: converterStatus(updatedColeta.status), // converte backend → frontend
                observacoes: updatedColeta.observacoes || observacoes || "",
              }
            : coleta
        )
      )
    } catch (error) {
      console.error("Erro ao atualizar coleta:", error)
    }
  }

  return {
    coletas,
    loading,
    atualizarStatusColeta,
    refetch: fetchColetas,
  }
}

function converterStatus(statusBackend: string): ColetaRota["status"] {
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

function converterStatusParaBackend(statusInterno: ColetaRota["status"]): string {
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
