import { useState } from 'react'
import { FilterCriteria } from '@/types/index'

export const useFilters = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [wasteTypeFilter, setWasteTypeFilter] = useState("all")

  const filterCriteria: FilterCriteria = {
    searchTerm,
    statusFilter,
    wasteTypeFilter
  }

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    wasteTypeFilter,
    setWasteTypeFilter,
    filterCriteria
  }
}
