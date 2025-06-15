export class StatusHelper {
  static getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      "SCHEDULED": "bg-yellow-100 text-yellow-800",
      "IN_PROGRESS": "bg-blue-100 text-blue-800",
      "COMPLETED": "bg-green-100 text-green-800",
      "CANCELLED": "bg-red-100 text-red-800",
    }
    return statusColors[status] || "bg-gray-100 text-gray-800"
  }

  static getStatusText(status: string): string {
    const statusTexts: Record<string, string> = {
      "SCHEDULED": "Agendado",
      "IN_PROGRESS": "Em Andamento",
      "COMPLETED": "Concluído",
      "CANCELLED": "Cancelado",
    }
    return statusTexts[status] || status
  }

  static getWasteTypeText(type: string): string {
    const wasteTypeTexts: Record<string, string> = {
      "ORGANIC": "Orgânico",
      "RECYCLABLE": "Reciclável",
      "ELECTRONIC": "Eletrônico",
      "CONSTRUCTION": "Construção",
      "BULKY": "Volumoso",
    }
    return wasteTypeTexts[type] || type
  }
}
