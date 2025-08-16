"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AppointmentChartsProps {
  stats: {
    totalAppointments: number
    scheduledAppointments: number
    completedAppointments: number
    assignedAppointments: number
    totalEmployees: number
    activeEmployees: number
  }
}

export function AppointmentCharts({ stats }: AppointmentChartsProps) {

  const cancelledAppointments = stats.totalAppointments - (stats.scheduledAppointments + stats.completedAppointments);

  const chartData = [
    {
      name: "Marcados",
      value: stats.scheduledAppointments,
      color: "#3b82f6", // blue-500
    },
    {
      name: "Concluídos",
      value: stats.completedAppointments,
      color: "#10b981", // green-500
    },
    {
      name: "Cancelados",
      value: cancelledAppointments,
      color: "#ef4444", // red-500
    },
  ]

  const barData = [
    { status: "Marcados", quantidade: stats.scheduledAppointments },
    { status: "Concluídos", quantidade: stats.completedAppointments },
    { status: "Cancelados", quantidade: cancelledAppointments },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pizza */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              marcados: {
                label: "Marcados",
                color: "#3b82f6",
              },
              concluidos: {
                label: "Concluídos",
                color: "#10b981",
              },
              cancelados: {
                label: "Cancelados",
                color: "#ef4444",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quantidade por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              quantidade: {
                label: "Quantidade",
                color: "#3b82f6",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantidade" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Card de Resumo */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalAppointments}</div>
              <div className="text-sm text-gray-600">Total de Agendamentos</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completedAppointments}</div>
              <div className="text-sm text-gray-600">Concluídos</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.scheduledAppointments}</div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{cancelledAppointments}</div>
              <div className="text-sm text-gray-600">Cancelados</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
