export interface AgendamentoEmpresa {
  id: number | string
  data: string
  tipoResiduo: string
  status: string
  frequencia: "daily" | "weekly" | "monthly"
  pesoEstimado: string
  observacoes: string
}

export interface CompanyAppointmentAPIResponse {
  id: string
  scheduled_at: string
  status: string
  frequency: string
  estimated_weight: string
  notes: string
  wasteItem?: {
    type: string
  }
}
