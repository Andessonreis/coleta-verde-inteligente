"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Calendar, Filter, MoreVertical, CheckCircle2, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RoutesList() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      address: "Av. Paulista, 1000 - Bela Vista",
      date: "Hoje, 14:30",
      status: "pendente",
      type: "Resíduos Recicláveis",
      client: "Condomínio Central Park",
    },
    {
      id: 2,
      address: "Rua Augusta, 500 - Consolação",
      date: "Hoje, 16:00",
      status: "pendente",
      type: "Resíduos Orgânicos",
      client: "Restaurante Verde Vida",
    },
    {
      id: 3,
      address: "Rua Oscar Freire, 200 - Jardins",
      date: "Hoje, 17:30",
      status: "concluido",
      type: "Resíduos Eletrônicos",
      client: "Loja TechGreen",
    },
    {
      id: 4,
      address: "Av. Brigadeiro Faria Lima, 3000 - Itaim Bibi",
      date: "Amanhã, 09:00",
      status: "agendado",
      type: "Resíduos Recicláveis",
      client: "Empresa EcoSolutions",
    },
    {
      id: 5,
      address: "Rua Haddock Lobo, 400 - Cerqueira César",
      date: "Amanhã, 11:30",
      status: "agendado",
      type: "Resíduos Orgânicos",
      client: "Mercado Natural",
    },
  ])

  const getStatusBadge = (status) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pendente
          </Badge>
        )
      case "concluido":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Concluído
          </Badge>
        )
      case "agendado":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Agendado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const completeRoute = (id) => {
    setRoutes(routes.map((route) => (route.id === id ? { ...route, status: "concluido" } : route)))
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-blue-600" />
            Lista de Rotas
          </CardTitle>
          <CardDescription>Agendamentos e coletas</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-4 w-4 mr-1" />
            Filtrar
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-green-600 hover:bg-green-700">
            <Calendar className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente/Endereço</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <div className="font-medium">{route.client}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      {route.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{route.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>{route.type}</TableCell>
                  <TableCell>{getStatusBadge(route.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {route.status === "pendente" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          onClick={() => completeRoute(route.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Concluir
                        </Button>
                      )}
                      {route.status === "agendado" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar rota</DropdownMenuItem>
                          <DropdownMenuItem>Reagendar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Cancelar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
