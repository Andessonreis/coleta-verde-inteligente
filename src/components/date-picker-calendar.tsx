"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { useAvailableDates } from "@/hooks/useAvailableDates"

interface DatePickerCalendarProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  minDate?: string
}

export function DatePickerCalendar({ selectedDate, onDateSelect, minDate }: DatePickerCalendarProps) {
  const { availability, loading, getDayInfo, isDateAvailable } = useAvailableDates()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Navegar entre meses
  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  // Gerar dias do calendário
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  // Obter classe CSS para o dia
  const getDayClassName = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
    const isSelected = dateString === selectedDate
    const isToday = dateString === new Date().toISOString().split("T")[0]
    const dayInfo = getDayInfo(dateString)
    const isAvailable = isDateAvailable(dateString)
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

    let className = "relative w-10 h-10 text-sm rounded-lg transition-all duration-200 "

    if (!isCurrentMonth) {
      className += "text-gray-300 cursor-not-allowed "
    } else if (isPast) {
      className += "text-gray-400 cursor-not-allowed bg-gray-50 "
    } else if (isSelected) {
      className += "bg-green-600 text-white font-semibold shadow-lg "
    } else if (isAvailable && dayInfo) {
      className += "bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer border border-green-200 "
    } else if (dayInfo && !isAvailable) {
      className += "bg-red-50 text-red-700 cursor-not-allowed border border-red-200 "
    } else {
      className += "text-gray-500 cursor-not-allowed "
    }

    if (isToday && !isSelected) {
      className += "ring-2 ring-blue-500 "
    }

    return className
  }

  // Obter indicador de capacidade
  const getCapacityIndicator = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const dayInfo = getDayInfo(dateString)

    if (!dayInfo || date.getMonth() !== currentMonth.getMonth()) return null

    const percentage = (dayInfo.currentAppointments / dayInfo.maxAppointments) * 100

    return (
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              percentage >= 100 ? "bg-red-500" : percentage >= 80 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    )
  }

  // Lidar com clique no dia
  const handleDayClick = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

    if (isCurrentMonth && !isPast && isDateAvailable(dateString)) {
      onDateSelect(dateString)
    }
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Carregando disponibilidade...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header do calendário */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded" />
          <span className="text-gray-600">Disponível</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded" />
          <span className="text-gray-600">Indisponível</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-600 rounded" />
          <span className="text-gray-600">Selecionado</span>
        </div>
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {dayNames.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Dias do calendário */}
        {calendarDays.map((date, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => handleDayClick(date)}
              className={getDayClassName(date)}
              disabled={
                date.getMonth() !== currentMonth.getMonth() ||
                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                !isDateAvailable(date.toISOString().split("T")[0])
              }
            >
              {date.getDate()}
              {getCapacityIndicator(date)}
            </button>
          </div>
        ))}
      </div>

      {/* Informações da data selecionada */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="font-medium">Data selecionada:</span>
            <span>{new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}</span>
          </div>

          {(() => {
            const dayInfo = getDayInfo(selectedDate)
            if (!dayInfo) return null

            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {dayInfo.available ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={dayInfo.available ? "text-green-700" : "text-red-700"}>
                    {dayInfo.available ? "Data disponível" : "Data indisponível"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {dayInfo.currentAppointments} de {dayInfo.maxAppointments} agendamentos
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((dayInfo.currentAppointments / dayInfo.maxAppointments) * 100)}% ocupado
                  </Badge>
                </div>

                {dayInfo.reason && <p className="text-sm text-red-600 mt-1">{dayInfo.reason}</p>}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
