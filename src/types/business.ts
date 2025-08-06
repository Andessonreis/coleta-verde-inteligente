export interface Empresa {
  name: string
  email: string
  nome_fantasia: string
  cnpj: string
  phone: string
  status: string
  address?: {
    publicPlace: string
    street: string
    number: string
    complement: string
    city: string
    uf: string
    zipCode: string
  }
}