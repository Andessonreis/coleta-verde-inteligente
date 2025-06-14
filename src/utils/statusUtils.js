export const getStatusColor = (status) => {
  const cores = {
    pendente: "bg-yellow-100 text-yellow-800",
    em_andamento: "bg-blue-100 text-blue-800", 
    concluida: "bg-green-100 text-green-800",
    problema: "bg-red-100 text-red-800"
  }
  return cores[status] || "bg-gray-100 text-gray-800"
}

export const getStatusText = (status) => {
  const textos = {
    pendente: "Pendente",
    em_andamento: "Em Andamento",
    concluida: "Concluída", 
    problema: "Problema"
  }
  return textos[status] || "Desconhecido"
}