import { useEffect, useState } from "react"
import { PerfilFuncionario } from "@/types/funcionario"
import { mapApiToPerfilFuncionario } from "@/utils/mapApiToPerfilFuncionario"

export function useFuncionario() {
  const [perfil, setPerfil] = useState<PerfilFuncionario | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoading(true)
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2FvLmZ1bmNpb25hcmlvQGdtYWlsLmNvbSIsImlzcyI6ImxvZ2luLWF1dGgtYXBpIiwiaWF0IjoxNzQ5OTMyNDY0LCJleHAiOjE3NDk5MzYwNjR9.4SC_2ulec2zSzi2rHJK20bJ2v2hFc_hXnbGtkTSDz5c"

        const resposta = await fetch("http://localhost:8080/api/employees/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!resposta.ok) throw new Error("Erro ao buscar perfil")

        const dadosApi = await resposta.json()
        const perfilMapeado = mapApiToPerfilFuncionario(dadosApi)
        setPerfil(perfilMapeado)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErro(err.message)
        } else {
          setErro("Erro desconhecido")
        }
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
  }, [])

  return { perfil, loading, erro }
}
