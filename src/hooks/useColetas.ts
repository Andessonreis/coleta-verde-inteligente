import { useState, useEffect, useCallback } from "react"
import { ColetaRota } from "@/types/coleta"
import { converterStatus, converterStatusParaBackend } from "@/utils/statusTranslator"

export function useColetas() {
  const [coletas, setColetas] = useState<ColetaRota[]>([])
  const [loading, setLoading] = useState(true)

  const getToken = () => {
    const token = localStorage.getItem("token")
    return token ? `Bearer ${token}` : null
  }

  const fetchColetas = useCallback(async () => {
    try {
      setLoading(true)

      const token = getToken()
      if (!token) throw new Error("Token não encontrado")

      const response = await fetch("http://localhost:8080/api/appointments/employee", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)

      const data = await response.json()

      const mappedColetas: ColetaRota[] = data.map((item: any) => ({
        id: item.id,
        endereco: `${item.address.publicPlace}, ${item.address.number} - ${item.address.street}, ${item.address.city} - ${item.address.uf}`,
        tipoResiduo: item.wasteItem.description,
        horarioAgendado: new Date(item.scheduledAt).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
        status: converterStatus(item.status),
        observacoes: item.observacoes || "",
        cidadao: {
          nome: item.requester.name,
          telefone: item.requester.phone,
        },
        coordenadas: undefined,
      }))

      setColetas(mappedColetas)
    } catch (error) {
      console.error("Erro ao buscar coletas:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchColetas()
  }, [fetchColetas])

  const atualizarStatusColeta = async (
    id: string,
    novoStatus: ColetaRota["status"],
    observacoes?: string
  ) => {
    try {
      const token = getToken()
      if (!token) throw new Error("Token não encontrado")

      const response = await fetch(`http://localhost:8080/api/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          status: converterStatusParaBackend(novoStatus),
          observacoes,
        }),
      })

      if (!response.ok) throw new Error(`Erro ao atualizar status: ${response.status}`)

      const updatedColeta = await response.json()

      setColetas((coletas) =>
        coletas.map((coleta) =>
          coleta.id === id
            ? {
                ...coleta,
                status: converterStatus(updatedColeta.status),
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

