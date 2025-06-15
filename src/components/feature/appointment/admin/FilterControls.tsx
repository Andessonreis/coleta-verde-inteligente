import React from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface FilterControlsProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  wasteTypeFilter: string
  onWasteTypeFilterChange: (value: string) => void
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  wasteTypeFilter,
  onWasteTypeFilterChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome, email ou descrição..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="SCHEDULED">Agendado</SelectItem>
          <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
          <SelectItem value="COMPLETED">Concluído</SelectItem>
          <SelectItem value="CANCELLED">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={wasteTypeFilter} onValueChange={onWasteTypeFilterChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Tipos</SelectItem>
          <SelectItem value="ORGANIC">Orgânico</SelectItem>
          <SelectItem value="RECYCLABLE">Reciclável</SelectItem>
          <SelectItem value="ELECTRONIC">Eletrônico</SelectItem>
          <SelectItem value="CONSTRUCTION">Construção</SelectItem>
          <SelectItem value="BULKY">Volumoso</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}