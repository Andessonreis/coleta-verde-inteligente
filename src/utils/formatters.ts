export const formatDate = (dateTime: string): string => {
  if (!dateTime) return ""
  const [date] = dateTime.split("T")
  return date.split("-").reverse().join("/")
}

export const formatarTelefone = (phone: string): string => {
  if (!phone) return ""
  const cleaned = phone.replace("+55", "")
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export const formatarEndereco = (address: Usuario["address"]): string => {
  if (!address) return "Endereço não cadastrado"
  const { publicPlace, street, number, complement, city, uf } = address
  let endereco = `${publicPlace || street}, ${number}`
  if (complement) endereco += `, ${complement}`
  endereco += ` - ${city}/${uf}`
  return endereco
}
// Função para formatar data mais elegante
export const formatDateElegant = (dateStr: string) => {
  if (!dateStr) return { day: '--', month: '--', weekday: '--' }
  
  const [day, month, year] = dateStr.split('/')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  return {
    day: String(day).padStart(2, '0'),
    month: months[date.getMonth()],
    weekday: weekdays[date.getDay()]
  }
}