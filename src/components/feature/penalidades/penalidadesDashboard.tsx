"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, XCircle, BarChart3 } from "lucide-react"
import type { Penalidade } from "@/types/penalidade"

interface PenalidadesDashboardProps {
  penalidadesPendentes: Penalidade[]
  penalidadesAnalisadas: Penalidade[]
  totalPenalidades: number
}

export function PenalidadesDashboard({
  penalidadesPendentes,
  penalidadesAnalisadas,
  totalPenalidades,
}: PenalidadesDashboardProps) {
  const aprovadas = penalidadesAnalisadas.filter((p) => p.status === "APPROVED").length
  const rejeitadas = penalidadesAnalisadas.filter((p) => p.status === "REJECTED").length

  const cards = [
    {
      title: "Pendentes",
      value: penalidadesPendentes.length,
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      title: "Aprovadas",
      value: aprovadas,
      icon: CheckCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      title: "Rejeitadas",
      value: rejeitadas,
      icon: XCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Total",
      value: totalPenalidades,
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className={`${card.bgColor} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${card.textColor} opacity-80`}>{card.title}</p>
                    <p className={`text-3xl font-bold ${card.textColor} mt-1`}>{card.value}</p>
                  </div>
                  <div className={`bg-gradient-to-r ${card.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
