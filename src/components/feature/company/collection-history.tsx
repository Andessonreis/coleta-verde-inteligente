"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, CheckCircle2, Calendar } from "lucide-react"

export function CollectionHistory() {
  const history = [
    {
      id: 1,
      date: "2024-01-10",
      type: "Resíduos Recicláveis",
      weight: "45kg",
      status: "concluido",
    },
    {
      id: 2,
      date: "2024-01-08",
      type: "Resíduos Orgânicos",
      weight: "32kg",
      status: "concluido",
    },
    {
      id: 3,
      date: "2024-01-05",
      type: "Resíduos Eletrônicos",
      weight: "18kg",
      status: "concluido",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center">
          <History className="mr-2 h-5 w-5 text-green-600" />
          Histórico Recente
        </CardTitle>
        <CardDescription>Últimas coletas realizadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">{item.type}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{item.weight}</div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  Concluído
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}