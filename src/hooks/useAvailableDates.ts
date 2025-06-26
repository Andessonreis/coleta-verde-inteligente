"use client"

import { useState, useEffect } from "react"

export interface DayAvailability {
  date: string // YYYY-MM-DD
  available: boolean
  currentAppointments: number
  maxAppointments: number
  reason?: string // Motivo da indisponibilidade
}

export interface AvailabilityResponse {
  availableDates: DayAvailability[]
  defaultMaxAppointments: number
}

export function useAvailableDates() {
  const [availability, setAvailability] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(false)
  const [defaultMaxAppointments, setDefaultMaxAppointments] = useState(10)

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/appointments/availability")
      if (!response.ok) throw new Error("Erro ao buscar disponibilidade")
  
      const data: AvailabilityResponse = await response.json()
      setAvailability(data.availableDates)
      setDefaultMaxAppointments(data.defaultMaxAppointments)
  
    } catch (error) {
      console.error("Erro ao buscar disponibilidade de agendamentos:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Verificar se uma data específica está disponível
  const isDateAvailable = (date: string): boolean => {
    const dayInfo = availability.find((d) => d.date === date)
    return dayInfo?.available ?? false
  }

  // Obter informações de um dia específico
  const getDayInfo = (date: string): DayAvailability | null => {
    return availability.find((d) => d.date === date) || null
  }

  // Obter próxima data disponível
  const getNextAvailableDate = (): string | null => {
    const availableDate = availability.find((d) => d.available)
    return availableDate?.date || null
  }

  useEffect(() => {
    fetchAvailability()
  }, [])

  return {
    availability,
    loading,
    defaultMaxAppointments,
    isDateAvailable,
    getDayInfo,
    getNextAvailableDate,
    refetchAvailability: fetchAvailability,
  }
}
