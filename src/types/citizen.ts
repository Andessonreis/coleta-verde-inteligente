export interface Usuario {
  name: string
  email: string
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