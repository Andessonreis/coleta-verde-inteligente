import { useState, useEffect } from "react"

export function useColetas() {
  const [coletas, setColetas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetchColetas()
  }, [])

  const fetchColetas = async () => {
    try {
      setLoading(true)
      // const response = await api.get('/coletas')
      // setColetas(response.data)
      
      // Mock data para exemplo
      setColetas([
        {
          id: 1,
          status: "pendente",
          horarioAgendado: "08:00",
          tipoResiduo: "Orgânico",
          endereco: "Rua das Flores, 123",
          cidadao: { nome: "João Silva", telefone: "(11) 99999-9999" },
          observacoes: null
        }
      ])
    } catch (error) {
      console.error("Erro ao buscar coletas:", error)
    } finally {
      setLoading(false)
    }
  }

  const atualizarStatusColeta = async (id, novoStatus, observacoes) => {
    try {
      // await api.patch(`/coletas/${id}`, { status: novoStatus, observacoes })
      
      // Atualização local
      setColetas(coletas =>
        coletas.map(coleta =>
          coleta.id === id
            ? { ...coleta, status: novoStatus, observacoes }
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
    refetch: fetchColetas
  }
}


