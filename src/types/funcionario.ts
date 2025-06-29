export interface PerfilFuncionario {
  id: string
  nome: string
  matricula: string
  email: string
  telefone?: string
  cargo?: string
  setor?: string
  dataAdmissao?: string
  avatar?: string
  estatisticas?: {
    coletasRealizadas: number
    coletasHoje: number
    avaliacaoMedia: number
  }
}
