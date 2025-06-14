import { PerfilFuncionario } from "@/types/funcionario"

export function mapApiToPerfilFuncionario(apiData: any): PerfilFuncionario {
  return {
    nome: apiData.name || "",
    matricula: apiData.registration || "",
    email: apiData.email || apiData.username || "",
    telefone: "", // TODO: preencher quando backend enviar
    cargo: apiData.jobTitle || "",
    setor: "", // TODO: preencher quando backend enviar
    dataAdmissao: apiData.createdAt || "",
    avatar: "", // TODO: preencher quando backend enviar
    estatisticas: {
      coletasRealizadas: 0,
      coletasHoje: 0,
      avaliacaoMedia: 0,
    },
  }
}
