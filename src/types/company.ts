export interface Empresa {
  id: string
  name: string
  email: string
  phone: string
  cnpj: string
  frequency: "daily" | "weekly" | "monthly"
  status: "ACTIVE" | "INACTIVE"
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}
