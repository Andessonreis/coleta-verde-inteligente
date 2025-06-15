import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, CheckCircle, UserCheck, UserPlus, Clock } from "lucide-react"
import { AppointmentStats } from '@/types/index'

interface StatsCardsProps {
  stats: AppointmentStats
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Total de Agendamentos",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Agendados",
      value: stats.scheduledAppointments,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Concluídos",
      value: stats.completedAppointments,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Funcionários",
      value: stats.totalEmployees,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Ativos",
      value: stats.activeEmployees,
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      title: "Atribuídos",
      value: stats.assignedAppointments,
      icon: UserPlus,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
