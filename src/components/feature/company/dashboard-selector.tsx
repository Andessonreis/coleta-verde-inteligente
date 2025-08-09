"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, Shield, User } from "lucide-react"

interface DashboardSelectorProps {
  currentDashboard: "admin" | "company" | "citizen"
}

export function DashboardSelector({ currentDashboard }: DashboardSelectorProps) {
  const router = useRouter()

  const dashboards = [
    {
      id: "admin",
      title: "Administrador",
      description: "Gerenciar coletas e rotas",
      icon: Shield,
      path: "/",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "company",
      title: "Empresa",
      description: "Solicitar coletas corporativas",
      icon: Building2,
      path: "/empresa",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "citizen",
      title: "Cidadão",
      description: "Solicitar coletas residenciais",
      icon: User,
      path: "/cidadao",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-green-800">Coleta Verde</span>
          </div>

          <div className="flex gap-2">
            {dashboards.map((dashboard) => {
              const Icon = dashboard.icon
              const isActive = currentDashboard === dashboard.id

              return (
                <Button
                  key={dashboard.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 ${isActive ? dashboard.color : ""}`}
                  onClick={() => router.push(dashboard.path)}
                >
                  <Icon className="h-4 w-4" />
                  {dashboard.title}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
