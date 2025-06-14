// Representa uma coleta atribuída à rota de um funcionário

export interface ColetaRota {
  id: string
  endereco: string
  tipoResiduo: string
  horarioAgendado: string
  status: "pendente" | "em_andamento" | "concluida" | "problema"
  observacoes?: string
  cidadao: {
    nome: string
    telefone: string
  }
  coordenadas: {
    lat: number
    lng: number
  }
}
