export * from "./funcionario"
export * from "./coleta"


export interface Address {
  publicPlace: string
  street: string
  number: string
  complement?: string
  city: string
  uf: string
  zipCode: string
}

export interface Requester {
  id: string
  name: string
  email: string
  phone: string
  status: string
  address: Address
}

export interface WasteItem {
  type: string
  description: string
}

export interface Employee {
  id: string
  name: string
  email: string
  registration: string
  jobTitle: string
  role: string
  status: string
}

export interface Appointment {
  id: string
  scheduled_at: string
  created_at: string
  updated_at: string
  canceled_at?: string
  optional_photo_url?: string
  status: string
  wasteItem: WasteItem
  requester: Requester
  employee?: Employee
}

export interface FilterCriteria {
  searchTerm: string
  statusFilter: string
  wasteTypeFilter: string
}

export interface AppointmentStats {
  totalAppointments: number
  scheduledAppointments: number
  completedAppointments: number
  totalEmployees: number
  activeEmployees: number
  assignedAppointments: number
}
