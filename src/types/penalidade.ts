export interface Penalidade {
  id: string
  coletaId: string
  cidadaoId: string
  funcionarioId: string
  analistaId?: string
  tipo: "OTHER" | "RESIDUE_MISMATCH" | "DANGEROUS_MATERIAL" | "UNAUTHORIZED_ITEM" | "VOLUME_EXCEEDED"
  descricao: string
  fotoEvidencia: string
  status: "PENDENTE_ANALISE" | "APROVADA" | "REJEITADA"
  dataReporte: string
  dataAnalise?: string
  observacoesAnalista?: string
  diasBloqueio: number
  dataInicioBloqueio?: string
  dataFimBloqueio?: string
  cidadao: {
    nome: string
    email: string
    telefone: string
    endereco: string
  }
  funcionario: {
    nome: string
    registro: string
  }
  analista?: {
    nome: string
    registro: string
  }
}

export interface BloqueioAtivo {
  cidadaoId: string
  dataInicio: string
  dataFim: string
  motivoPenalidade: string
  penalidadeId: string
}
export type PenalidadeParcial = Pick<
Penalidade,
"id" | "dataReporte" | "tipo" | "cidadao" | "funcionario"
>

export enum PenaltyType {
  OTHER = "OTHER",
  RESIDUE_MISMATCH = "RESIDUE_MISMATCH",
  DANGEROUS_MATERIAL = "DANGEROUS_MATERIAL",
  UNAUTHORIZED_ITEM = "UNAUTHORIZED_ITEM",
  VOLUME_EXCEEDED = "VOLUME_EXCEEDED",
}
