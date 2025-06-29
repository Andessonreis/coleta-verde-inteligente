export interface ColetaRota {
  id: string // UUID da coleta (appointmentId)
  endereco: string
  tipoResiduo: string
  horarioAgendado: string
  status: "pendente" | "em_andamento" | "concluida" | "problema"
  observacoes?: string
  foto_url?: string
  cidadao: {
    id: string
    nome: string
    telefone: string
  }
  coordenadas: {
    lat: number
    lng: number
  }
}
