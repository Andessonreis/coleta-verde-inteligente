import { PerfilFuncionario } from "@/types/funcionario"

export function mapApiToPerfilFuncionario(apiData: any): PerfilFuncionario {
  return {
    id: apiData.id,
    nome: apiData.name || "",
    matricula: apiData.registration || "",
    email: apiData.email || "",
    telefone: apiData.phone || "", 
    cargo: apiData.jobTitle || "",
    setor: "", 
    dataAdmissao: apiData.createdAt || "",
    avatar: "", // TODO: preencher quando backend enviar
    estatisticas: {
      coletasRealizadas: 0,
      coletasHoje: 0,
      avaliacaoMedia: 0,
    },
  }
}
