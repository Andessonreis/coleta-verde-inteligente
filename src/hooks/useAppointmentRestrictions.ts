"use client"

import { useState, useEffect } from "react"

export interface AppointmentRestriction {
  canSchedule: boolean
  lastAppointmentDate: string | null
  nextAvailableDate: string | null
  daysRemaining: number
  reason?: string
}

export interface Agendamento {
  data: string
  status: string
}

export function useAppointmentRestrictions(agendamentos: Agendamento[]) {
  const [restriction, setRestriction] = useState<AppointmentRestriction>({
    canSchedule: true,
    lastAppointmentDate: null,
    nextAvailableDate: null,
    daysRemaining: 0,
  })

  const calculateRestriction = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    // Encontrar agendamentos dos últimos 30 dias (excluindo cancelados)
    const recentAppointments = agendamentos.filter((agendamento) => {
      const appointmentDate = new Date(agendamento.data)
      return appointmentDate >= thirtyDaysAgo && agendamento.status !== "cancelado" && agendamento.status !== "CANCELED"
    })

    if (recentAppointments.length === 0) {
      setRestriction({
        canSchedule: true,
        lastAppointmentDate: null,
        nextAvailableDate: null,
        daysRemaining: 0,
      })
      return
    }

    // Encontrar o agendamento mais recente
    const lastAppointment = recentAppointments.reduce((latest, current) => {
      return new Date(current.data) > new Date(latest.data) ? current : latest
    })

    const lastAppointmentDate = new Date(lastAppointment.data)
    const nextAvailableDate = new Date(lastAppointmentDate)
    nextAvailableDate.setDate(lastAppointmentDate.getDate() + 30)

    const daysRemaining = Math.ceil((nextAvailableDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    setRestriction({
      canSchedule: daysRemaining <= 0,
      lastAppointmentDate: lastAppointment.data,
      nextAvailableDate: nextAvailableDate.toISOString().split("T")[0],
      daysRemaining: Math.max(0, daysRemaining),
      reason: daysRemaining > 0 ? `Você já agendou uma coleta nos últimos 30 dias` : undefined,
    })
  }

  useEffect(() => {
    calculateRestriction()
  }, [agendamentos])

  return restriction
}
